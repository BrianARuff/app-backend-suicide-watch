`


-- ======= CREATE ARTICLES TABLE =======

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

CREATE TABLE ARTICLES (
  id SERIAL NOT NULL PRIMARY KEY,

  title         VARCHAR(255)    NOT NULL CHECK (title <> '') UNIQUE,
  text          TEXT            NOT NULL CHECK (text <> '') UNIQUE,

  author        VARCHAR(255)    NOT NULL CHECK (author <> ''),

  likes         BIGINT          NOT NULL DEFAULT 0,
  dislikes      BIGINT          NOT NULL DEFAULT 0,
  read_time     BIGINT          NOT NULL DEFAULT  0,

  created_at    TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

  user_id       BIGINT          REFERENCES USERS(id)
); 


`
// SEPARATOR!!

`

-- ======= TEST DATA BETWEEN USERS AND ARTICLE TABLES =======

INSERT INTO ARTICLES (title, text, author, likes, dislikes, read_time, user_id) -- WITH USER_ID
VALUES ('novel1', 'this is novel 1', 'test1', 5, 1, 60000, 1);
INSERT INTO ARTICLES (title, text, author, likes, dislikes, read_time, user_id) -- WITH USER_ID
VALUES ('novel12', 'this is novel 12', 'test1', 5, 1, 60000, 1);
INSERT INTO ARTICLES (title, text, author, likes, dislikes, read_time, user_id) -- WITH USER_ID
VALUES ('novel13', 'this is novel 13', 'test1', 5, 1, 60000, 1);

INSERT INTO ARTICLES (title, text, author, likes, dislikes, read_time) -- WITHOUT USER_ID
VALUES ('novel2', 'this is novel 2', 'test2', 10, 2, 120000);
INSERT INTO ARTICLES (title, text, author, likes, dislikes, read_time, user_id) -- WITHOUT USER_ID
VALUES ('novel3', 'this is novel 3', 'test2', 10, 2, 120000, 2);
INSERT INTO ARTICLES (title, text, author, likes, dislikes, read_time, user_id) -- WITHOUT USER_ID
VALUES ('novel4', 'this is novel 4', 'test2', 25, 25, 120000, 2);


SELECT * FROM ARTICLES
INNER JOIN USERS on ARTICLES.user_id = USERS.id -- MATCHES AT USER WITH ID 1
WHERE USERS.id = 1;


SELECT *, USERS.updated_at as U, USERS.created_at as C FROM ARTICLES
JOIN USERS on ARTICLES.user_id = USERS.id -- MATCHES WITH USER AT ID 2
WHERE USERS.id = 2;

SELECT * FROM ARTICLES
WHERE ARTICLES.user_id IS NULL; -- WHERE ARTICLES USER_ID IS NULL


select * from ARTICLES where user_id = 1;
select * from USERS;



`
