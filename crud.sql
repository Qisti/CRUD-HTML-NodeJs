-- MySQL dump 10.13  Distrib 5.7.21, for osx10.13 (x86_64)
--
-- Host: localhost    Database: wonderlabs
-- ------------------------------------------------------
-- Server version	5.7.21

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Temporary table structure for view `frek_month`
--

DROP TABLE IF EXISTS `frek_month`;
/*!50001 DROP VIEW IF EXISTS `frek_month`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `frek_month` AS SELECT 
 1 AS `month`,
 1 AS `frekuensi`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `frek_students`
--

DROP TABLE IF EXISTS `frek_students`;
/*!50001 DROP VIEW IF EXISTS `frek_students`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `frek_students` AS SELECT 
 1 AS `january`,
 1 AS `february`,
 1 AS `march`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `grades`
--

DROP TABLE IF EXISTS `grades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `grades` (
  `id_grades` varchar(8) NOT NULL,
  `homeroom_teacher` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id_grades`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grades`
--

LOCK TABLES `grades` WRITE;
/*!40000 ALTER TABLE `grades` DISABLE KEYS */;
/*!40000 ALTER TABLE `grades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `students` (
  `id_student` varchar(8) NOT NULL,
  `name` varchar(30) NOT NULL,
  `gender` enum('f','m') DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `mail` varchar(30) DEFAULT NULL,
  `date_of_entry` date DEFAULT NULL,
  PRIMARY KEY (`id_student`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES ('10289367','Chopper','m','1993-09-28','Jalan Sakura','chopper@student.co.id','2011-07-20'),('10987234','Nico Robin','f','1990-06-27','Jalan Senopati','robin@students.co.id','2010-01-26'),('1109278','Hancock','f','1991-01-30','Jalan Pelangi','hancock@student.co.id','2012-02-28'),('11162182','Roronoa Zoro','m','1991-02-19','Jalan Kerikil','zoro@student.co.id','2010-04-18'),('11789789','Kaidou','m','1994-05-09','Jalan Merah Putih','kaidou@student.co.id','2013-01-08'),('1209871','Foxi','m','1990-01-08','Jalan Laut','foxy@student.co.id','2012-12-09'),('12781271','Vivi','f','1992-11-20','Alabasta','vivi@students.co.id','2012-05-20'),('12876241','Suzy','f','1991-11-09','Jalan Bunga Sepatu','suzy@student.ac.id','2012-09-09');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `v_students`
--

DROP TABLE IF EXISTS `v_students`;
/*!50001 DROP VIEW IF EXISTS `v_students`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `v_students` AS SELECT 
 1 AS `male`,
 1 AS `female`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `vfrek_students`
--

DROP TABLE IF EXISTS `vfrek_students`;
/*!50001 DROP VIEW IF EXISTS `vfrek_students`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `vfrek_students` AS SELECT 
 1 AS `january`,
 1 AS `february`,
 1 AS `march`,
 1 AS `april`,
 1 AS `may`,
 1 AS `june`,
 1 AS `july`,
 1 AS `agustus`,
 1 AS `september`,
 1 AS `october`,
 1 AS `november`,
 1 AS `december`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `frek_month`
--

/*!50001 DROP VIEW IF EXISTS `frek_month`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `frek_month` AS select month(`students`.`date_of_entry`) AS `month`,count(0) AS `frekuensi` from `students` group by month(`students`.`date_of_entry`) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `frek_students`
--

/*!50001 DROP VIEW IF EXISTS `frek_students`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `frek_students` AS select count((case when (extract(month from `students`.`date_of_entry`) = 1) then 1 end)) AS `january`,count((case when (extract(month from `students`.`date_of_entry`) = 2) then 1 end)) AS `february`,count((case when (extract(month from `students`.`date_of_entry`) = 3) then 1 end)) AS `march` from `students` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_students`
--

/*!50001 DROP VIEW IF EXISTS `v_students`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_students` AS select count((case when (`students`.`gender` = 'm') then 1 end)) AS `male`,count((case when (`students`.`gender` = 'f') then 1 end)) AS `female` from `students` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vfrek_students`
--

/*!50001 DROP VIEW IF EXISTS `vfrek_students`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vfrek_students` AS select count((case when (extract(month from `students`.`date_of_entry`) = 1) then 1 end)) AS `january`,count((case when (extract(month from `students`.`date_of_entry`) = 2) then 1 end)) AS `february`,count((case when (extract(month from `students`.`date_of_entry`) = 3) then 1 end)) AS `march`,count((case when (extract(month from `students`.`date_of_entry`) = 4) then 1 end)) AS `april`,count((case when (extract(month from `students`.`date_of_entry`) = 5) then 1 end)) AS `may`,count((case when (extract(month from `students`.`date_of_entry`) = 6) then 1 end)) AS `june`,count((case when (extract(month from `students`.`date_of_entry`) = 7) then 1 end)) AS `july`,count((case when (extract(month from `students`.`date_of_entry`) = 8) then 1 end)) AS `agustus`,count((case when (extract(month from `students`.`date_of_entry`) = 9) then 1 end)) AS `september`,count((case when (extract(month from `students`.`date_of_entry`) = 10) then 1 end)) AS `october`,count((case when (extract(month from `students`.`date_of_entry`) = 11) then 1 end)) AS `november`,count((case when (extract(month from `students`.`date_of_entry`) = 12) then 1 end)) AS `december` from `students` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-03-13 13:26:29
