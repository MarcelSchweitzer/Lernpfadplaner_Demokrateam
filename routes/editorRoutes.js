const express = require('express');
const sptk = require('../backend/src/js/helpers/scriptPackToolkit.cjs');
const fst = require('../backend/src/js/helpers/fileSystemToolkit.cjs');

const scriptPacks = fst.readJson('./views/scriptPacks.json');
const stylePacks = fst.readJson('./views/stylePacks.json');

const scrPack = new sptk.scriptPacker(scriptPacks, stylePacks);

let router = express.Router();




router.get('/', function (req, res) {

    // lpSess.openLearningPath(req.query.id);
  
    // return ejs rendered page for home screen
    res.render('editor', {data: {
      js : scrPack.packScripts('editor'),
      // currentLearningPath: lpSess.getCurrentLearningPath()
    }});
  
  })
  
  router
    .route('/^id=*')
    .get((req, res) => {})
    .post((req, res) => {});

    module.exports = router;