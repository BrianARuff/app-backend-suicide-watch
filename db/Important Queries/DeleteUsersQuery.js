
const deletUserTableQueryStringLiteral =
`
  DROP TABLE users;
  DROP EXTENSION pgcrypto;
  DROP FUNCTION trigger_set_timestamp;
  DROP TYPE genderEnum;
  DROP TYPE roleEnum;
`;

module.exports = deletUserTableQuery;
