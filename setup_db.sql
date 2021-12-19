CREATE DATABASE users WITH ENCODING 'UTF8';

\c users

CREATE TABLE "users" (
    "uid" bigint NOT NULL,
    PRIMARY KEY ("uid")
);
CREATE TABLE "user_session" (
  "sid" bigint NOT NULL,
  "uid" bigint NOT NULL,
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL,
  PRIMARY KEY ("sid"),
  FOREIGN KEY ("uid") REFERENCES users("uid")
);
CREATE INDEX "IDX_session_expire" ON "user_session" ("expire");
CREATE TABLE "user_learningpath" (
  "id" bigint NOT NULL,
  "owner" bigint NOT NULL,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("owner") REFERENCES users("uid")
);