### Setup Users Table in PG database console

```
  DROP EXTENSION IF EXISTS pgcrypto;
  DROP TYPE IF EXISTS genderEnum;
  DROP TYPE IF EXISTS roleEnum;
  -----------------------------------------------

  CREATE OR REPLACE FUNCTION trigger_set_timestamp()
  RETURNS TRIGGER AS $$
  BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
      END;
  $$ LANGUAGE plpgsql;

  -----------------------------------------------
  DROP EXTENSION IF EXISTS pgcrypto;
  CREATE EXTENSION pgcrypto;

  -----------------------------------------------
  
  CREATE TYPE genderEnum AS ENUM ('male', 'female', 'other');
  CREATE TYPE roleEnum AS ENUM ('banned', 'suspended', 'member', 'admin', 'developer');

  -----------------------------------------------
  CREATE TABLE users
  (
  id            serial       NOT NULL PRIMARY KEY,
  username      varchar(33)  NOT NULL UNIQUE,
  password      varchar(255) NOT NULL,
  date_of_birth date         NOT NULL,
  gender        genderEnum   NOT NULL,
  created_at    timestamptz  NOT NULL DEFAULT NOW(),
  updated_at    timestamptz  NOT NULL DEFAULT NOW(),
  role          roleEnum     NOT NULL DEFAULT 'member',
  description   text,
  image         jsonb,
  friends       jsonb
  );

  -----------------------------------------------
  CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp();
```
