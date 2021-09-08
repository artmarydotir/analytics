CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  created timestamp default NOW(),
  username VARCHAR NOT NULL UNIQUE,
  password VARCHAR,
  email VARCHAR NOT NULL UNIQUE,
  role CHAR(2),
  otp_secret CHAR(16),
  lang CHAR(2),
  options integer[] NOT NULL,
  mobile VARCHAR(24) NULL UNIQUE,
  aditional JSON
);

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL NOT NULL PRIMARY KEY,
  created timestamp default NOW(),
  hash CHAR(12) NOT NULL UNIQUE,
  title VARCHAR NOT NULL,
  description VARCHAR(200),
  options integer[] NOT NULL,
  aditional JSON
);


CREATE TABLE IF NOT EXISTS user_project (
  user_id INT,
  project_id INT,
  role INT default 0,
  PRIMARY KEY (user_id, project_id),
  CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id),
  CONSTRAINT fk_project FOREIGN KEY(project_id) REFERENCES projects(id)
);

CREATE TABLE IF NOT EXISTS domains (
  id SERIAL NOT NULL PRIMARY KEY,
  created timestamp default NOW(),
  domain VARCHAR NOT NULL,
  description VARCHAR(200),
  options integer[] NOT NULL,
  aditional JSON,
  project_id INT REFERENCES projects (id)
);



