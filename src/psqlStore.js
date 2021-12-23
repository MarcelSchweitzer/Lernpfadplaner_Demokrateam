module.exports = function(session) {
    const dbMan = require('./dbManager.js');
    const unique = require('./uniqueIdentifiers.js');
    const moment = require('moment');
    const Store = session.Store

    const noop = () => {}

    class PsqlStore extends Store {
        constructor(options = {}) {
            super(options)
        }

        get(sid, cb = noop, showTombs = false) {
            dbMan.selectMatch('public.session', 'sess', 'sid', sid, (data) => {
                if (data.length == 0) return cb()
                return cb(null, data[0]['sess'])
            });
        }

        set(sid, sess, cb = noop) {

            // TODO REPLACE MOMENT: PRODUCES RARE ERRORS WITH INCRORECT FORMAT!!!!
            let exp = moment().add(1, "years");
            let exp_format = exp.format('YYYY-MM-DD 00:00:00');

            sess.lastModified = Date.now()
            sess.expires = exp;

            let value

            try {
                value = JSON.stringify(sess)
            } catch (er) {
                return cb(er)
            }

            let _sess = {
                'sid': sid,
                'sess': value,
                'expire': exp_format
            }

            dbMan.insert('public.session', _sess, () => {
                dbMan.select('public.user', 'uid, nickname', '', (result) => {
                    let uids = [];
                    let names = [];
                    for (let i = 0; i < result.length; i++) {
                        uids.push(result[i].uid);
                        names.push(result[i].nickname);
                    }
                    let uid = unique.uniqueId(uids);
                    let nickname = unique.createUniqueUserName(names);
                    let _user = {
                        'uid': uid,
                        'nickname': nickname,
                        'latestsession': sid
                    }
                    dbMan.insert('public.user', _user, cb)
                })
            });
        }

        touch(sid, sess, cb = noop) {
            // Touch disabled
            return cb()
        }

        destroy(sid, cb = noop) {
            // destroy disabled
            return cb()
        }

    }

    return PsqlStore
}