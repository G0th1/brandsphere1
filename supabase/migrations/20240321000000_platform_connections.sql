create table platform_connections (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  platform text not null check (platform in ('youtube', 'facebook')),
  platform_user_id text not null,
  access_token text not null,
  refresh_token text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, platform)
);

-- Sätt upp RLS-policies
alter table platform_connections enable row level security;

create policy "Users can only access their own connections"
  on platform_connections for all
  using (auth.uid() = user_id); 