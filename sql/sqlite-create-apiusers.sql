DROP TABLE IF EXISTS apiusers;

CREATE TABLE IF NOT EXISTS apiusers(
	userid INTEGER PRIMARY KEY, 
	email TEXT NOT NULL, 
	password TEXT NOT NULL, 
	apitoken TEXT, 
	datecreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
	dateupdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT unique_flags UNIQUE (email, apitoken)
);

CREATE TRIGGER [dateupdatedTrigger]
	AFTER UPDATE ON apiusers
	FOR EACH ROW
	WHEN NEW.dateupdated < OLD.dateupdated
	BEGIN
		UPDATE apiusers SET dateupdated=CURRENT_TIMESTAMP WHERE userid=OLD.userid;
	END;

CREATE TRIGGER [generateApiToken]
	AFTER INSERT ON apiusers
	FOR EACH ROW
	BEGIN
		UPDATE apiusers SET apitoken=LOWER(HEX(RANDOMBLOB(16))) WHERE userid=NEW.userid;
	END;
 