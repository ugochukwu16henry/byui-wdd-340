-- Task 1: Insert Tony Stark and return the new primary key
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n')
RETURNING account_id;

-- Task 2: Set account_type = 'Admin' for Tony (use the primary key)
UPDATE account
SET account_type = 'Admin'
WHERE account_id = '7';

-- Task 3: Delete Tony Stark by primary key
DELETE FROM account
WHERE account_id = '7';

-- Task 4: Replace 'small interiors' with 'a huge interior' for the GM Hummer record
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Task 5: Inner join to get make, model, classification for 'Sport'
SELECT i.inv_make, i.inv_model, c.classification_name
FROM inventory i
INNER JOIN classification c
  ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- Task 6: Add '/vehicles' into image paths for all inventory rows
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/')
WHERE inv_image LIKE '/images/%' OR inv_thumbnail LIKE '/images/%';












