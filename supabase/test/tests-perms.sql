\set ON_ERROR_STOP 0
insert into auth.users(id, email) values
 ('aaaaaaaa-0000-0000-0000-000000000000','admin@cty.vn'),
 ('bbbbbbbb-0000-0000-0000-000000000000','sale@cty.vn'),
 ('cccccccc-0000-0000-0000-000000000000','ketoan@cty.vn'),
 ('dddddddd-0000-0000-0000-000000000000','nv@cty.vn');
update public.profiles set role='sales', perms='{"sales":"edit","projects":"view","wiki":"view"}' where email='sale@cty.vn';
update public.profiles set role='accountant', perms='{"fin":"edit","projects":"view"}' where email='ketoan@cty.vn';
select email, role, is_admin, perms from public.profiles order by email;
insert into public.records(collection,id,data) values ('leads','l1','{}'),('fin','p1','{}'),('projects','p1','{}'),('gantt','p1','{}'),('wiki_pages','w1','{}'),('activity','_','{}');
create or replace function pg_temp.as_user(u text) returns void language sql as $$
  select set_config('request.jwt.claim.sub', u, false), set_config('request.jwt.claim.role', 'authenticated', false) $$;
set role authenticated;

select pg_temp.as_user('bbbbbbbb-0000-0000-0000-000000000000');
select 'sales reads' t, string_agg(collection, ',' order by collection) from public.records;
update public.records set data='{"x":1}' where collection='leads';       -- được
update public.records set data='{"x":1}' where collection='fin';         -- 0 dòng (không thấy)
insert into public.records(collection,id,data) values ('projects','p2','{}');  -- được (tạo dự án từ cơ hội)
insert into public.records(collection,id,data) values ('wiki_pages','w2','{}'); -- lỗi: chỉ xem wiki
update public.profiles set perms='{"fin":"edit"}', role='admin' where id='bbbbbbbb-0000-0000-0000-000000000000';
select 'sales self-escalate' t, role, perms from public.profiles where id='bbbbbbbb-0000-0000-0000-000000000000';

select pg_temp.as_user('cccccccc-0000-0000-0000-000000000000');
select 'accountant reads' t, string_agg(collection, ',' order by collection) from public.records;
update public.records set data='{"y":2}' where collection='fin';
delete from public.records where collection='projects' and id='p2';     -- 0 dòng: chỉ xem dự án

select pg_temp.as_user('dddddddd-0000-0000-0000-000000000000');
select 'staff default reads' t, string_agg(collection, ',' order by collection) from public.records;
select public.perm('pm') as staff_pm, public.perm('fin') as staff_fin;

select pg_temp.as_user('aaaaaaaa-0000-0000-0000-000000000000');
select 'admin reads' t, count(*) from public.records;
update public.profiles set perms='{"sales":"view"}' where id='bbbbbbbb-0000-0000-0000-000000000000';
select pg_temp.as_user('bbbbbbbb-0000-0000-0000-000000000000');
update public.records set data='{"z":3}' where collection='leads';      -- 0 dòng: đã hạ xuống chỉ xem
select 'sales after downgrade' t, (select data from public.records where collection='leads') as leads_data;
