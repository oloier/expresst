DROP TABLE IF EXISTS `apiusers`;
CREATE TABLE `apiusers` (
  `userid` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` char(60) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `apitoken` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `datecreated` datetime DEFAULT CURRENT_TIMESTAMP,
  `dateupdated` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`userid`),
  UNIQUE KEY `apitoken_UNIQUE` (`apitoken`)
) AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TRIGGER IF EXISTS `apiusers_BEFORE_INSERT`;
DELIMITER $$
USE `database`$$
CREATE TRIGGER `database`.`apiusers_BEFORE_INSERT` 
BEFORE INSERT ON `apiusers` 
FOR EACH ROW
BEGIN
SET NEW.apitoken = UUID();
END$$
DELIMITER ;
