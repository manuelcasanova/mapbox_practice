Seemap -- Click to push user.id to

CREATE TABLE map_users (
  map_id INTEGER REFERENCES maps(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (map_id, user_id)
);


