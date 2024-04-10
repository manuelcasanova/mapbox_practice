-- Insert users
INSERT INTO users (username, roles, email, password, is_selected, is_active, follows, followed)
VALUES ('Manuel Casanova', '{"Super_admin": 2010}', 'manuel@example.com', 'password123', true, true, '[]', '[]'),
       ('Laura Admin', '{"Registered_user": 2005}', 'laura@example.com', 'password456', true, true, '[]', '[]'),
       ('Alice_wonder', '{"Registered_user": 2001}', 'alice@example.com', 'password789', true, true, '[4, 5]', '[]'),
       ('Bob_robinson', '{"Registered_user": 2001}', 'bob@example.com', 'passwordabc', true, true, '[3]', '[3]'),
       ('Emma_jones', '{"Registered_user": 2001}', 'emma@example.com', 'passwordxyz', true, true, '[]', '[3]');


-- INSERT INTO followers (follower_id, followee_id, status, mute) VALUES
-- (1, 2, 'accepted', false), 
-- (1, 3, 'pending', false),
-- (1, 4, 'accepted', false),
-- (1, 5, 'accepted', false), 
-- (2, 1, 'pending', false),  
-- (3, 1, 'accepted', true),
-- (3, 2, 'accepted', false),
-- (4, 1, 'accepted', false),
-- (5, 1, 'pending', false); 

INSERT INTO maps (title, createdBy, createdAt, mapType) VALUES 
('Stanley Park Loop PRIVATE', 1, Now(), 'private'),
('Grouse Mountain FOLLOWERS', 5, Now(), 'followers'),
('User1 Public Map PUBLIC', 1, Now(), 'public');

-- INSERT INTO map_users (map_id, user_id)
-- VALUES
--     (2, 1),
--     (2, 2),
--     (2, 4),
--     (2, 5);


INSERT INTO points (lat, lng, map) VALUES


