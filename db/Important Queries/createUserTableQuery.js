const createUserTableQuery =
`
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

CREATE TABLE USERS (
  id            serial       NOT NULL PRIMARY KEY,
  name          varchar(15)  NOT NULL UNIQUE,
  password      varchar(255) NOT NULL,
  email         varchar(255) NOT NULL UNIQUE,
  date_of_birth date         NOT NULL,
  role          varchar(11)  NOT NULL DEFAULT 'member',
  description   varchar(5000),
  image         text,
  friends       jsonb,
  created_at    timestamptz  NOT NULL DEFAULT NOW(),
  updated_at    timestamptz  NOT NULL DEFAULT NOW()
);


CREATE TRIGGER set_timestamp
BEFORE UPDATE ON USERS
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

`


