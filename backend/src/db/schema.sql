-- Curlix Database Schema
-- Run this in Supabase SQL editor

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- URLs table: source of truth for all short links
CREATE TABLE IF NOT EXISTS urls (
  id               uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  short_code       varchar(30)  UNIQUE NOT NULL,
  long_url         text         NOT NULL,
  owner_token_hash text         NOT NULL,
  custom_alias     varchar(50)  UNIQUE,
  created_at       timestamptz  NOT NULL DEFAULT now(),
  expires_at       timestamptz,
  is_active        boolean      NOT NULL DEFAULT true
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_urls_short_code ON urls(short_code);
CREATE INDEX IF NOT EXISTS idx_urls_expires   ON urls(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_urls_active    ON urls(is_active);
CREATE INDEX IF NOT EXISTS idx_urls_alias     ON urls(custom_alias) WHERE custom_alias IS NOT NULL;

-- Analytics table: append-only click log
CREATE TABLE IF NOT EXISTS analytics (
  id          uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  url_id      uuid         NOT NULL REFERENCES urls(id) ON DELETE CASCADE,
  clicked_at  timestamptz  NOT NULL DEFAULT now(),
  referrer    text,
  user_agent  text,
  device_type varchar(20),
  country     char(2),
  ip_hash     varchar(64)
);

CREATE INDEX IF NOT EXISTS idx_analytics_url_time ON analytics(url_id, clicked_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_time     ON analytics(clicked_at DESC);
