-- Phase 2 Migration: Add is_favorite and tags columns
-- Run this in your Supabase SQL Editor

-- Add is_favorite column with default false
ALTER TABLE bookmarks ADD COLUMN IF NOT EXISTS is_favorite boolean DEFAULT false;

-- Add tags column as a text array with default empty array
ALTER TABLE bookmarks ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';
