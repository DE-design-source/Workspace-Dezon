\set ON_ERROR_STOP 0
insert into auth.users(id, email) values ('aaaaaaaa-0000-0000-0000-000000000000','admin@cty.vn'),('bbbbbbbb-0000-0000-0000-000000000000','mkt@cty.vn'),('cccccccc-0000-0000-0000-000000000000','hr@cty.vn'),('dddddddd-0000-0000-0000-000000000000','nv@cty.vn');
update public.profiles set perms='{"mkt":"edit","sales":"view"}' where email='mkt@cty.vn';
update public.profiles set perms='{"hr":"edit","att":"edit"}' where email='hr@cty.vn';
select email, perms ? 'po' as has_po_key from public.profiles order by email;
insert into public.records(collection,id,data) values ('mkt_campaigns','c1','{}'),('hr_staff','h1','{"gross":20000000}'),('settings','_','{}'),('quest_sales','_','{}'),('qs_po','po1','{}'),('fin','p1','{}');
create or replace function pg_temp.as_user(u text) returns void language sql as $$ select set_config('request.jwt.claim.sub', u, false), set_config('request.jwt.claim.role', 'authenticated', false) $$;
set role authenticated;
select pg_temp.as_user('bbbbbbbb-0000-0000-0000-000000000000');
select 'mkt reads' t, string_agg(collection, ',' order by collection) from public.records;
update public.records set data='{"x":1}' where collection='mkt_campaigns';
update public.records set data='{"x":1}' where collection='settings';
select pg_temp.as_user('cccccccc-0000-0000-0000-000000000000');
select 'hr reads' t, string_agg(collection, ',' order by collection) from public.records;
update public.records set data='{"gross":1}' where collection='hr_staff';
select pg_temp.as_user('dddddddd-0000-0000-0000-000000000000');
select 'staff reads (no salary!)' t, string_agg(collection, ',' order by collection) from public.records;
select pg_temp.as_user('aaaaaaaa-0000-0000-0000-000000000000');
update public.records set data='{"company":"x"}' where collection='settings';