(49.2950770378737, -123.13649053685369, 1),
(49.29538482702951, -123.13628668896855, 1),
(49.29603089382501, -123.13586151693019, 1),
(49.29626173140482, -123.13594734761865, 1),
(49.29689043589843, -123.13550080172718, 1),
(49.296904425841575, -123.13487852923575, 1),
(49.29714225426767, -123.13376273028553, 1),
(49.29743728727989, -123.13290953636171, 1),
(49.29737015263682, -123.13203601632269, 1),
(49.29771290176496, -123.13112406525764, 1),
(49.297908757339414, -123.13027648720892, 1),
(49.29762896342334, -123.1296434858814, 1),
(49.297153692656266, -123.12931411899628, 1),
(49.29662906972358, -123.1288849655539, 1),
(49.2963926870138, -123.12831684015691, 1),
(49.296504607578086, -123.12770529650155, 1),
(49.29706500502396, -123.12714974395932, 1),
(49.29776840211826, -123.12603448983283, 1),
(49.29803420562423, -123.12507962342353, 1),
(49.29794327300718, -123.12387799378486, 1),
(49.29788731439025, -123.1226978218183, 1),
(49.29818109642042, -123.12225793953986, 1),
(49.29857285771633, -123.12140461988749, 1),
(49.29848892083929, -123.1200742442161, 1),
(49.29829733001028, -123.11873414553703, 1),
(49.2982763456871, -123.11786510981621, 1),
(49.298654062137054, -123.11730721034111, 1),
(49.29937530562422, -123.1170720141381, 1),
(49.299662084206, -123.11702909879389, 1),
(49.29989096488544, -123.11691074632111, 1),
(49.30050648115299, -123.11680345796051, 1),
(49.30065336458065, -123.11713605187836, 1),
(49.300457519913124, -123.1176510360092, 1),
(49.2999736698665, -123.1179567659274, 1),
(49.29950503379455, -123.11882580164823, 1),
(49.29958896894101, -123.12036002520475, 1),
(49.29999511794763, -123.12213636003436, 1),
(49.30068352808751, -123.12388193327935, 1),
(49.301407692607924, -123.1251649511978, 1),
(49.301995076341136, -123.12586706131698, 1),
(49.302442706185346, -123.1265000626445, 1),
(49.30243571200032, -123.12726181000473, 1),
(49.30261496499985, -123.12923910096289, 1),
(49.30310725852063, -123.1310967821628, 1),
(49.3039967293815, -123.13168280292304, 1),
(49.305035977757036, -123.13251487445088, 1),
(49.305764886495375, -123.1332145119086, 1),
(49.30629342805733, -123.13427230808885, 1),
(49.30676535976681, -123.13564761076125, 1),
(49.30721993978476, -123.13604457769546, 1),
(49.30784670149769, -123.13613686244936, 1),
(49.308448131732625, -123.1363407103345, 1),
(49.309724125147056, -123.13716888427736, 1),
(49.31013229401271, -123.13749996945263, 1),
(49.31034208635831, -123.13860503956677, 1),
(49.31100478391491, -123.13936410471798, 1),
(49.31157820405407, -123.13961086794735, 1),
(49.31184701976245, -123.13996156677605, 1),
(49.31130856739527, -123.14030488952996, 1),
(49.309940748450316, -123.14061015844347, 1),
(49.30903619642993, -123.14093910623345, 1),
(49.30821169644004, -123.14157051499933, 1),
(49.308330583513516, -123.14225716050714, 1),
(49.30879214237394, -123.14290089067073, 1),
(49.30941880213492, -123.14307175576688, 1),
(49.30990545503381, -123.1425783969462, 1),
(49.31055477336336, -123.14230150077495, 1),
(49.31108624101252, -123.14259117934856, 1),
(49.3118246481016, -123.1428656028584, 1),
(49.312360281327855, -123.14298362005503, 1),
(49.31257006418542, -123.14442128408702, 1),
(49.31196933984813, -123.14543587155642, 1),
(49.31103928437209, -123.14820030704142, 1),
(49.310499703196875, -123.14934514928609, 1),
(49.30956380143575, -123.15013246145101, 1),
(49.30933302616072, -123.1509585818276, 1),
(49.30831342795168, -123.15297321416439, 1),
(49.30746020439213, -123.1535715982318, 1),
(49.30674768460569, -123.15384950023147, 1),
(49.305894461250006, -123.1536241946742, 1),
(49.305317341468644, -123.15360676031561, 1),
(49.304107457913354, -123.15347851719709, 1),
(49.30331314662157, -123.15335002262148, 1),
(49.303040377487434, -123.15333929378542, 1),
(49.302302439800286, -123.15364724490794, 1),
(49.30182825231349, -123.15416767727585, 1),
(49.3016394066141, -123.15468266140671, 1),
(49.30148553180544, -123.15631344448776, 1),
(49.30103581680876, -123.15694724209608, 1),
(49.300581179736575, -123.1573120225221, 1),
(49.30006495392797, -123.15792507492009, 1),
(49.29938648062115, -123.15787143073976, 1),
(49.29871488339554, -123.15763514488937, 1),
(49.29815336316562, -123.1574412295595, 1),
(49.29788056547071, -123.15700134728105, 1),
(49.29776165318246, -123.1562181422487, 1),
(49.297978493022086, -123.15466246102007, 1),
(49.29750068451468, -123.1533744139597, 1),
(49.29674490315085, -123.15206608269365, 1),
(49.29612051407813, -123.15069002564996, 1),
(49.29577750795375, -123.14985774457456, 1),
(49.29593661959144, -123.14906565472485, 1),
(49.2960065706212, -123.14658729359509, 1),
(49.29646824492756, -123.14584700390698, 1),
(49.29675536831539, -123.14422921277584, 1),
(49.296629458303265, -123.14309195615353, 1),
(49.29704915709281, -123.14191178418697, 1),
(49.29755415711002, -123.14014718402177, 1),
(49.29781832235562, -123.13805024139585, 1),
(49.29743994372924, -123.13735906966033, 1),
(49.29715225052608, -123.13702572137119, 1),
(49.297433440662765, -123.13629561569543, 1),
(49.297349501845204, -123.1359308352694, 1),

