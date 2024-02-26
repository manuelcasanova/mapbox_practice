-- Insert users
INSERT INTO users (username, roles, email, password, is_selected, is_active, friends)
VALUES ('john_doe_friends_jane_smith', '{"Registered_user": 2001}', 'john@example.com', 'password123', true, true, '[2]'),
       ('jane_smith_friends_john_alice', '{"Registered_user": 2001}', 'jane@example.com', 'password456', true, true, '[1,3]'),
       ('alice_wonder', '{"Registered_user": 2001}', 'alice@example.com', 'password789', true, true, '[]'),
       ('bob_robinson', '{"Registered_user": 2001}', 'bob@example.com', 'passwordabc', true, true, '[]'),
       ('emma_jones', '{"Registered_user": 2001}', 'emma@example.com', 'passwordxyz', true, true, '[]');


INSERT INTO maps (title, createdBy) VALUES 
('Stanley Park Loop', 1),
('Grouse Mountain', 1);



INSERT INTO points (lat, lng, map) VALUES
(49.29642612371167, -123.13666776796951, 1),
(49.299224749939654, -123.11710111091334, 1),
(49.32418146527994, -123.1220785938487, 2),
( 49.371821482995884, -123.09959410196836, 2);

-- Insert rides
INSERT INTO rides (name, distance, speed, isSelected, isActive, createdBy, createdAt, isPrivate, image, gpx, starting_date, starting_time, details, map)
VALUES 
  ('Cypress Mountain Trail', 15, 10, false, true, 1, NOW(), true, 'cypress_trail.jpg', 'cypress_trail.gpx', '2024-03-05', '09:00:00', 'Beautiful trail with scenic views.', 1),
  ('Stanley Park Bike Ride', 20, 15, false, true, 2, NOW(), true, 'stanley_park_bike.jpg', 'stanley_park_bike.gpx', '2024-03-10', '10:00:00', 'Enjoy a leisurely bike ride around Stanley Park.', 2),
  ('Lighthouse Park Hike', 8, 5, false, true, 3, NOW(), true, 'lighthouse_hike.jpg', 'lighthouse_hike.gpx', '2024-03-12', '08:30:00', 'Scenic hike with ocean views.', 1),
  ('Capilano Suspension Bridge Walk', 5, 3, false, true, 4, NOW(), true, 'capilano_bridge.jpg', 'capilano_bridge.gpx', '2024-03-18', '11:00:00', 'Experience the thrill of walking across a suspension bridge.', 2),
  ('Whistler Mountain Biking Adventure', 30, 20, false, true, 5, NOW(), true, 'whistler_bike.jpg', 'whistler_bike.gpx', '2024-03-25', '09:30:00', 'Exciting mountain biking trails in Whistler.', 1),
  ('English Bay Sunset Kayaking', 6, 4, false, true, 1, NOW(), true, 'english_bay_kayak.jpg', 'english_bay_kayak.gpx', '2024-03-30', '18:00:00', 'Enjoy a relaxing kayak trip at sunset.', 2),
  ('Gastown Walking Tour', 3, 2, false, true, 2, NOW(), true, 'gastown_tour.jpg', 'gastown_tour.gpx', '2024-04-05', '10:30:00', 'Explore the historic streets of Gastown.', 1);



-- INSERT INTO rides 
-- (name, 
-- distance, 
-- speed,
-- createdBy,
-- createdAt,
-- starting_date,
-- starting_time, 
-- details, 
-- map) 
-- VALUES
-- ('Fun Stanley ride', 
-- 10, 
-- 24,
-- 1,
-- current_timestamp,
-- '2022-12-02',
-- '10:00:00', 
-- 'Just around Stanley Park', 
-- 1),

-- ('Grouse climb', 
-- 5, 
-- 15, 
-- 1,
-- current_timestamp,
-- '2022-12-02',
-- '10:00:00', 
-- 'Up from marine drive to the gondola', 
-- 2),

-- ('Another fun Stanley ride', 
-- 10, 
-- 18, 
-- 1,
-- current_timestamp,
-- '2022-12-04',
-- '10:00:00', 
-- 'Again, just around Stanley Park', 
-- 1);