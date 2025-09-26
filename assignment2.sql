-- Insert Tony Stark into the 'account' table
INSERT INTO  public.account (account_firstname, account_lastname, account_email, account_password, account_type)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n', 'Admin');

-- Update Tony Stark 'account_type' to 'Admin'
UPDATE public.account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

DELETE FROM public.account
WHERE account_email = 'tony@starkent.com';

-- Update GM Hummer description: replace 'small interior with 'a huge interior'
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interior', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Inner join to get all make, model, and classification name for 'Sport' category
SELECT inv_make, inv_model, classification_name
FROM public.inventory AS inv
INNER JOIN public.classification AS cls
ON inv.classification_id = cls.classification_id
WHERE cls.classification_name = 'Sport';

-- Update all inventory image paths to include '/vehicles'
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');


