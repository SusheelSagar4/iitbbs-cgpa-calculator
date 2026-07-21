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
