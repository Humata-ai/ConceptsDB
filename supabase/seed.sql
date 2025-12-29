-- Supabase Seed File
-- This file runs all seed scripts in the correct order
-- Run with: supabase db seed or psql -f supabase/seed.sql

-- 1. Create conceptual spaces
\i seed/spaces/rgb_color_space.sql
\i seed/spaces/taste_space.sql

-- 2. Create dictionary concepts and their instances
\i seed/dictionary/apple/apple.sql
\i seed/dictionary/apple/apple-color.sql
\i seed/dictionary/apple/apple-taste.sql
