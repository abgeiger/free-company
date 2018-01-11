-- startup commands

CREATE TABLE "users" (
  "user_id" serial primary key,
  "username" varchar(80) not null UNIQUE,
  "password" varchar(240) not null
);

CREATE TABLE "game" (
  "game_id" SERIAL PRIMARY KEY,
  "round" INT NOT NULL,
  "user_id" INT NOT NULL REFERENCES users
);

ALTER TABLE game
	ADD "finished" BOOLEAN DEFAULT false;

CREATE TABLE "faction" (
  "faction_id" SERIAL PRIMARY KEY,
  "name" VARCHAR(80) NOT NULL
);

CREATE TABLE "regiment_template" (
  "regiment_template_id" SERIAL PRIMARY KEY,
  "front" VARCHAR(80),
  "power" INT,
  "starting_power" INT,
  "morale" INT,
  "morale_ratio" INT,
  "is_friendly" BOOLEAN,
  "faction_id" INT REFERENCES faction,
  "game_id" INT REFERENCES game
);

ALTER TABLE regiment_template
	ADD "status" VARCHAR(100) DEFAULT 'fighting';
	
ALTER TABLE regiment_template
	ADD "current_event_trigger" VARCHAR(80) DEFAULT '';

CREATE TABLE "regiment" (
  "regiment_id" SERIAL PRIMARY KEY,
  "front" VARCHAR(80),
  "power" INT,
  "starting_power" INT,
  "morale" INT,
  "morale_ratio" INT,
  "is_friendly" BOOLEAN,
  "faction_id" INT REFERENCES faction,
  "game_id" INT NOT NULL REFERENCES game
);

ALTER TABLE regiment
	ADD "status" VARCHAR(100) DEFAULT 'fighting';
	
ALTER TABLE regiment
	ADD "current_event_trigger" VARCHAR(80) DEFAULT '';

CREATE TABLE "event" (
  "event_id" SERIAL PRIMARY KEY,
  "name" VARCHAR(200),
  "trigger" VARCHAR(80),
  "round" INT,
  "game_id" INT REFERENCES game
);

CREATE TABLE "regiment_event" (
  "regiment_event_id" SERIAL PRIMARY KEY,
  "regiment_id" INT REFERENCES regiment,
  "event_id" INT REFERENCES event
);

CREATE TABLE "message" (
  "message_id" SERIAL PRIMARY KEY,
  "name" VARCHAR(200),
  "text" VARCHAR(8000),
  "event_id" INT REFERENCES event
);

CREATE TABLE "decision" (
  "decision_id" SERIAL PRIMARY KEY,
  "name" VARCHAR(200),
  "type" VARCHAR(200),
  "value" INT,
  "front" VARCHAR(80)
);

CREATE TABLE "message_decision" (
  "message_decision_id" SERIAL PRIMARY KEY,
  "event_id" INT REFERENCES event,
  "decision_id" INT REFERENCES decision
);





INSERT INTO faction (name)
VALUES ('Hoplite'),
('Hoard');

INSERT INTO regiment_template (front, power, starting_power, morale, morale_ratio, is_friendly, faction_id)
VALUES ('left', 100, 100, 30, 0.3, true, 1),
('center', 100, 100, 30, 0.3, true, 1),
('right', 100, 100, 30, 0.3, true, 1),
('left', 140, 140, 21, 0.15, false, 2),
('center', 140, 140, 21, 0.15, false, 2),
('right', 140, 140, 21, 0.15, false, 2);

INSERT INTO event ("trigger")
VALUES ('mutual destruction'),
('friendly destruction'),
('enemy destruction'),
('mutual break'),
('friendly break'),
('enemy break');

INSERT INTO regiment_event (regiment_id, event_id)
VALUES ('mutual destruction'),
('friendly destruction'),
('enemy destruction'),
('mutual break'),
('friendly break'),
('enemy break');

INSERT INTO message (text, event_id)
VALUES ('There are no survivors on either side.', 1),
('Our force has been wiped out.', 2),
('The enemy has been annihilated!', 3),
('Both sides have broken.', 4),
('Our men have disgracefully broken rank.', 5),
('The enemy has been driven back!', 6);