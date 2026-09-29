// Sinh SQL phân quyền (can_read_record / can_write_record) từ các khai báo syncCol(...) trong public/js.
// Chạy: node scripts/gen-perms-sql.js > supabase/migration-004-rebuild.sql
// ponytail: đọc khai báo bằng regex — mọi syncCol phải viết trên 1 dòng với read/write là 'all' | 'admin' | ['a','b'].
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'public', 'js');
const cols = new Map();
const rule = (src, key) => {
  const m = src.match(new RegExp(key + ":\\s*('all'|'admin'|\\[[^\\]]*\\])"));
  if (!m) return "'all'";
  return m[1];
};
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.js'))){
  const src = fs.readFileSync(path.join(dir, f), 'utf8');
  for (const line of src.split('\n')){
    const m = line.match(/syncCol\('([a-z0-9_]+)'/);
    if (m) cols.set(m[1], {read:rule(line, 'read'), write:rule(line, 'write')});
    const q = line.match(/registerQuest\('([a-z]+)',\s*\{[^}]*perm:\s*'([a-z]+)'/);
    if (q) cols.set('quest_' + q[1], {read:`['${q[2]}']`, write:`['${q[2]}']`});
  }
}
const sql = (r, need) => {
  if (r === "'all'") return 'public.is_active()';
  if (r === "'admin'") return 'public.is_admin()';
  const mods = r.slice(1, -1).split(',').map(s => s.trim().replace(/'/g, '')).filter(Boolean);
  return mods.map(m => need === 'view' ? `public.perm('${m}') <> 'none'` : `public.perm('${m}') = 'edit'`).join(' or ') || 'false';
};
const cases = need => [...cols].map(([n, r]) => `    when '${n}' then ${sql(need === 'view' ? r.read : r.write, need)}`).join('\n');
process.stdout.write(`-- =====================================================================
-- Dezon Workspace — Migration 004: phân quyền cho bản dựng lại theo SiteFlow-UI
-- SINH TỰ ĐỘNG bởi scripts/gen-perms-sql.js từ các khai báo syncCol() — đừng sửa tay, sửa module rồi chạy lại.
-- Chạy trong Supabase → SQL Editor SAU migration-003. Chạy lại nhiều lần vẫn an toàn.
-- Quyền mới: prod (Sản xuất). ${cols.size} bộ dữ liệu.
-- =====================================================================

create or replace function public.can_read_record(col text) returns boolean
language sql stable security definer set search_path = public as $$
  select case col
${cases('view')}
    else public.is_admin() end
$$;

create or replace function public.can_write_record(col text) returns boolean
language sql stable security definer set search_path = public as $$
  select case col
${cases('edit')}
    else public.is_admin() end
$$;

-- Tài khoản hiện có: thêm quyền Sản xuất mặc định "không" (giữ nguyên quyền đã cấp).
update public.profiles set perms = jsonb_build_object('prod', 'none') || perms where not is_admin and not (perms ? 'prod');
`);
