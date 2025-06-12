TRUNCATE TABLE users RESTART IDENTITY CASCADE;

insert into users(id, email, name)
values (1, 'test1@mail.com', 'test1'),
       (2, 'test2@mail.com', 'test2');

SELECT setval('users_id_seq', 3, false);