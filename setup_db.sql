CREATE DATABASE users
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- \c users (conncect to database users)

CREATE TABLE IF NOT EXISTS public.session (
    sid varchar NOT NULL COLLATE "default",
    sess json NOT NULL,
	expire timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

CREATE TABLE IF NOT EXISTS public.user
(
    uid bigint NOT NULL,
    nickname varchar NOT NULL,
	  latestSession varchar
);

CREATE TABLE IF NOT EXISTS public.learningpath
(
    lpid bigint NOT NULL,
    title varchar,
    content json,
    owner bigint,
    lastEdit timestamp(6),
    created timestamp(6),
    CONSTRAINT learningpath_pkey PRIMARY KEY (lpid)
)