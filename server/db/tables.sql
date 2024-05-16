DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS login_history CASCADE;
DROP TABLE IF EXISTS followers CASCADE;
DROP TABLE IF EXISTS muted CASCADE;
DROP TABLE IF EXISTS maps CASCADE;
DROP TABLE IF EXISTS points CASCADE;
DROP TABLE IF EXISTS rides CASCADE;
DROP TABLE IF EXISTS runs CASCADE;
DROP TABLE IF EXISTS map_users CASCADE;
DROP TABLE IF EXISTS ride_users CASCADE;
DROP TABLE IF EXISTS ride_message CASCADE;
DROP TABLE IF EXISTS run_message CASCADE;
DROP TABLE IF EXISTS user_messages CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255),
  isadmin BOOLEAN DEFAULT false,
  issuperadmin BOOLEAN DEFAULT false,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  isselected BOOLEAN DEFAULT false,
  isactive BOOLEAN DEFAULT true,
  refreshtoken VARCHAR(255),
  profile_picture VARCHAR(255),
  location VARCHAR(255)
);

CREATE TABLE login_history (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE followers (
  follower_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  followee_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20),
  lastmodification timestamp,
  newrequest boolean DEFAULT false,
  PRIMARY KEY (follower_id, followee_id),
  CHECK (follower_id <> followee_id) -- Users cannot follow themselves
);

CREATE TABLE muted (
  muter INTEGER REFERENCES users(id) ON DELETE CASCADE,
  mutee INTEGER REFERENCES users(id) ON DELETE CASCADE,
  mute boolean DEFAULT false,
  PRIMARY KEY (muter, mutee),
  CHECK (muter <> mutee) -- Users cannot mute themselves
);

CREATE TABLE maps (
  id SERIAL PRIMARY KEY NOT NULL,
  title VARCHAR(255),
  createdBy INTEGER REFERENCES users(id) ON DELETE CASCADE,
  createdAt timestamp,
  mapType VARCHAR(10) DEFAULT 'public',
  isActive boolean DEFAULT true
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
  rideType VARCHAR(10) DEFAULT 'public',
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

CREATE TABLE runs (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255),
  distance INTEGER,
  pace INTEGER,
  isSelected boolean DEFAULT false,
  isActive boolean DEFAULT true,
  createdBy INTEGER REFERENCES users(id) ON DELETE CASCADE,
  createdAt timestamp,
  runType VARCHAR(10) DEFAULT 'public',
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

CREATE TABLE ride_message (
  id SERIAL PRIMARY KEY,
  createdat timestamp,
  createdby INTEGER REFERENCES users(id) ON DELETE CASCADE,
  ride_id INTEGER REFERENCES rides(id) ON DELETE CASCADE,
  reportedat timestamp,
  reportedby INTEGER REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20),
  message TEXT
);

CREATE TABLE run_message (
  id SERIAL PRIMARY KEY,
  createdat timestamp,
  createdby INTEGER REFERENCES users(id) ON DELETE CASCADE,
  run_id INTEGER REFERENCES rides(id) ON DELETE CASCADE,
  reportedat timestamp,
  reportedby INTEGER REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20),
  message TEXT
);

CREATE TABLE user_messages (
    id SERIAL PRIMARY KEY,
    sender INTEGER REFERENCES users(id) ON DELETE CASCADE,
    receiver INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT,
    date timestamp
);




