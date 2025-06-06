TRUNCATE TABLE video RESTART IDENTITY CASCADE;

insert into video(id, name, user_id, preview, video_url, privacy_type)
values (1, 'test1', 1, '1', '1', 0),
       (2, 'test2', 2, '2', '2', 0),
       (3, 'test3', 2, '3', '3', 1);

SELECT setval('video_id_seq', 3, false);