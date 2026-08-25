-- Create semesters table
create table semesters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  semester_number int not null,
  created_at timestamptz default now()
);

-- Create courses table
create table courses (
  id uuid primary key default gen_random_uuid(),
  semester_id uuid references semesters(id) on delete cascade not null,
  name text not null,
  credits numeric not null,
  grade text not null
);

-- Enable Row Level Security (RLS)
alter table semesters enable row level security;
alter table courses enable row level security;

-- RLS Policies for semesters
create policy "Users can select their own semesters"
  on semesters for select
  using (auth.uid() = user_id);

create policy "Users can insert their own semesters"
  on semesters for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own semesters"
  on semesters for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own semesters"
  on semesters for delete
  using (auth.uid() = user_id);

-- RLS Policies for courses (via subquery/join on semesters)
create policy "Users can select courses of their own semesters"
  on courses for select
  using (
    exists (
      select 1 from semesters
      where semesters.id = courses.semester_id
      and semesters.user_id = auth.uid()
    )
  );

create policy "Users can insert courses into their own semesters"
  on courses for insert
  with check (
    exists (
      select 1 from semesters
      where semesters.id = courses.semester_id
      and semesters.user_id = auth.uid()
    )
  );

create policy "Users can update courses of their own semesters"
  on courses for update
  using (
    exists (
      select 1 from semesters
      where semesters.id = courses.semester_id
      and semesters.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from semesters
      where semesters.id = courses.semester_id
      and semesters.user_id = auth.uid()
    )
  );

create policy "Users can delete courses of their own semesters"
  on courses for delete
  using (
    exists (
      select 1 from semesters
      where semesters.id = courses.semester_id
      and semesters.user_id = auth.uid()
    )
  );

-- Create page_visits table for anonymous visit tracking
create table if not exists page_visits (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS) on page_visits
alter table page_visits enable row level security;

-- Allow anonymous public inserts for visit tracking
create policy "Allow anonymous page visit inserts"
  on page_visits for insert
  with check (true);

-- Create a Security Definer function to return aggregate visit stats securely
create or replace function get_visit_stats()
returns json
language plpgsql
security definer
as $$
declare
  total_count bigint;
  today_count bigint;
  week_count bigint;
begin
  select count(*) into total_count from page_visits;
  select count(*) into today_count from page_visits where created_at >= date_trunc('day', now());
  select count(*) into week_count from page_visits where created_at >= (now() - interval '7 days');
  
  return json_build_object(
    'totalVisits', total_count,
    'todayVisits', today_count,
    'weekVisits', week_count
  );
end;
$$;

-- Grant execution permission on get_visit_stats function
grant execute on function get_visit_stats() to anon, authenticated, service_role;

