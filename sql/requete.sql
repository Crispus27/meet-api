 RENAME TABLE `meet`.`o_manager` TO `meet`.`o_function`; 

ALTER TABLE `o_function` ADD `end_at` TIMESTAMP NULL COMMENT 'indicates when the user\'s role in the organization will end.When it\'s null then it\'s because the duration is infinite' AFTER `function_id`; 

ALTER TABLE `events` ADD `location` VARCHAR(255) NULL AFTER `image`; 

ALTER TABLE `events` ADD `map` VARCHAR(255) NULL AFTER `location`; 