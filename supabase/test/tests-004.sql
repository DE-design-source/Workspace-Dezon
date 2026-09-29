\set ON_ERROR_STOP 0
insert into auth.users(id, email) values ('aaaaaaaa-0000-0000-0000-000000000000','admin@cty.vn'),('bbbbbbbb-0000-0000-0000-000000000000','nv@cty.vn'),('cccccccc-0000-0000-0000-000000000000','xuong@cty.vn');
update public.profiles set perms='{"prod":"edit","projects":"view","qs":"view","po":"view"}' where email='xuong@cty.vn';
insert into public.records(collection,id,data) values ('feed_posts','p1','{}'),('att_recs','r1','{}'),('hr_pay','_','{}'),('prod_orders','o1','{}'),('fin_v2','riverside','{}'),('qs_po','po1','{}'),('leads_v2','l1','{}');
create or replace function pg_temp.as_user(u text) returns void language sql as $$ select set_config('request.jwt.claim.sub', u, false), set_config('request.jwt.claim.role', 'authenticated', false) $$;
set role authenticated;
select pg_temp.as_user('bbbbbbbb-0000-0000-0000-000000000000');
select 'staff reads' t, string_agg(collection, ',' order by collection) from public.records;
insert into public.records(collection,id,data) values ('att_recs','r2','{"checkin":"07:01"}');   -- tự chấm công: được
insert into public.records(collection,id,data) values ('feed_posts','p2','{}');                   -- đăng tin: được
insert into public.records(collection,id,data) values ('hr_pay','x','{}');                        -- lương: chặn
select pg_temp.as_user('cccccccc-0000-0000-0000-000000000000');
select 'xuong reads' t, string_agg(collection, ',' order by collection) from public.records;
update public.records set data='{"x":1}' where collection='prod_orders';
insert into public.records(collection,id,data) values ('qs_po','po2','{}');                        -- xưởng đặt mua vật tư: được
update public.records set data='{"x":1}' where collection='fin_v2';                               -- 0 dòng
