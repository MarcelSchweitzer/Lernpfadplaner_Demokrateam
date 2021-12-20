CREATE DATABASE users
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- \c users (conncect to database users)

CREATE TABLE IF NOT EXISTS public.users
(
    uid bigint NOT NULL,
    nickname text,
    CONSTRAINT users_pkey PRIMARY KEY (uid)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;
CREATE TABLE IF NOT EXISTS public.user_session 
(
    sid bigint NOT NULL,
    uid bigint NOT NULL,
    info text NOT NULL,
    expire timestamp(6) without time zone NOT NULL,
    CONSTRAINT user_session_pkey PRIMARY KEY (sid),
    CONSTRAINT user_session_uid_fkey FOREIGN KEY (uid)
        REFERENCES public.users (uid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_session
    OWNER to postgres;

CREATE INDEX IF NOT EXISTS "IDX_session_expire"
    ON public.user_session USING btree
    (expire ASC NULLS LAST)
    TABLESPACE pg_default;
CREATE TABLE IF NOT EXISTS public.user_learningpath
(
    id bigint NOT NULL,
    owner bigint NOT NULL,
    name text COLLATE pg_catalog."default",
    properties json,
    CONSTRAINT user_learningpath_pkey PRIMARY KEY (id),
    CONSTRAINT user_learningpath_owner_fkey FOREIGN KEY (owner)
        REFERENCES public.users (uid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_learningpath
    OWNER to postgres;