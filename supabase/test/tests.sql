\set ON_ERROR_STOP 0
-- 3 người dùng: A (admin đầu tiên), B, C
insert into auth.users(id, email, raw_user_meta_data) values
 ('aaaaaaaa-0000-0000-0000-000000000000','a@cty.vn','{"name":"Anh A"}'),
 ('bbbbbbbb-0000-0000-0000-000000000000','b@cty.vn','{"name":"Chị B","is_admin":true}'),
 ('cccccccc-0000-0000-0000-000000000000','c@cty.vn','{}');
select email, name, is_admin from public.profiles order by email;
select count(*) as members_of_fixed_convs from public.conversation_members;

create or replace function pg_temp.as_user(u text) returns void language sql as $$
  select set_config('request.jwt.claim.sub', u, false), set_config('request.jwt.claim.role', 'authenticated', false) $$;

set role authenticated;
-- A tạo nhắn riêng với B, gửi tin
select pg_temp.as_user('aaaaaaaa-0000-0000-0000-000000000000');
select public.create_dm('bbbbbbbb-0000-0000-0000-000000000000') as dm_ab \gset
select public.create_dm('bbbbbbbb-0000-0000-0000-000000000000') = :'dm_ab' as dm_reused;
insert into public.messages(conversation_id, sender_id, body) values (:'dm_ab', 'aaaaaaaa-0000-0000-0000-000000000000', 'chào B');
-- A giả danh B -> phải bị chặn
insert into public.messages(conversation_id, sender_id, body) values (:'dm_ab', 'bbbbbbbb-0000-0000-0000-000000000000', 'giả danh');
-- A gửi tin thường vào kênh Bot -> bị chặn; tin bot -> được
insert into public.messages(conversation_id, sender_id, body) values ('00000000-0000-0000-0000-000000000b07', 'aaaaaaaa-0000-0000-0000-000000000000', 'spam');
insert into public.messages(conversation_id, sender_id, body, bot) values ('00000000-0000-0000-0000-000000000b07', 'aaaaaaaa-0000-0000-0000-000000000000', 'cảnh báo', '{"level":"red","title":"Test"}');
-- A tự nâng quyền / khoá người khác qua profile của mình
update public.profiles set name = 'Anh A mới' where id = 'aaaaaaaa-0000-0000-0000-000000000000';

-- C: không thấy tin DM A-B, không gửi được vào đó, không tự thêm mình vào
select pg_temp.as_user('cccccccc-0000-0000-0000-000000000000');
select count(*) as c_sees_dm_msgs from public.messages where conversation_id = :'dm_ab';
select count(*) as c_sees_dm_conv from public.conversations where id = :'dm_ab';
insert into public.messages(conversation_id, sender_id, body) values (:'dm_ab', 'cccccccc-0000-0000-0000-000000000000', 'đọc lén');
select public.add_members(:'dm_ab', array['cccccccc-0000-0000-0000-000000000000'::uuid]);
insert into public.conversation_members(conversation_id, user_id) values (:'dm_ab', 'cccccccc-0000-0000-0000-000000000000');
update public.profiles set is_admin = true where id = 'cccccccc-0000-0000-0000-000000000000';
select is_admin as c_is_admin_after_hack from public.profiles where id = 'cccccccc-0000-0000-0000-000000000000';
update public.profiles set name = 'hack' where id = 'aaaaaaaa-0000-0000-0000-000000000000';
select name as a_name_after_c_edit from public.profiles where id = 'aaaaaaaa-0000-0000-0000-000000000000';
-- C sửa tin của A
update public.messages set body = 'bị sửa' where conversation_id = :'dm_ab';
-- C tạo nhóm với A, thêm B
select public.create_group('Nhóm dự án X', array['aaaaaaaa-0000-0000-0000-000000000000'::uuid], 'proj-x') as g \gset
select public.add_members(:'g', array['bbbbbbbb-0000-0000-0000-000000000000'::uuid]);
select count(*) as group_members from public.conversation_members where conversation_id = :'g';
-- gọi lại create_group cùng dự án -> dùng lại nhóm cũ
select public.create_group('Nhóm dự án X', array[]::uuid[], 'proj-x') = :'g' as project_group_reused;
-- C rời kênh Toàn công ty -> bị chặn (0 dòng)
delete from public.conversation_members where conversation_id = '00000000-0000-0000-0000-000000000001' and user_id = 'cccccccc-0000-0000-0000-000000000000';
-- records dùng chung
insert into public.records(collection, id, data) values ('projects', 'p1', '{"name":"Dự án 1"}');
-- tệp: C upload vào DM A-B -> chặn; vào nhóm -> được
insert into storage.objects(bucket_id, name) values ('chat-files', :'dm_ab' || '/x.pdf');
insert into storage.objects(bucket_id, name) values ('chat-files', :'g' || '/x.pdf');

-- B đọc DM, sửa tin chính mình không được đổi người gửi
select pg_temp.as_user('bbbbbbbb-0000-0000-0000-000000000000');
select count(*) as b_sees_dm_msgs, max(body) as body from public.messages where conversation_id = :'dm_ab';
select count(*) as b_sees_records from public.records;
update public.conversation_members set last_read_at = now() where user_id = 'bbbbbbbb-0000-0000-0000-000000000000';

-- A (admin) khoá C -> C mất quyền đọc mọi thứ
select pg_temp.as_user('aaaaaaaa-0000-0000-0000-000000000000');
update public.profiles set active = false where id = 'cccccccc-0000-0000-0000-000000000000';
select pg_temp.as_user('cccccccc-0000-0000-0000-000000000000');
select count(*) as locked_c_records from public.records;
select count(*) as locked_c_msgs from public.messages;

-- anon không đọc được gì
reset role; set role anon;
select count(*) from public.messages;
reset role;
select name, is_admin, active from public.profiles order by email;
select (select last_message_at from public.conversations where id = :'dm_ab') > now() - interval '1 minute' as last_message_touched;
