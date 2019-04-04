-- phpMyAdmin SQL Dump
-- version 4.4.10
-- http://www.phpmyadmin.net


SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

create database prisming_app;
-- --------------------------------------------------------
use prisming_app;

--
-- Database: `db_users`
--

-- --------------------------------------------------------

CREATE TABLE `users` (
  `id` int(11) AUTO_INCREMENT NOT NULL,
  `username` varchar(16) NOT NULL,
  `password` varchar(60) NOT NULL,
  `affiliation` varchar(100) NOT NULL,
  `org_type` varchar(16) NOT NULL,
  `corp_name` varchar(100) DEFAULT '',
  `address` varchar(100) DEFAULT '',
  `representative_name` varchar(100) DEFAULT '',
  `e_mail` varchar(100) DEFAULT '',
  `contacts` varchar(100) DEFAULT '',

  primary key(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8;

CREATE TABLE `donations` (
  `id` int(11) AUTO_INCREMENT NOT NULL,
  `company_id` varchar(16) NOT NULL,
  `donation_id` varchar(60) NOT NULL,
  `prev_donation_id` varchar(60) NOT NULL,
  `affiliation` varchar(100) NOT NULL,
  `editor` varchar(100) NOT NULL,
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

CREATE TABLE `configuration` (
  `id` int(11) AUTO_INCREMENT NOT NULL,
  `type` varchar(60) NOT NULL,
  `stringify_data` varchar(1000) NOT NULL,
  primary key(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8;


--
-- Dumping data for table `tbl_users`
--

INSERT INTO `users` (`id`, `username`, `password`, `affiliation`, `org_type`, `contacts`) VALUES
(1, 'sk', '6607a999607711cd339dce1de6d64425a0985cfd', '행복나눔재단', 'admin', '010-4442-2081');
INSERT INTO `users` (`id`, `username`, `password`, `affiliation`, `org_type`, `contacts`) VALUES
(2, 'gx', '6607a999607711cd339dce1de6d64425a0985cfd', 'GX', 'member', '010-4442-2081');
INSERT INTO `users` (`id`, `username`, `password`, `affiliation`, `org_type`, `contacts`) VALUES
(3, 'prisming', '6607a999607711cd339dce1de6d64425a0985cfd', 'prisming', 'member', '010-4442-2081');
INSERT INTO `users` (`id`, `username`, `password`, `affiliation`, `org_type`, `contacts`) VALUES
(4, 'prisming1', '6607a999607711cd339dce1de6d64425a0985cfd', '미혼모 센터', 'volunteer', '010-4442-2081');
INSERT INTO `users` (`id`, `username`, `password`, `affiliation`, `org_type`, `contacts`) VALUES
(5, 'prisming2', '6607a999607711cd339dce1de6d64425a0985cfd', '아동 복지 센터', 'volunteer', '010-4442-2081');
INSERT INTO `users` (`id`, `username`, `password`, `affiliation`, `org_type`, `contacts`) VALUES
(6, 'prisming3', '6607a999607711cd339dce1de6d64425a0985cfd', '복지 센터', 'volunteer', '010-4442-2081');
INSERT INTO `users` (`id`, `username`, `password`, `affiliation`, `org_type`, `contacts`) VALUES
(7, 'prisming4', '6607a999607711cd339dce1de6d64425a0985cfd', '프리즈밍', 'volunteer', '010-4442-2081');


INSERT INTO `donations` (`id`, `company_id`, `donation_id`, `prev_donation_id`,`affiliation`,`editor`, `is_new`, `created_at`) VALUES
(1, 'gx', '6607a999607711cd339dce1de6d64425a0985cfd', '', 'GX' ,'GX', true, NOW());
INSERT INTO `donations` (`id`, `company_id`, `donation_id`, `prev_donation_id`,`affiliation`,`editor`, `is_new`, `created_at`) VALUES
(2, 'prisming', '6607a999607711cd339dce1de6d64425a0985cfa', '','prisming' ,'prisming', true, NOW());
INSERT INTO `donations` (`id`, `company_id`, `donation_id`, `prev_donation_id`,`affiliation`,`editor`, `is_new`, `created_at`) VALUES
(3, 'gx', '6607a999607711cd339dce1de6d64425a0985cfb', '','GX' ,'GX', true, NOW());

INSERT INTO `donation_column` (`donation_id`, `column_type`, `detail`, `is_public`) VALUES
('6607a999607711cd339dce1de6d64425a0985cfd', '물품명', '콜라', false);
INSERT INTO `donation_column` (`donation_id`, `column_type`, `detail`, `is_public`) VALUES
('6607a999607711cd339dce1de6d64425a0985cfd', '수량', '600', true);
INSERT INTO `donation_column` (`donation_id`, `column_type`, `detail`, `is_public`) VALUES
('6607a999607711cd339dce1de6d64425a0985cfd', '가격', '50000', false);
INSERT INTO `donation_column` (`donation_id`, `column_type`, `detail`, `is_public`) VALUES
('6607a999607711cd339dce1de6d64425a0985cfd', '유통기한', 'null', false);
INSERT INTO `donation_column` (`donation_id`, `column_type`, `detail`, `is_public`) VALUES
('6607a999607711cd339dce1de6d64425a0985cfa', '물품명', '기저귀', false);
INSERT INTO `donation_column` (`donation_id`, `column_type`, `detail`, `is_public`) VALUES
('6607a999607711cd339dce1de6d64425a0985cfa', '수량', '1000', true);
INSERT INTO `donation_column` (`donation_id`, `column_type`, `detail`, `is_public`) VALUES
('6607a999607711cd339dce1de6d64425a0985cfa', '가격', '5000', false);
INSERT INTO `donation_column` (`donation_id`, `column_type`, `detail`, `is_public`) VALUES
('6607a999607711cd339dce1de6d64425a0985cfa', '유통기한', 'null', false);
INSERT INTO `donation_column` (`donation_id`, `column_type`, `detail`, `is_public`) VALUES
('6607a999607711cd339dce1de6d64425a0985cfb', '물품명', '분유', false);
INSERT INTO `donation_column` (`donation_id`, `column_type`, `detail`, `is_public`) VALUES
('6607a999607711cd339dce1de6d64425a0985cfb', '수량', '400', true);
INSERT INTO `donation_column` (`donation_id`, `column_type`, `detail`, `is_public`) VALUES
('6607a999607711cd339dce1de6d64425a0985cfb', '가격', '50000', false);
INSERT INTO `donation_column` (`donation_id`, `column_type`, `detail`, `is_public`) VALUES
('6607a999607711cd339dce1de6d64425a0985cfb', '유통기한', 'null', false);

INSERT INTO `configuration` (`type`, `stringify_data`) VALUES
('recipientCategory_type_1', '[{"category":"영아(~3세)"},{"category":"유아(4세~6세)"},{"category":"아동(8세~13세)"},{"category":"청소년(14세 이상)"}]');
INSERT INTO `configuration` (`type`, `stringify_data`) VALUES
('recipientCategory_type_2', '[{"category":"다문화"},{"category":"장애"},{"category":"탈북민"}]');
INSERT INTO `configuration` (`type`, `stringify_data`) VALUES
('switch_1', 'false');
INSERT INTO `configuration` (`type`, `stringify_data`) VALUES
('switch_2', 'false');
INSERT INTO `configuration` (`type`, `stringify_data`) VALUES
('switch_3', 'false');


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
