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