-- phpMyAdmin SQL Dump
-- version 4.4.10
-- http://www.phpmyadmin.net


SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

create database donation_klaytn;
-- --------------------------------------------------------
use donation_klaytn;

--
--

-- --------------------------------------------------------

CREATE TABLE `users` (
  `id` int(11) AUTO_INCREMENT NOT NULL,
  `username` varchar(16) NOT NULL,
  `password` varchar(60) NOT NULL,
  `affiliation` varchar(100) NOT NULL,
  `org_type` varchar(16) NOT NULL,
  `address` varchar(100) DEFAULT '',
  `representative_name` varchar(100) DEFAULT '',
  `e_mail` varchar(100) DEFAULT '',
  `contacts` varchar(100) DEFAULT '',
  `klaytnAddress` varchar(100) DEFAULT '',
  primary key(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8;

CREATE TABLE `donations` (
  `id` int(11) AUTO_INCREMENT NOT NULL,
  `company_id` varchar(16) NOT NULL,
  `donation_id` varchar(60) NOT NULL,
  `prev_donation_id` varchar(60) NOT NULL,
  `affiliation` varchar(100) NOT NULL,
  `editor` varchar(100) NOT NULL,
  `season` int(11) NOT NULL,
  `is_new` boolean NOT NULL,
  `created_at` datetime NOT NULL,
  primary key(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8;

CREATE TABLE `donation_column` (
  `id` int(11) AUTO_INCREMENT NOT NULL,
  `donation_id` varchar(60) NOT NULL,
  `column_type` varchar(16) NOT NULL,
  `detail` varchar(500) NOT NULL,
  `is_public` boolean NOT NULL,
  primary key(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8;

CREATE TABLE `collection` (
  `id` int(11) AUTO_INCREMENT NOT NULL,
  `name` varchar(60) NOT NULL,
  `total_quantity`  int(11) NOT NULL,
  `season`  int(11) NOT NULL,
  `expiration_date` varchar(60) NOT NULL,
  primary key(`id`)
) ENGINE=InnoDB CHARSET=UTF8;

CREATE TABLE `collection_component` (
  `id` int(11) AUTO_INCREMENT NOT NULL,
  `donation_id` varchar(60) NOT NULL,
  `collection_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  primary key(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8;

CREATE TABLE `temp_distribution` (
  `volunteer_id` varchar(16) NOT NULL,
  `collection_id`  int(11) NOT NULL,
  `quantity`  int(11) NOT NULL,
  primary key(`volunteer_id`, `collection_id`)
) ENGINE=InnoDB CHARSET=UTF8;

CREATE TABLE `receipt_record` (
  `id` int(11) AUTO_INCREMENT NOT NULL,
  `volunteer_id` varchar(16) NOT NULL,
  `season`  int(11) NOT NULL,
  `filename`  varchar(50) NOT NULL,
  primary key(`id`)
) ENGINE=InnoDB CHARSET=UTF8;


CREATE TABLE `configuration` (
  `id` int(11) AUTO_INCREMENT NOT NULL,
  `type` varchar(60) NOT NULL,
  `stringify_data` varchar(1000) NOT NULL,
  primary key(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8;


--
-- Dumping data for table `tbl_users`
--

INSERT INTO `users` (`id`, `username`, `password`, `affiliation`, `org_type`, `contacts`, `klaytnAddress`) VALUES
(1, 'gx', '6607a999607711cd339dce1de6d64425a0985cfd', 'GroundX', 'admin', '', '0xa56a3611381c7749a9bd9e4e6edfd2d7c8a8fc52');


INSERT INTO `configuration` (`type`, `stringify_data`) VALUES
('recipientCategory_type_1', '[{"category":"Infant(~3)"},{"category":"Child(4~6)"},{"category":"Child(8~13)"},{"category":"Youth(Over 14)"}]');
INSERT INTO `configuration` (`type`, `stringify_data`) VALUES
('recipientCategory_type_2', '[{"category":"Immigrant"},{"category":"Disabled"},{"category":"Poverty"}]');
INSERT INTO `configuration` (`type`, `stringify_data`) VALUES
('switch_1', 'false');
INSERT INTO `configuration` (`type`, `stringify_data`) VALUES
('switch_2', 'false');
INSERT INTO `configuration` (`type`, `stringify_data`) VALUES
('switch_3', 'false');
INSERT INTO `configuration` (`type`, `stringify_data`) VALUES
('season', '1');


--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_users`
--
ALTER TABLE `users`
  ADD INDEX (`username`);
ALTER TABLE `donations`
  ADD INDEX (`donation_id`);



ALTER TABLE `donation_column`
 ADD FOREIGN KEY (`donation_id`) REFERENCES `donations` (`donation_id`);

ALTER TABLE `donations`
 ADD FOREIGN KEY (`company_id`) REFERENCES `users` (`username`);


ALTER TABLE `collection_component`
 ADD FOREIGN KEY (`collection_id`) REFERENCES `collection` (`id`) ON DELETE CASCADE;
ALTER TABLE `collection_component`
 ADD FOREIGN KEY (`donation_id`) REFERENCES `donations` (`donation_id`) ON UPDATE CASCADE;

ALTER TABLE `temp_distribution`
 ADD FOREIGN KEY (`volunteer_id`) REFERENCES `users` (`username`);

ALTER TABLE `temp_distribution`
 ADD FOREIGN KEY (`collection_id`) REFERENCES `collection` (`id`) ON DELETE CASCADE;
