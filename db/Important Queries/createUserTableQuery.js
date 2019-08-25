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
  id SERIAL NOT NULL PRIMARY KEY,
  
  name VARCHAR(15)  NOT NULL CHECK (name <> '') UNIQUE,
  email VARCHAR(255) NOT NULL CHECK (email <> '') UNIQUE,
  password VARCHAR(255) NOT NULL CHECK (password <> ''),
  
  date_of_birth date NOT NULL,
  
  description VARCHAR(255) UNIQUE,
  image TEXT,
  friends JSONB,

  role VARCHAR(255) DEFAULT 'member'),
  
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);


CREATE TRIGGER set_timestamp
BEFORE UPDATE ON USERS
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();


`