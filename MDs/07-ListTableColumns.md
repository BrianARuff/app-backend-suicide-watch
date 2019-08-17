### List Table Columns in psql console

```
SELECT
   COLUMN_NAME
FROM
   information_schema.COLUMNS
WHERE
   TABLE_NAME = 'users';
```

#### Example Output

```
  column_name
---------------
 id
 username
 password
 date_of_birth
 gender
 created_at
 updated_at
 role
 description
 image
 friends
(11 rows)
 ```
 