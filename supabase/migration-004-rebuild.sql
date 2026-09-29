-- =====================================================================
-- Dezon Workspace — Migration 004: phân quyền cho bản dựng lại theo SiteFlow-UI
-- SINH TỰ ĐỘNG bởi scripts/gen-perms-sql.js từ các khai báo syncCol() — đừng sửa tay, sửa module rồi chạy lại.
-- Chạy trong Supabase → SQL Editor SAU migration-003. Chạy lại nhiều lần vẫn an toàn.
-- Quyền mới: prod (Sản xuất). 40 bộ dữ liệu.
-- =====================================================================

create or replace function public.can_read_record(col text) returns boolean
language sql stable security definer set search_path = public as $$
  select case col
    when 'people' then public.is_active()
    when 'activity' then public.is_active()
    when 'apps' then public.is_active()
    when 'cal_events' then public.is_active()
    when 'cal_prefs' then public.is_active()
    when 'desk_tasks' then public.is_active()
    when 'desk_requests' then public.is_active()
    when 'feed_posts' then public.is_active()
    when 'fin_v2' then public.perm('fin') <> 'none'
    when 'fin_invoices' then public.perm('fin') <> 'none' or public.perm('po') <> 'none'
    when 'fin_taxes' then public.perm('fin') <> 'none'
    when 'fin_costs' then public.perm('fin') <> 'none'
    when 'fin_settings' then public.perm('fin') <> 'none'
    when 'att_sites' then public.is_active()
    when 'att_roster' then public.perm('att') <> 'none' or public.perm('hr') <> 'none'
    when 'att_recs' then public.is_active()
    when 'att_reqs' then public.is_active()
    when 'hr_staff' then public.perm('hr') <> 'none'
    when 'hr_pay' then public.perm('hr') <> 'none'
    when 'mkt_catalog' then public.perm('mkt') <> 'none'
    when 'mkt_campaigns' then public.perm('mkt') <> 'none'
    when 'mkt_tabs' then public.perm('mkt') <> 'none'
    when 'quest_mkt' then public.perm('mkt') <> 'none'
    when 'projects' then public.perm('projects') <> 'none' or public.perm('pm') <> 'none' or public.perm('sales') <> 'none' or public.perm('fin') <> 'none' or public.perm('att') <> 'none' or public.perm('qs') <> 'none' or public.perm('po') <> 'none' or public.perm('mkt') <> 'none' or public.perm('prod') <> 'none'
    when 'gantt' then public.perm('pm') <> 'none' or public.perm('projects') <> 'none'
    when 'quest_pm' then public.perm('pm') <> 'none'
    when 'qs_po' then public.perm('po') <> 'none' or public.perm('qs') <> 'none' or public.perm('prod') <> 'none'
    when 'prod_orders' then public.perm('prod') <> 'none'
    when 'prod_materials' then public.perm('prod') <> 'none'
    when 'prod_workers' then public.perm('prod') <> 'none'
    when 'prod_machines' then public.perm('prod') <> 'none'
    when 'qs_projects' then public.perm('qs') <> 'none' or public.perm('po') <> 'none'
    when 'qs_products' then public.perm('qs') <> 'none' or public.perm('po') <> 'none'
    when 'qs_settings' then public.perm('qs') <> 'none' or public.perm('po') <> 'none'
    when 'quest_' then public.perm('cfg.perm') <> 'none'
    when 'leads_v2' then public.perm('sales') <> 'none'
    when 'quest_sales' then public.perm('sales') <> 'none'
    when 'settings' then public.is_active()
    when 'wiki_pages' then public.is_active()
    when 'wiki_cats' then public.is_active()
    else public.is_admin() end
$$;

create or replace function public.can_write_record(col text) returns boolean
language sql stable security definer set search_path = public as $$
  select case col
    when 'people' then public.perm('att') = 'edit' or public.perm('hr') = 'edit' or public.perm('projects') = 'edit' or public.perm('pm') = 'edit' or public.perm('prod') = 'edit'
    when 'activity' then public.is_active()
    when 'apps' then public.perm('apps') = 'edit'
    when 'cal_events' then public.is_active()
    when 'cal_prefs' then public.is_active()
    when 'desk_tasks' then public.is_active()
    when 'desk_requests' then public.is_active()
    when 'feed_posts' then public.is_active()
    when 'fin_v2' then public.perm('fin') = 'edit' or public.perm('projects') = 'edit'
    when 'fin_invoices' then public.perm('fin') = 'edit' or public.perm('po') = 'edit'
    when 'fin_taxes' then public.perm('fin') = 'edit'
    when 'fin_costs' then public.perm('fin') = 'edit'
    when 'fin_settings' then public.perm('fin') = 'edit'
    when 'att_sites' then public.perm('att') = 'edit' or public.perm('projects') = 'edit'
    when 'att_roster' then public.perm('att') = 'edit'
    when 'att_recs' then public.is_active()
    when 'att_reqs' then public.is_active()
    when 'hr_staff' then public.perm('hr') = 'edit'
    when 'hr_pay' then public.perm('hr') = 'edit'
    when 'mkt_catalog' then public.perm('mkt') = 'edit'
    when 'mkt_campaigns' then public.perm('mkt') = 'edit'
    when 'mkt_tabs' then public.perm('mkt') = 'edit'
    when 'quest_mkt' then public.perm('mkt') = 'edit'
    when 'projects' then public.perm('projects') = 'edit' or public.perm('sales') = 'edit'
    when 'gantt' then public.perm('pm') = 'edit' or public.perm('projects') = 'edit'
    when 'quest_pm' then public.perm('pm') = 'edit'
    when 'qs_po' then public.perm('po') = 'edit' or public.perm('qs') = 'edit' or public.perm('prod') = 'edit'
    when 'prod_orders' then public.perm('prod') = 'edit'
    when 'prod_materials' then public.perm('prod') = 'edit'
    when 'prod_workers' then public.perm('prod') = 'edit'
    when 'prod_machines' then public.perm('prod') = 'edit'
    when 'qs_projects' then public.perm('qs') = 'edit' or public.perm('projects') = 'edit'
    when 'qs_products' then public.perm('qs') = 'edit'
    when 'qs_settings' then public.perm('qs') = 'edit'
    when 'quest_' then public.perm('cfg.perm') = 'edit'
    when 'leads_v2' then public.perm('sales') = 'edit'
    when 'quest_sales' then public.perm('sales') = 'edit'
    when 'settings' then public.is_admin()
    when 'wiki_pages' then public.perm('wiki') = 'edit'
    when 'wiki_cats' then public.perm('wiki') = 'edit'
    else public.is_admin() end
$$;

-- Tài khoản hiện có: thêm quyền Sản xuất mặc định "không" (giữ nguyên quyền đã cấp).
update public.profiles set perms = jsonb_build_object('prod', 'none') || perms where not is_admin and not (perms ? 'prod');
