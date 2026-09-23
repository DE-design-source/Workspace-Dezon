-- =====================================================================
-- Dezon Workspace — Migration 002: phân quyền theo module cho từng tài khoản
-- Chạy trong Supabase → SQL Editor SAU schema.sql. Chạy lại nhiều lần vẫn an toàn.
--
-- profiles.role  : tên vai trò (mẫu quyền) để hiển thị, vd 'pm', 'sales', 'accountant'
-- profiles.perms : {"sales":"edit","fin":"view","qs":"none",...}
--   Mức: none = không truy cập · view = chỉ xem · edit = xem và sửa
--   Module: sales, projects, pm, att, fin, qs, wiki, apps
--   Tổng quan và Chat luôn có. Quản trị viên (is_admin) có toàn quyền.
-- =====================================================================

alter table public.profiles add column if not exists role  text  not null default 'staff';
alter table public.profiles add column if not exists perms jsonb not null default '{"pm":"view","wiki":"view","apps":"view"}';

-- Người thường không tự đổi được vai trò / quyền của mình.
create or replace function public.guard_profile() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  -- Chỉ chặn người dùng đăng nhập từ app (có auth.uid) mà không phải quản trị; SQL Editor / service key không bị chặn.
  if auth.uid() is not null and coalesce(auth.role(), '') <> 'service_role' and not public.is_admin() then
    new.is_admin := old.is_admin;
    new.active   := old.active;
    new.email    := old.email;
    new.role     := old.role;
    new.perms    := old.perms;
  end if;
  new.id := old.id;
  return new;
end $$;

-- Mức quyền của người đang đăng nhập với 1 module.
create or replace function public.perm(module text) returns text
language sql stable security definer set search_path = public as $$
  select case
    when p.id is null or not p.active then 'none'
    when p.is_admin then 'edit'
    else coalesce(nullif(p.perms->>module, ''), 'none') end
  from (select 1) x left join public.profiles p on p.id = auth.uid()
$$;

-- Bảng records → module. Một số bộ dữ liệu dùng chung cho nhiều module.
create or replace function public.can_read_record(col text) returns boolean
language sql stable security definer set search_path = public as $$
  select case
    when col in ('activity', 'people', 'wiki_cats', 'qs_settings', 'apps') then public.is_active()
    when col = 'leads'    then public.perm('sales') <> 'none'
    -- danh sách dự án cần cho mọi module vận hành
    when col = 'projects' then public.perm('projects') <> 'none' or public.perm('pm') <> 'none' or public.perm('fin') <> 'none'
                              or public.perm('att') <> 'none' or public.perm('qs') <> 'none' or public.perm('sales') <> 'none'
    when col in ('gantt', 'quest') then public.perm('pm') <> 'none'
    when col = 'att'      then public.perm('att') <> 'none'
    when col = 'fin'      then public.perm('fin') <> 'none'
    when col like 'qs\_%' then public.perm('qs') <> 'none'
    when col like 'wiki\_%' then public.perm('wiki') <> 'none'
    else public.is_admin() end
$$;

create or replace function public.can_write_record(col text) returns boolean
language sql stable security definer set search_path = public as $$
  select case
    when col = 'activity' then public.is_active()
    when col = 'people'   then public.perm('att') = 'edit' or public.perm('projects') = 'edit' or public.perm('pm') = 'edit'
    when col = 'leads'    then public.perm('sales') = 'edit'
    -- Kinh doanh chuyển cơ hội sang "Dự án" sẽ tạo hồ sơ dự án
    when col = 'projects' then public.perm('projects') = 'edit' or public.perm('sales') = 'edit'
    when col in ('gantt', 'quest') then public.perm('pm') = 'edit' or (col = 'gantt' and public.perm('projects') = 'edit')
    when col = 'att'      then public.perm('att') = 'edit' or public.perm('projects') = 'edit'
    when col = 'fin'      then public.perm('fin') = 'edit' or public.perm('projects') = 'edit'
    when col like 'qs\_%' then public.perm('qs') = 'edit' or (col = 'qs_projects' and public.perm('projects') = 'edit')
    when col like 'wiki\_%' then public.perm('wiki') = 'edit'
    when col = 'apps'     then public.perm('apps') = 'edit'
    else public.is_admin() end
$$;

drop policy if exists records_all    on public.records;
drop policy if exists records_read   on public.records;
drop policy if exists records_insert on public.records;
drop policy if exists records_update on public.records;
drop policy if exists records_delete on public.records;
create policy records_read   on public.records for select to authenticated using (public.can_read_record(collection));
create policy records_insert on public.records for insert to authenticated with check (public.can_write_record(collection));
create policy records_update on public.records for update to authenticated using (public.can_write_record(collection)) with check (public.can_write_record(collection));
create policy records_delete on public.records for delete to authenticated using (public.can_write_record(collection));

grant execute on function public.perm(text), public.can_read_record(text), public.can_write_record(text) to authenticated;

-- Quản trị viên hiện có: đặt vai trò hiển thị
update public.profiles set role = 'admin' where is_admin and role = 'staff';
