create table if not exists careers (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  faculty text not null,
  block text not null check (block in ('A','B','C','D','E')),
  referential_score numeric not null default 0,
  weights jsonb not null default '{}',
  estimated_duration integer not null default 180,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  course text not null,
  area text not null check (area in ('A','B','C','D','E')),
  difficulty text not null check (difficulty in ('basic','intermediate','advanced')),
  content text not null,
  options jsonb not null,
  correct_option_id text not null,
  explanation text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists exam_attempts (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  student_email text not null,
  student_phone text not null,
  career_id uuid not null references careers(id),
  start_time timestamptz not null default now(),
  end_time timestamptz,
  status text not null default 'in_progress' check (status in ('in_progress','submitted','graded')),
  answers jsonb not null default '[]'::jsonb,
  score numeric default null,
  referential_score numeric default null,
  gap numeric default null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id text,
  action text not null check (action in ('CREATE','UPDATE','DELETE','IMPORT')),
  collection_name text not null,
  record_id text not null,
  created_at timestamptz default now()
);

create index if not exists idx_careers_code on careers(code);
create index if not exists idx_questions_course on questions(course);
create index if not exists idx_exam_attempts_career on exam_attempts(career_id);
create index if not exists idx_exam_attempts_status on exam_attempts(status);

alter table careers enable row level security;
alter table questions enable row level security;
alter table exam_attempts enable row level security;
alter table audit_logs enable row level security;

drop policy if exists "careers_public_read" on careers;
drop policy if exists "questions_public_read" on questions;
drop policy if exists "exam_attempts_insert_public" on exam_attempts;
drop policy if exists "exam_attempts_update_public" on exam_attempts;
drop policy if exists "admin_only_manage" on careers;
drop policy if exists "admin_only_questions" on questions;
drop policy if exists "admin_only_audit" on audit_logs;

create policy "careers_public_read"
on careers for select
using (true);

create policy "questions_public_read"
on questions for select
using (true);

create policy "exam_attempts_insert_public"
on exam_attempts for insert
with check (true);

create policy "exam_attempts_update_public"
on exam_attempts for update
using (true)
with check (true);

create policy "admin_only_manage"
on careers for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "admin_only_questions"
on questions for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "admin_only_audit"
on audit_logs for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop trigger if exists trg_grade_exam_attempt on exam_attempts;
drop function if exists grade_exam_attempt();

create or replace function grade_exam_attempt()
returns trigger
language plpgsql
as $$
declare
  item jsonb;
  q record;
  correct_count integer := 0;
  error_count integer := 0;
  blank_count integer := 0;
  final_score numeric := 0;
  career_row record;
begin
  if NEW.status <> 'submitted' then
    return NEW;
  end if;

  if NEW.score is not null then
    return NEW;
  end if;

  for item in select * from jsonb_array_elements(coalesce(NEW.answers, '[]'::jsonb))
  loop
    select * into q
    from questions
    where id = (item->>'question_id')::uuid;

    if q is null then
      continue;
    end if;

    if item->>'selected_option_id' is null or item->>'selected_option_id' = '' then
      blank_count := blank_count + 1;
    elsif item->>'selected_option_id' = q.correct_option_id then
      correct_count := correct_count + 1;
      final_score := final_score + 1;
    else
      error_count := error_count + 1;
      final_score := final_score - 0.25;
    end if;
  end loop;

  final_score := greatest(final_score, 0);

  select * into career_row
  from careers
  where id = NEW.career_id;

  NEW.referential_score := coalesce(career_row.referential_score, 0);
  NEW.score := round(final_score, 2);
  NEW.gap := greatest(NEW.referential_score - NEW.score, 0);
  NEW.status := 'graded';
  NEW.updated_at := now();

  return NEW;
end;
$$;

create trigger trg_grade_exam_attempt
before update on exam_attempts
for each row
when (new.status = 'submitted' and new.score is null)
execute function grade_exam_attempt();
