-- Table des abonnés à la newsletter DataSphère
-- À exécuter dans l'éditeur SQL de ton projet Supabase

create table if not exists newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  prenom text,
  frequence text default 'hebdo' check (frequence in ('hebdo', 'mensuelle')),
  confirmed boolean default false not null,
  confirmation_token text,
  confirmation_sent_at timestamptz,
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  created_at timestamptz default now() not null
);

-- Index pour les lookups fréquents
create index if not exists idx_newsletter_email on newsletter_subscribers(email);
create index if not exists idx_newsletter_token on newsletter_subscribers(confirmation_token) where confirmation_token is not null;

-- Row Level Security : seule la service role key peut lire/écrire
alter table newsletter_subscribers enable row level security;

-- Politique : insertion publique autorisée (le formulaire peut s'abonner)
-- La lecture et mise à jour restent réservées à la service role key (côté serveur)
create policy "Insertion publique" on newsletter_subscribers
  for insert
  with check (true);

-- Vue pratique pour compter les abonnés confirmés (usage admin)
create or replace view newsletter_stats as
select
  count(*) filter (where confirmed = true)  as abonnes_confirmes,
  count(*) filter (where confirmed = false) as en_attente,
  count(*) filter (where unsubscribed_at is not null) as desabonnes,
  count(*)                                  as total
from newsletter_subscribers;
