TRUNCATE TABLE clients RESTART IDENTITY CASCADE;

insert into clients(id, email, name)
values (1, 'test1@mail.com', 'test1'),
       (2, 'test2@mail.com', 'test2');

SELECT setval('clients_id_seq', 3, false);