DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS maps CASCADE;
DROP TABLE IF EXISTS points CASCADE;
DROP TABLE IF EXISTS rides CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  username VARCHAR(255),
  roles json DEFAULT ('{"Registered_user": 2001}'),
  email VARCHAR(255),
  password VARCHAR(255),
  isSelected boolean DEFAULT false,
  isActive boolean DEFAULT true,
  refreshToken VARCHAR (255)
);

CREATE TABLE maps (
  id SERIAL PRIMARY KEY NOT NULL,
  title VARCHAR(255),
  createdBy INTEGER REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE points (
  id SERIAL PRIMARY KEY NOT NULL,
  lat NUMERIC,
  lng NUMERIC,
  map INTEGER REFERENCES maps(id) ON DELETE CASCADE
);

CREATE TABLE rides (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255),
  distance smallint,
  speed smallint,
  isSelected boolean DEFAULT false,
  isActive boolean DEFAULT true,
  createdBy INTEGER REFERENCES users(id) ON DELETE CASCADE,
  createdAt timestamp,
  isPrivate boolean DEFAULT true,
  image VARCHAR(255),
  gpx VARCHAR(255),
  starting_date DATE,
  starting_time TIME,
  details TEXT,
  map INTEGER REFERENCES maps(id) ON DELETE CASCADE
);



