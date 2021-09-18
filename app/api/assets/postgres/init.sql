CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  created timestamp default NOW(),
  username VARCHAR NOT NULL UNIQUE,
  email VARCHAR NOT NULL UNIQUE,
  password VARCHAR,
  role CHAR(2),
  otp_secret CHAR(32),
  lang CHAR(2),
  options integer[] NOT NULL,
  country CHAR(2),
  mobile VARCHAR(24) NULL UNIQUE,
  additional JSON
);

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL NOT NULL PRIMARY KEY,
  created timestamp default NOW(),
  privateToken CHAR(64) NOT NULL,
  publicToken CHAR(12) NOT NULL UNIQUE,
  title VARCHAR NOT NULL,
  description VARCHAR(200),
  options integer[] NOT NULL,
  additional JSON
);


CREATE TABLE IF NOT EXISTS user_project (
  user_id INT,
  project_id INT,
  role TEXT [] NOT NULL,
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
  additional JSON,
  project_id INT REFERENCES projects (id)
);



