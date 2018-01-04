CREATE TABLE "users" (
  "id" serial primary key,
  "username" varchar(80) not null UNIQUE,
  "password" varchar(240) not null
);

CREATE TABLE "game" (
  "id" SERIAL PRIMARY KEY,
  "round" INT NOT NULL,
  "user_id" INT NOT NULL REFERENCES users
);

CREATE TABLE "faction" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(80) NOT NULL
);

CREATE TABLE "regiment" (
  "id" SERIAL PRIMARY KEY,
  "front" VARCHAR(80),
  "power" INT,
  "startingPower" INT,
  "morale" INT,
  "moraleRation" INT,
  "is_friendly" BOOLEAN,
  "faction_id" INT REFERENCES faction,
  "game_id" INT REFERENCES game
);

CREATE TABLE "event" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(200),
  "trigger" VARCHAR(80),
  "round" INT,
  "game_id" INT REFERENCES game
);

CREATE TABLE "message" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(200),
  "text" VARCHAR(8000),
  "event_id" INT REFERENCES event
);

CREATE TABLE "decision" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(200),
  "type" VARCHAR(200),
  "value" INT,
  "front" VARCHAR(80)
);

CREATE TABLE "message_decision" (
  "id" SERIAL PRIMARY KEY,
  "event_id" INT REFERENCES event,
  "decision_id" INT REFERENCES decision
);

INSERT INTO faction (name)
VALUES ('hoplite');

INSERT INTO faction (name)
VALUES ('Hoard');

INSERT INTO regiment (front, power, starting_power, morale, morale_ratio, is_friendly, faction_id)
VALUES ('left', 100, 100, 30, 0.3, true, 1);

INSERT INTO regiment (front, power, starting_power, morale, morale_ratio, is_friendly, faction_id)
VALUES ('center', 100, 100, 30, 0.3, true, 1);

INSERT INTO regiment (front, power, starting_power, morale, morale_ratio, is_friendly, faction_id)
VALUES ('right', 100, 100, 30, 0.3, true, 1);

INSERT INTO regiment (front, power, starting_power, morale, morale_ratio, is_friendly, faction_id)
VALUES ('left', 140, 140, 21, 0.15, false, 2);

INSERT INTO regiment (front, power, starting_power, morale, morale_ratio, is_friendly, faction_id)
VALUES ('center', 140, 140, 21, 0.15, false, 2);

INSERT INTO regiment (front, power, starting_power, morale, morale_ratio, is_friendly, faction_id)
VALUES ('right', 140, 140, 21, 0.15, false, 2);