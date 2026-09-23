-- =====================================================================
-- SiteFlow Workspace — schema Supabase
-- Chạy 1 lần trong Supabase Dashboard → SQL Editor (chạy lại nhiều lần vẫn an toàn).
--
-- Gồm:
--   • profiles              : tài khoản nhân viên (gắn với auth.users — đăng nhập email + mật khẩu)
--   • conversations / conversation_members / messages : chat nội bộ, CHỈ thành viên nhóm đọc được
--   • records               : dữ liệu dùng chung của các module (dự án, kinh doanh, tiến độ, tài chính, QS, wiki…)
--   • storage bucket chat-files : tệp gửi trong chat, chỉ thành viên nhóm mở được
-- Mọi bảng đều BẬT RLS. Không tắt RLS ở dự án này (khác QS Pro) vì chứa tin nhắn riêng tư.
-- =====================================================================

create extension if not exists pgcrypto;

-- Hai cuộc hội thoại cố định: mọi tài khoản mới tự được thêm vào.
--   SiteFlow Bot      : 00000000-0000-0000-0000-000000000b07
--   Toàn công ty      : 00000000-0000-0000-0000-000000000001

-- ============ Hồ sơ người dùng ============
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null unique,
  name        text not null default '',
  title       text not null default '',          -- chức danh
  team        text not null default '',          -- phòng ban / đội
  color       text not null default 'blue',
  is_admin    boolean not null default false,
  active      boolean not null default true,     -- false = đã khoá, không đọc/ghi được gì
  created_at  timestamptz not null default now()
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select is_admin and active from public.profiles where id = auth.uid()), false)
$$;

create or replace function public.is_active() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select active from public.profiles where id = auth.uid()), false)
$$;

-- Người thường chỉ sửa được tên / chức danh / phòng ban / màu của chính mình.
create or replace function public.guard_profile() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if coalesce(auth.role(), '') <> 'service_role' and not public.is_admin() then
    new.is_admin := old.is_admin;
    new.active   := old.active;
    new.email    := old.email;
  end if;
  new.id := old.id;
  return new;
end $$;
drop trigger if exists guard_profile on public.profiles;
create trigger guard_profile before update on public.profiles
  for each row execute function public.guard_profile();

-- ============ Chat ============
create table if not exists public.conversations (
  id               uuid primary key default gen_random_uuid(),
  type             text not null check (type in ('dm', 'group', 'bot')),
  name             text not null default '',
  icon             text not null default 'users',
  color            text not null default 'blue',
  project_id       text,                           -- gắn nhóm chat với dự án (records.projects)
  created_by       uuid references public.profiles(id) on delete set null,
  created_at       timestamptz not null default now(),
  last_message_at  timestamptz not null default now()
);

create table if not exists public.conversation_members (
  conversation_id  uuid not null references public.conversations(id) on delete cascade,
  user_id          uuid not null references public.profiles(id) on delete cascade,
  last_read_at     timestamptz not null default now(),
  joined_at        timestamptz not null default now(),
  primary key (conversation_id, user_id)
);
create index if not exists conversation_members_user_idx on public.conversation_members(user_id);

create table if not exists public.messages (
  id               uuid primary key default gen_random_uuid(),
  conversation_id  uuid not null references public.conversations(id) on delete cascade,
  sender_id        uuid references public.profiles(id) on delete set null,
  body             text not null default '',
  file_path        text,                           -- đường dẫn trong bucket chat-files
  file_name        text,
  file_size        bigint,
  file_type        text,
  bot              jsonb,                          -- tin cảnh báo tự động {level,title,meta,go,sub}
  created_at       timestamptz not null default now(),
  edited_at        timestamptz,
  deleted_at       timestamptz                     -- thu hồi
);
create index if not exists messages_conv_time_idx on public.messages(conversation_id, created_at desc);

