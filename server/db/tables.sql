DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS maps CASCADE;
DROP TABLE IF EXISTS points CASCADE;
DROP TABLE IF EXISTS rides CASCADE;
DROP TABLE IF EXISTS map_users CASCADE;
DROP TABLE IF EXISTS ride_users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255),
  roles JSONB DEFAULT '{"Registered_user": 2001}',
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  is_selected BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  refresh_token VARCHAR(255),
  follows JSONB,
  followed JSONB,
  profile_picture VARCHAR(255),
  location VARCHAR(255)
);

CREATE TABLE maps (
  id SERIAL PRIMARY KEY NOT NULL,
  title VARCHAR(255),
  createdBy INTEGER REFERENCES users(id) ON DELETE CASCADE,
  createdAt timestamp,
  isPrivate boolean DEFAULT false
);

CREATE TABLE points (
  id SERIAL PRIMARY KEY NOT NULL,
  lat NUMERIC,
  lng NUMERIC,
  map INTEGER REFERENCES maps(id) ON DELETE CASCADE,
  createdAt timestamp
);

CREATE TABLE rides (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255),
  distance INTEGER,
  speed INTEGER,
  isSelected boolean DEFAULT false,
  isActive boolean DEFAULT true,
  createdBy INTEGER REFERENCES users(id) ON DELETE CASCADE,
  createdAt timestamp,
  isPrivate boolean DEFAULT false,
  image VARCHAR(255),
  gpx VARCHAR(255),
  starting_date DATE,
  starting_time TIME,
  meeting_point TEXT,
  details TEXT,
   map INTEGER REFERENCES maps(id) ON DELETE SET NULL,
  comments JSONB,
  difficulty VARCHAR(50)
);

CREATE TABLE map_users (
  map_id INTEGER REFERENCES maps(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (map_id, user_id)
);

CREATE TABLE ride_users (
  ride_id INTEGER REFERENCES rides(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  isprivate boolean DEFAULT true
);




