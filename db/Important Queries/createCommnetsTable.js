`
  CREATE OR REPLACE FUNCTION trigger_set_timestamp()
  RETURNS TRIGGER AS $$
  BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
      END;
  $$ LANGUAGE plpgsql;

  CREATE TABLE COMMENTS (
    id SERIAL NOT NULL PRIMARY KEY,

    author        VARCHAR(255)    NOT NULL CHECK (author <> ''),
    text          TEXT            NOT NULL CHECK (text <> ''),

    likes         BIGINT          DEFAULT 0,
    dislikes      BIGINT          DEFAULT 0,

    created_at    TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    author_id     BIGINT,
    article_id    BIGINT          REFERENCES ARTICLES(id)
  );
`;
