-- Remove AI theme generation feature
-- Drop the theme_config column from users table
ALTER TABLE public.users DROP COLUMN IF EXISTS theme_config;