(49.324486581806134, -123.12234959565104, 2),
(49.32703240707711, -123.11928601004185, 2),
(49.329461777080056, -123.11776997521521, 2),
(49.33016080700327, -123.11727644875646, 2),
(49.33140347202018, -123.11707025393846, 2),
(49.333078439803174, -123.11691032722592, 2),
(49.33409894518027, -123.1160734780133, 2),
(49.33562371160301, -123.11574985273185, 2),
(49.337084872192115, -123.11527526937427, 2),
(49.33790981712677, -123.11486966907981, 2),
(49.33860872708798, -123.11422593891623, 2),
(49.33966832118154, -123.11442492529751, 2),
(49.341429546943054, -123.11383777298035, 2),
(49.34299885589989, -123.11329345218839, 2),
(49.34431266254652, -123.11131934635343, 2),
(49.3456209201035, -123.11093436554074, 2),
(49.34706043819556, -123.11121331527829, 2),
(49.34854265888848, -123.11100108548999, 2),
(49.348682411473156, -123.10937030240896, 2),
(49.34992662870271, -123.10798854567112, 2),
(49.35614860740963, -123.10587823390962, 2),
(49.35833120361914, -123.10676654800774, 2),
(49.359081782994025, -123.10610295273365, 2),
(49.36000394511202, -123.10453654266895, 2),
(49.36071509407415, -123.10383330099286, 2),
(49.36198651328153, -123.10359726659956, 2),
(49.36384631944153, -123.10319929383698, 2),
(49.3656373492111, -123.10211911797525, 2),
(49.367208341692525, -123.10092603787781, 2),
(49.36878294006469, -123.0997221451253, 2),
(49.36952331946952, -123.09937882237139, 2),
(49.3701519347399, -123.09931444935503, 2),
(49.371343935286966, -123.09861539863051, 2),
(49.37194322590203, -123.09823184274138, 2),
(49.37236228301304, -123.09754519723357, 2),
(49.373493719368525, -123.09885411523284, 2),
(49.37294895696675, -123.10042052529755, 2),
(49.371957194529934, -123.0996909644455, 2),
(49.37121641525412, -123.09904522262516, 2),
(49.37037506480588, -123.09950325172397, 2),
(49.36979223441507, -123.09965940658005, 2),
(49.36915662983484, -123.09976669494064, 2),
(49.368116988283845, -123.10049730353059, 2),
(49.364344310511505, -123.10326689388604, 2),
(49.3638109345428, -123.10351382475348, 2),
(49.36300061330759, -123.10367475729437, 2),
(49.36196520766365, -123.10384348500521, 2),
(49.360881206499656, -123.10407851357014, 2),
(49.36051199009496, -123.10434245970103, 2),
(49.35973654475432, -123.10537242796275, 2),
(49.35910670472844, -123.10637536458674, 2),
(49.35842549691693, -123.10704302508385, 2),
(49.35754006548233, -123.10681210365146, 2),
(49.35662446158178, -123.10641346033664, 2),
(49.35605806129427, -123.10617373790592, 2),
(49.35507414566421, -123.10652611311527, 2),
(49.353891848879435, -123.10687584802511, 2),
(49.35282505545962, -123.1072749104351, 2),
(49.352004318119484, -123.10758214909583, 2),
(49.35075794260476, -123.10799009632322, 2),
(49.350028853559934, -123.10825944878161, 2),
(49.34889190945048, -123.10937554109843, 2),
(49.34871023178663, -123.1109741376713, 2),
(49.34845422782197, -123.11131041962655, 2),
(49.34783232288837, -123.11139625031502, 2),
(49.34683560448046, -123.11139327473938, 2),
(49.34600442169774, -123.11130798887463, 2),
(49.3455781518719, -123.11124361585827, 2),
(49.34451344386749, -123.11144658364358, 2),
(49.34365549694799, -123.11282364651564, 2),
(49.34305826639742, -123.11352653196084, 2),
(49.34224324903822, -123.11372782336551, 2),
(49.339579970722156, -123.11471284367144, 2),
(49.33892300860373, -123.1144875381142, 2),
(49.338544454224966, -123.11456490308048, 2),
(49.33798532631983, -123.11511207371953, 2),
(49.337360558894275, -123.11548687051983, 2),
(49.33619416317477, -123.11590977944435, 2),
(49.335687757214096, -123.11602050438525, 2),
(49.334769726137466, -123.1161704985425, 2),
(49.334095798957286, -123.11656004749241, 2),
(49.33320564285767, -123.1172807654366, 2),
(49.33268140377236, -123.11734513845296, 2),
(49.330464520627146, -123.11740041710438, 2),
(49.33008778528414, -123.11760434880856, 2),
(49.32957749366144, -123.1179905869067, 2),
(49.32899734726351, -123.11831521801653, 2),
(49.328110048101074, -123.11886674724519, 2),
(49.32711183790902, -123.1195266125724, 2),
(49.32623971523265, -123.12048093415798, 2),
(49.32531621012954, -123.12161006033422, 2),
(49.32457336280254, -123.12281956896189, 2),

(49.2950770378737, -123.13649053685369, 3),
(49.29538482702951, -123.13628668896855, 3);





-- Insert rides
INSERT INTO rides (name, distance, speed, isSelected, isActive, createdBy, createdAt, rideType, image, gpx, starting_date, starting_time, meeting_point, details, map)
VALUES 
  ('Stanley Park Bike Ride PUBLIC', 20, 23, false, true, 2, NOW(), 'public', 'stanley_park_bike.jpg', 'stanley_park_bike.gpx', '2024-03-10', '10:00:00', 'Vancouver Art Gallery', 'Enjoy a bike ride around Stanley Park.', 1),
  ('Grouse Mountain Parking Lot FOLLOWERS', 10, 18, false, true, 3, NOW(), 'followers', 'grouse.jpg', 'grouse.gpx', '2024-12-18', '11:00:00', 'Gas station', 'Experience the thrill of climbing one of the North Sore''s iconic mountains, part of the famous ''Triple Crown''.', 2),
    ('Stanley Park Short PUBLIC', 10, 18, false, true, 4, NOW(), 'public', 'stanley.jpg', 'stanley.gpx', '2024-12-19', '11:00:00', 'Bridge', 'Stanley short.', 3);


