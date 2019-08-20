INSERT INTO users (username, email, password_hash, avatar_url, name) VALUES
('em', 'em@platezero.com', '$2a$10$xtLGz6w08W2cYtk8h24Dw.gFoykXm3or5ghJQCIGREpQFsXTbZVci', null, 'Ethan Mick'),
('bb', 'bb@platezero.com', '$2a$15$eej36zpMJ88xtKGDnRYslOx4AhXbJ5BDV7CLunz3F0ICM7/xRaXqW', null, 'Ben'),
('bd', 'brian@virtyx.com', '$2b$12$mzouVwXwpOZVYwQOipr8T./qukqjE/Gu/IhV.LKmzLEHWL8nZ5oIC',  null,null);

INSERT INTO profile_questions (question, help_text, section, priority, type, sort, is_family)
VALUES
('How many members are in your family?', NULL, 'family', 0, 'Family', 0, TRUE),
('What is your Zip Code?', NULL, 'family', 0, 'Zip', 1, TRUE),
('What is your Credit Card?', NULL, 'Account', 0, 'Billing', 1, TRUE);

