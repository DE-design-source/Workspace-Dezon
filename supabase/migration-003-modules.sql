-- =====================================================================
-- Dezon Workspace — Migration 003: Marketing, HR (hồ sơ & lương), Mua hàng, Cài đặt
-- Chạy trong Supabase → SQL Editor SAU migration-002. Chạy lại nhiều lần vẫn an toàn.
--
-- Quyền mới trong profiles.perms:
--   mkt = Marketing · hr = Hồ sơ nhân sự & bảng lương · po = Mua hàng
-- Bộ dữ liệu mới trong bảng records:
--   quest_sales, quest_mkt, mkt_catalog, mkt_campaigns, hr_staff, hr_pay, settings
-- =====================================================================

create or replace function public.can_read_record(col text) returns boolean
language sql stable security definer set search_path = public as $$
  select case
    when col in ('activity', 'people', 'wiki_cats', 'qs_settings', 'apps', 'settings') then public.is_active()
    when col in ('leads', 'quest_sales') then public.perm('sales') <> 'none'
    when col = 'quest_mkt' or col like 'mkt\_%' then public.perm('mkt') <> 'none'
    when col like 'hr\_%' then public.perm('hr') <> 'none'
    when col = 'projects' then public.perm('projects') <> 'none' or public.perm('pm') <> 'none' or public.perm('fin') <> 'none'
                              or public.perm('att') <> 'none' or public.perm('qs') <> 'none' or public.perm('sales') <> 'none'
                              or public.perm('po') <> 'none' or public.perm('mkt') <> 'none'
    when col in ('gantt', 'quest') then public.perm('pm') <> 'none'
    when col = 'att'      then public.perm('att') <> 'none'
    when col = 'fin'      then public.perm('fin') <> 'none'
    when col = 'qs_po'    then public.perm('po') <> 'none' or public.perm('qs') <> 'none'
    when col like 'qs\_%' then public.perm('qs') <> 'none' or public.perm('po') <> 'none'
    when col like 'wiki\_%' then public.perm('wiki') <> 'none'
    else public.is_admin() end
$$;

create or replace function public.can_write_record(col text) returns boolean
language sql stable security definer set search_path = public as $$
  select case
    when col = 'activity' then public.is_active()
    when col = 'settings' then public.is_admin()
    when col = 'people'   then public.perm('att') = 'edit' or public.perm('projects') = 'edit' or public.perm('pm') = 'edit' or public.perm('hr') = 'edit'
    when col in ('leads', 'quest_sales') then public.perm('sales') = 'edit'
    when col = 'quest_mkt' or col like 'mkt\_%' then public.perm('mkt') = 'edit'
    when col like 'hr\_%' then public.perm('hr') = 'edit'
    when col = 'projects' then public.perm('projects') = 'edit' or public.perm('sales') = 'edit'
    when col in ('gantt', 'quest') then public.perm('pm') = 'edit' or (col = 'gantt' and public.perm('projects') = 'edit')
    when col = 'att'      then public.perm('att') = 'edit' or public.perm('projects') = 'edit'
    -- Mua hàng tạo hoá đơn chi khi nhận hàng
    when col = 'fin'      then public.perm('fin') = 'edit' or public.perm('projects') = 'edit' or public.perm('po') = 'edit'
    when col = 'qs_po'    then public.perm('po') = 'edit' or public.perm('qs') = 'edit'
    when col like 'qs\_%' then public.perm('qs') = 'edit' or (col = 'qs_projects' and public.perm('projects') = 'edit')
    when col like 'wiki\_%' then public.perm('wiki') = 'edit'
    when col = 'apps'     then public.perm('apps') = 'edit'
    else public.is_admin() end
$$;

-- Tài khoản hiện có: bổ sung mức mặc định cho 3 quyền mới (giữ nguyên các quyền đã cấp).
update public.profiles
   set perms = jsonb_build_object('mkt', 'none', 'hr', 'none', 'po', 'none') || perms
 where not is_admin and not (perms ? 'po');
