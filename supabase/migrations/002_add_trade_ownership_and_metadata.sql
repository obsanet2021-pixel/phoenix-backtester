alter table public.trades
  add column if not exists user_id uuid references auth.users (id) on delete cascade,
  add column if not exists opened_at timestamp with time zone default now(),
  add column if not exists closed_at timestamp with time zone,
  add column if not exists updated_at timestamp with time zone default now(),
  add column if not exists position_size numeric(12, 4),
  add column if not exists status text not null default 'open' check (status in ('open', 'closed')),
  add column if not exists metadata jsonb not null default '{}'::jsonb;

create index if not exists idx_trades_user_id on public.trades(user_id);
create index if not exists idx_trades_status on public.trades(status);
create index if not exists idx_trades_opened_at on public.trades(opened_at desc);

drop policy if exists "Allow all operations on trades" on public.trades;

create policy "Users can read their own trades"
  on public.trades
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own trades"
  on public.trades
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own trades"
  on public.trades
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own trades"
  on public.trades
  for delete
  using (auth.uid() = user_id);
