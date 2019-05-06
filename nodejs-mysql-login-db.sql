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
(1, 'sk', '6607a999607711cd339dce1de6d64425a0985cfd', '행복나눔재단', 'admin', '010-4442-2081', '0x3f3f1b10573e4168958d9176e05b74be17134c80');
INSERT INTO `users` (`id`, `username`, `password`, `affiliation`, `org_type`, `contacts`) VALUES
(2, 'LIO', '6607a999607711cd339dce1de6d64425a0985cfd', '라이온코리아', 'member', '');
INSERT INTO `users` (`id`, `username`, `password`, `affiliation`, `org_type`, `contacts`) VALUES
(3, 'DGB', '6607a999607711cd339dce1de6d64425a0985cfd', '동구밭', 'member', '');
INSERT INTO `users` (`id`, `username`, `password`, `affiliation`, `org_type`, `contacts`) VALUES
(4, 'ORG', '6607a999607711cd339dce1de6d64425a0985cfd', '올가니카', 'member', '');
INSERT INTO `users` (`id`, `username`, `password`, `affiliation`, `org_type`, `contacts`) VALUES
(5, 'EAS', '6607a999607711cd339dce1de6d64425a0985cfd', '이지앤모어', 'member', '');


INSERT INTO `donations` (`id`, `company_id`, `donation_id`, `prev_donation_id`,`affiliation`,`editor`, `season`, `is_new`, `created_at`) VALUES
(1, 'LIO', '6607a999607711cd339dce1de6d64425a0985cfa', '', '라이온코리아' ,'라이온코리아', 1, true, NOW());
INSERT INTO `donations` (`id`, `company_id`, `donation_id`, `prev_donation_id`,`affiliation`,`editor`, `season`, `is_new`, `created_at`) VALUES
(2, 'LIO', '6607a999607711cd339dce1de6d64425a0985cfb', '','라이온코리아' ,'라이온코리아', 1, true, NOW());
INSERT INTO `donations` (`id`, `company_id`, `donation_id`, `prev_donation_id`,`affiliation`,`editor`, `season`, `is_new`, `created_at`) VALUES
(3, 'DGB', '6607a999607711cd339dce1de6d64425a0985cfc', '','동구밭' ,'동구밭', 1, true, NOW());
INSERT INTO `donations` (`id`, `company_id`, `donation_id`, `prev_donation_id`,`affiliation`,`editor`, `season`, `is_new`, `created_at`) VALUES
(4, 'ORG', '6607a999607711cd339dce1de6d64425a0985cfd', '','올가니카' ,'올가니카', 1, true, NOW());
INSERT INTO `donations` (`id`, `company_id`, `donation_id`, `prev_donation_id`,`affiliation`,`editor`, `season`, `is_new`, `created_at`) VALUES
(5, 'EAS', '6607a999607711cd339dce1de6d64425a0985cfe', '','이지앤모어' ,'이지앤모어', 1, true, NOW());

INSERT INTO `donation_column` (`donation_id`, `column_type`, `detail`, `is_public`) VALUES
('6607a999607711cd339dce1de6d64425a0985cfa', '물품명', '키즈세이프치약', false);
INSERT INTO `donation_column` (`donation_id`, `column_type`, `detail`, `is_public`) VALUES
('6607a999607711cd339dce1de6d64425a0985cfa', '수량', '4', true);
INSERT INTO `donation_column` (`donation_id`, `column_type`, `detail`, `is_public`) VALUES
('6607a999607711cd339dce1de6d64425a0985cfa', '가격', '400', false);
INSERT INTO `donation_column` (`donation_id`, `column_type`, `detail`, `is_public`) VALUES
('6607a999607711cd339dce1de6d64425a0985cfa', '유통기한', 'null', false);

INSERT INTO `donation_column` (`donation_id`, `column_type`, `detail`, `is_public`) VALUES
('6607a999607711cd339dce1de6d64425a0985cfb', '물품명', '키즈세이프칫솔', false);
INSERT INTO `donation_column` (`donation_id`, `column_type`, `detail`, `is_public`) VALUES
('6607a999607711cd339dce1de6d64425a0985cfb', '수량', '4', true);
INSERT INTO `donation_column` (`donation_id`, `column_type`, `detail`, `is_public`) VALUES
('6607a999607711cd339dce1de6d64425a0985cfb', '가격', '400', false);
INSERT INTO `donation_column` (`donation_id`, `column_type`, `detail`, `is_public`) VALUES
('6607a999607711cd339dce1de6d64425a0985cfb', '유통기한', 'null', false);

INSERT INTO `donation_column` (`donation_id`, `column_type`, `detail`, `is_public`) VALUES
('6607a999607711cd339dce1de6d64425a0985cfc', '물품명', '가꿈비누', false);
INSERT INTO `donation_column` (`donation_id`, `column_type`, `detail`, `is_public`) VALUES
('6607a999607711cd339dce1de6d64425a0985cfc', '수량', '5', true);
INSERT INTO `donation_column` (`donation_id`, `column_type`, `detail`, `is_public`) VALUES
('6607a999607711cd339dce1de6d64425a0985cfc', '가격', '6000', false);
INSERT INTO `donation_column` (`donation_id`, `column_type`, `detail`, `is_public`) VALUES
('6607a999607711cd339dce1de6d64425a0985cfc', '유통기한', 'null', false);

INSERT INTO `donation_column` (`donation_id`, `column_type`, `detail`, `is_public`) VALUES
('6607a999607711cd339dce1de6d64425a0985cfd', '물품명', '어네스트바', false);
INSERT INTO `donation_column` (`donation_id`, `column_type`, `detail`, `is_public`) VALUES
('6607a999607711cd339dce1de6d64425a0985cfd', '수량', '11', true);
INSERT INTO `donation_column` (`donation_id`, `column_type`, `detail`, `is_public`) VALUES
('6607a999607711cd339dce1de6d64425a0985cfd', '가격', '1500', false);
INSERT INTO `donation_column` (`donation_id`, `column_type`, `detail`, `is_public`) VALUES
('6607a999607711cd339dce1de6d64425a0985cfd', '유통기한', 'null', false);

INSERT INTO `donation_column` (`donation_id`, `column_type`, `detail`, `is_public`) VALUES
('6607a999607711cd339dce1de6d64425a0985cfe', '물품명', '위생용품', false);
INSERT INTO `donation_column` (`donation_id`, `column_type`, `detail`, `is_public`) VALUES
('6607a999607711cd339dce1de6d64425a0985cfe', '수량', '1', true);
INSERT INTO `donation_column` (`donation_id`, `column_type`, `detail`, `is_public`) VALUES
('6607a999607711cd339dce1de6d64425a0985cfe', '가격', '0', false);
INSERT INTO `donation_column` (`donation_id`, `column_type`, `detail`, `is_public`) VALUES
('6607a999607711cd339dce1de6d64425a0985cfe', '유통기한', 'null', false);


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