create or replace function public.is_member(conv uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select public.is_active() and exists (
    select 1 from public.conversation_members where conversation_id = conv and user_id = auth.uid())
$$;

create or replace function public.touch_conversation() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update public.conversations set last_message_at = new.created_at where id = new.conversation_id;
  return new;
end $$;
drop trigger if exists touch_conversation on public.messages;
create trigger touch_conversation after insert on public.messages
  for each row execute function public.touch_conversation();

-- Chỉ người gửi được sửa / thu hồi tin; không đổi được người gửi, nhóm, thời gian.
create or replace function public.guard_message() returns trigger
language plpgsql as $$
begin
  new.conversation_id := old.conversation_id;
  new.sender_id       := old.sender_id;
  new.created_at      := old.created_at;
  new.file_path       := old.file_path;
  return new;
end $$;
drop trigger if exists guard_message on public.messages;
create trigger guard_message before update on public.messages
  for each row execute function public.guard_message();

-- Nhắn riêng: tìm hội thoại 1-1 đã có hoặc tạo mới.
create or replace function public.create_dm(other uuid) returns uuid
language plpgsql security definer set search_path = public as $$
declare conv uuid;
begin
  if not public.is_active() then raise exception 'Tài khoản không hoạt động'; end if;
  if other = auth.uid() then raise exception 'Không thể nhắn riêng cho chính mình'; end if;
  if not exists (select 1 from public.profiles where id = other and active) then raise exception 'Người nhận không tồn tại'; end if;
  select c.id into conv from public.conversations c
   where c.type = 'dm'
     and exists (select 1 from public.conversation_members m where m.conversation_id = c.id and m.user_id = auth.uid())
     and exists (select 1 from public.conversation_members m where m.conversation_id = c.id and m.user_id = other)
   limit 1;
  if conv is null then
    insert into public.conversations(type, created_by) values ('dm', auth.uid()) returning id into conv;
    insert into public.conversation_members(conversation_id, user_id) values (conv, auth.uid()), (conv, other);
  end if;
  return conv;
end $$;

-- Nhóm chat (kể cả nhóm dự án). Người tạo luôn là thành viên.
create or replace function public.create_group(p_name text, p_members uuid[], p_project text default null,
                                               p_icon text default 'users', p_color text default 'blue') returns uuid
language plpgsql security definer set search_path = public as $$
declare conv uuid;
begin
  if not public.is_active() then raise exception 'Tài khoản không hoạt động'; end if;
  if coalesce(trim(p_name), '') = '' then raise exception 'Cần đặt tên nhóm'; end if;
  if p_project is not null then
    select id into conv from public.conversations where project_id = p_project and type = 'group' limit 1;
  end if;
  if conv is null then
    insert into public.conversations(type, name, project_id, icon, color, created_by)
      values ('group', trim(p_name), p_project, p_icon, p_color, auth.uid()) returning id into conv;
  end if;
  insert into public.conversation_members(conversation_id, user_id)
    select conv, u from (select unnest(p_members || auth.uid()) as u) x
    where exists (select 1 from public.profiles p where p.id = x.u and p.active)
    on conflict do nothing;
  return conv;
end $$;

create or replace function public.add_members(conv uuid, p_members uuid[]) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not (public.is_member(conv) or public.is_admin()) then raise exception 'Bạn không ở trong nhóm này'; end if;
  if (select type from public.conversations where id = conv) <> 'group' then raise exception 'Chỉ thêm người vào nhóm'; end if;
  insert into public.conversation_members(conversation_id, user_id)
    select conv, u from unnest(p_members) u
    where exists (select 1 from public.profiles p where p.id = u and p.active)
    on conflict do nothing;
end $$;

-- ============ Dữ liệu dùng chung của các module ============
-- Mỗi dòng = 1 bản ghi (1 dự án, 1 khách hàng, tiến độ của 1 dự án, 1 trang wiki…) dạng JSON.
create table if not exists public.records (
  collection  text not null,
  id          text not null,
  data        jsonb not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  updated_by  uuid default auth.uid() references public.profiles(id) on delete set null,
  primary key (collection, id)
);

create or replace function public.stamp_record() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  new.updated_by := coalesce(auth.uid(), new.updated_by);
  return new;
end $$;
drop trigger if exists stamp_record on public.records;
create trigger stamp_record before insert or update on public.records
  for each row execute function public.stamp_record();

-- ============ Tài khoản mới → hồ sơ + vào 2 hội thoại chung ============
insert into public.conversations(id, type, name, icon, color)
  values ('00000000-0000-0000-0000-000000000b07', 'bot', 'SiteFlow Bot', 'bot', 'gray'),
         ('00000000-0000-0000-0000-000000000001', 'group', 'Toàn công ty', 'users', 'purple')
  on conflict (id) do nothing;

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id, email, name, title, team, is_admin)
  values (new.id, lower(new.email),
          coalesce(nullif(new.raw_user_meta_data->>'name', ''), split_part(new.email, '@', 1)),
          coalesce(new.raw_user_meta_data->>'title', ''),
          coalesce(new.raw_user_meta_data->>'team', ''),
          not exists (select 1 from public.profiles))            -- tài khoản ĐẦU TIÊN là quản trị
  on conflict (id) do nothing;
  insert into public.conversation_members(conversation_id, user_id)
  values ('00000000-0000-0000-0000-000000000b07', new.id),
         ('00000000-0000-0000-0000-000000000001', new.id)
  on conflict do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ RLS ============
