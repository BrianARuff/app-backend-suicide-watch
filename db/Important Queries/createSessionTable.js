// local version

`

CREATE TABLE session (
  sid character varying NOT NULL,
  sess json NOT NULL,
  expire timestamp(6) without time zone NOT NULL
);

`

// HEROKU VERSION

`

CREATE TABLE public.session (
  sid character varying NOT NULL,
  sess json NOT NULL,
  expire timestamp(6) without time zone NOT NULL
);

`