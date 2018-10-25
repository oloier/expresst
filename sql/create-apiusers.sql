DROP TABLE IF EXISTS `database`.`apiusers`;

CREATE TABLE `apiusers` (
  `userID` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` char(62) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `apiToken` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dateCreated` datetime DEFAULT CURRENT_TIMESTAMP,
  `dateUpdated` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `apiToken_UNIQUE` (`apiToken`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TRIGGER IF EXISTS `internalagriweb`.`apiusers_BEFORE_INSERT`;
DELIMITER $$
USE `database`$$
CREATE TRIGGER `database`.`apiusers_BEFORE_INSERT` BEFORE INSERT ON `apiusers` FOR EACH ROW
BEGIN
SET NEW.apiToken = UUID();
END$$
DELIMITER ;
