CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW."dateupdated" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_uuid()
RETURNS TRIGGER AS $$
BEGIN
  NEW."apitoken" = gen_random_uuid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


DROP TABLE IF EXISTS "apiusers";
CREATE TABLE "apiusers" (
  "userid" SERIAL PRIMARY KEY,
  "email" varchar(128) UNIQUE NOT NULL,
  "password" char(60) DEFAULT NULL,
  "apitoken" char(36) UNIQUE DEFAULT NULL,
  "datecreated" timestamp DEFAULT CURRENT_TIMESTAMP,
  "dateupdated" timestamp DEFAULT CURRENT_TIMESTAMP
) ;

DROP TRIGGER IF EXISTS "apiusers_BEFORE_INSERT" ON "apiusers";
CREATE TRIGGER "apiusers_BEFORE_INSERT" 
BEFORE INSERT ON "apiusers" 
FOR EACH ROW
EXECUTE PROCEDURE generate_uuid();

DROP TRIGGER IF EXISTS "apiusers_UPDATE_TIMESTAMP" ON "apiusers";
CREATE TRIGGER "apiusers_UPDATE_TIMESTAMP" 
BEFORE UPDATE ON "apiusers" 
FOR EACH ROW 
EXECUTE PROCEDURE update_timestamp();
