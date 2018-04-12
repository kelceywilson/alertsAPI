DROP TABLE IF EXISTS searches;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS votes;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name varchar(50) NOT NULL,
  last_name varchar(50),
  display_name varchar(100),
  username varchar(50) UNIQUE,
  email varchar(50) UNIQUE NOT NULL,
  password varchar(255) NOT NULL,
  biographical varchar(255)
);

CREATE TABLE alerts (
  id SERIAL PRIMARY KEY,
  alert_type_id text,
  address varchar(50),
  city varchar(50),
  state varchar(2),
  zip varchar(10),
  county varchar(50),
  public BOOLEAN,
  title varchar(100),
  body text,
  price_value text,
  item_or_unit_id text,
  measurement_id text,
  discount text,
  category_id text,
  quantity text,
  acreage text,
  frequency text,
  expires text,
  photo_url text,
  event_date text,
  event_time text,
  venue_name text,
  rsvp_link text,
  company text,
  goal text,
  url text,
  deadline text,
  job_title text,
  compensation text,
  need_have text,
  item_for_trade text,
  note text,
  created_at timestamp NOT NULL default CURRENT_TIMESTAMP,
  user_id INTEGER NOT NULL REFERENCES users(id)
);

CREATE TABLE searches (
  id SERIAL PRIMARY KEY,
  search_term varchar(255) NOT NULL,
  created_at timestamp NOT NULL default CURRENT_TIMESTAMP,
  user_id INTEGER NOT NULL REFERENCES users(id)
);

CREATE TABLE votes (
  photo_id SERIAL PRIMARY KEY,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0
);
