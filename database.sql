-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         10.1.32-MariaDB - MariaDB Server
-- SO del servidor:              Linux
-- HeidiSQL Versión:             9.5.0.5278
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Volcando estructura de base de datos para mybooks
CREATE DATABASE IF NOT EXISTS `mybooks` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `mybooks`;

-- Volcando estructura para tabla mybooks.Books
CREATE TABLE IF NOT EXISTS `Books` (
  `library` varchar(36) NOT NULL,
  `name` varchar(50) NOT NULL,
  `author` varchar(50) NOT NULL,
  `user_owner` varchar(36) NOT NULL,
  `genre` varchar(50) DEFAULT NULL,
  `year` tinyint(4) DEFAULT NULL,
  `editorial` varchar(50) DEFAULT NULL,
  `language` varchar(50) NOT NULL,
  UNIQUE KEY `Unique` (`name`,`author`,`language`,`library`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='All books';

-- La exportación de datos fue deseleccionada.
-- Volcando estructura para tabla mybooks.Libraries
CREATE TABLE IF NOT EXISTS `Libraries` (
  `id` varchar(36) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(140) DEFAULT NULL,
  `creation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- La exportación de datos fue deseleccionada.
-- Volcando estructura para tabla mybooks.UserLinkedLibraries
CREATE TABLE IF NOT EXISTS `UserLinkedLibraries` (
  `user_uuid` varchar(36) NOT NULL,
  `library_uuid` varchar(36) NOT NULL,
  `can_add` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'User can add new books',
  `can_edit` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'User can edit (others) books',
  `can_remove` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'User can remove (others) books',
  `can_invite` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'User can invite new users',
  `manager` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'User can edit others permissions',
  `owner` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'User can remove library and manage managers',
  PRIMARY KEY (`user_uuid`,`library_uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Libraries that an user can access';

-- La exportación de datos fue deseleccionada.
-- Volcando estructura para tabla mybooks.Users
CREATE TABLE IF NOT EXISTS `Users` (
  `id` varchar(36) NOT NULL,
  `nick` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `hash` char(60) NOT NULL,
  `registered` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastActive` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Tabla de usuarios';

-- La exportación de datos fue deseleccionada.
-- Volcando estructura para tabla mybooks.UserSession
CREATE TABLE IF NOT EXISTS `UserSession` (
  `user_uuid` char(50) NOT NULL,
  `client_id` char(64) NOT NULL,
  `client_hash` char(60) NOT NULL,
  `creation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `valid` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Almacena los token de sesiones de los usuarios';

-- La exportación de datos fue deseleccionada.
-- Volcando estructura para disparador mybooks.UserSession_before_update
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `UserSession_before_update` BEFORE UPDATE ON `UserSession` FOR EACH ROW BEGIN
	IF NEW.client_hash != OLD.client_hash THEN
		SET NEW.creation = NOW();
		SET NEW.valid = 1;
   END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