alter table public.profiles             enable row level security;
alter table public.conversations        enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages             enable row level security;
alter table public.records              enable row level security;

drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles for select to authenticated using (public.is_active());
drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles for update to authenticated
  using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());

drop policy if exists conv_read on public.conversations;
create policy conv_read on public.conversations for select to authenticated using (public.is_member(id));
drop policy if exists conv_update on public.conversations;
create policy conv_update on public.conversations for update to authenticated
  using (public.is_member(id) and type = 'group') with check (public.is_member(id) and type = 'group');

drop policy if exists members_read on public.conversation_members;
create policy members_read on public.conversation_members for select to authenticated using (public.is_member(conversation_id));
drop policy if exists members_update_self on public.conversation_members;
create policy members_update_self on public.conversation_members for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists members_leave on public.conversation_members;
create policy members_leave on public.conversation_members for delete to authenticated
  using ((user_id = auth.uid() or public.is_admin())
         and conversation_id not in ('00000000-0000-0000-0000-000000000b07', '00000000-0000-0000-0000-000000000001'));

drop policy if exists msg_read on public.messages;
create policy msg_read on public.messages for select to authenticated using (public.is_member(conversation_id));
drop policy if exists msg_send on public.messages;
create policy msg_send on public.messages for insert to authenticated
  with check (sender_id = auth.uid() and public.is_member(conversation_id)
              and (bot is not null or conversation_id <> '00000000-0000-0000-0000-000000000b07'));
drop policy if exists msg_edit on public.messages;
create policy msg_edit on public.messages for update to authenticated
  using (sender_id = auth.uid() and public.is_member(conversation_id))
  with check (sender_id = auth.uid());

drop policy if exists records_all on public.records;
create policy records_all on public.records for all to authenticated
  using (public.is_active()) with check (public.is_active());

-- ============ Quyền truy cập API ============
revoke all on public.profiles, public.conversations, public.conversation_members, public.messages, public.records from anon;
grant usage on schema public to authenticated;
grant select, update on public.profiles to authenticated;
grant select, update on public.conversations to authenticated;
grant select, update, delete on public.conversation_members to authenticated;
grant select, insert, update on public.messages to authenticated;
grant select, insert, update, delete on public.records to authenticated;
grant execute on function public.create_dm(uuid), public.create_group(text, uuid[], text, text, text),
                          public.add_members(uuid, uuid[]), public.is_member(uuid), public.is_admin(), public.is_active()
  to authenticated;
revoke execute on function public.create_dm(uuid), public.create_group(text, uuid[], text, text, text),
                           public.add_members(uuid, uuid[]) from anon, public;

-- ============ Tệp chat (Storage) ============
-- Đường dẫn tệp: <conversation_id>/<tên tệp>. Tối đa 25 MB / tệp.
insert into storage.buckets(id, name, public, file_size_limit)
  values ('chat-files', 'chat-files', false, 26214400)
  on conflict (id) do nothing;

drop policy if exists chat_files_read on storage.objects;
create policy chat_files_read on storage.objects for select to authenticated
  using (bucket_id = 'chat-files' and public.is_member(((storage.foldername(name))[1])::uuid));
drop policy if exists chat_files_upload on storage.objects;
create policy chat_files_upload on storage.objects for insert to authenticated
  with check (bucket_id = 'chat-files' and public.is_member(((storage.foldername(name))[1])::uuid));

-- ============ Realtime (tin nhắn & dữ liệu cập nhật tức thời) ============
do $$
declare t text;
begin
  foreach t in array array['messages', 'conversations', 'conversation_members', 'records', 'profiles'] loop
    if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;
