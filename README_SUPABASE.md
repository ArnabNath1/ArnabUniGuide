# Supabase Setup

To make the Profile save functionality work with your Supabase project, you need to create the `profiles` table.

Run the following SQL query in your Supabase SQL Editor:

```sql
create table profiles (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  name text,
  current_degree text,
  current_university text,
  gpa text,
  work_experience text,
  research_experience text,
  test_scores jsonb,
  skills text,
  projects text,
  target_country text,
  target_degree text,
  budget text,
  shortlisted_universities text,
  checklist jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table conversations (
  id uuid default uuid_generate_v4() primary key,
  user_email text not null,
  title text,
  messages jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

This will ensure the backend can successfully read and write profile data.
