#!/usr/bin/env bash
set -e

PROJECT_ID="tnuohaidpcqriecdwcly"
TYPES_OUTPUT="types/supabase.ts"
SCHEMA_OUTPUT="types/schema.sql"

echo "Generating TypeScript types..."
npx supabase gen types typescript --project-id "$PROJECT_ID" > "$TYPES_OUTPUT"

echo "Exporting database schema..."
{
  echo "-- Auto-generated schema file from Supabase"
  echo "-- Generated at: $(date -u +"%Y-%m-%d %H:%M:%S UTC")"
  echo "-- Project ID: $PROJECT_ID"
  echo ""
  npx supabase db dump --linked --schema public
} > "$SCHEMA_OUTPUT"

echo "✓ Types generated: $TYPES_OUTPUT"
echo "✓ Schema exported: $SCHEMA_OUTPUT"
