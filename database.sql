CREATE TABLE "users" (
  "id" serial primary key,
  "username" varchar(80) not null UNIQUE,
  "password" varchar(240) not null
);

CREATE TABLE "game" (
  "game_id" SERIAL PRIMARY KEY,
  "round" INT NOT NULL,
  "user_id" INT NOT NULL REFERENCES users
);

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

CREATE TABLE "event" (
  "event_id" SERIAL PRIMARY KEY,
  "name" VARCHAR(200),
  "trigger" VARCHAR(80),
  "round" INT,
  "game_id" INT REFERENCES game
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
VALUES ('hoplite'),
('Hoard');

INSERT INTO regiment_template (front, power, starting_power, morale, morale_ratio, is_friendly, faction_id)
VALUES ('left', 100, 100, 30, 0.3, true, 1),
('center', 100, 100, 30, 0.3, true, 1),
('right', 100, 100, 30, 0.3, true, 1),
('left', 140, 140, 21, 0.15, false, 2),
('center', 140, 140, 21, 0.15, false, 2),
('right', 140, 140, 21, 0.15, false, 2);

INSERT INTO regiment (front, power, starting_power, morale, morale_ratio, is_friendly, faction_id, game_id)
VALUES ('left', 100, 100, 30, 0.3, true, 1, 1),
('center', 100, 100, 30, 0.3, true, 1, 1),
('right', 100, 100, 30, 0.3, true, 1, 1),
('left', 140, 140, 21, 0.15, false, 2, 1),
('center', 140, 140, 21, 0.15, false, 2, 1),
('right', 140, 140, 21, 0.15, false, 2, 1);