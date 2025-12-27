-- Migration: Update to JSONB-based schema
-- This migration drops the old normalized schema and replaces it with a JSONB-based approach

-- =========================
-- Drop Old Tables
-- =========================
DROP TABLE IF EXISTS space_point_values CASCADE;
DROP TABLE IF EXISTS space_points CASCADE;
DROP TABLE IF EXISTS concept_space_membership CASCADE;
DROP TABLE IF EXISTS quality_dimensions CASCADE;
DROP TABLE IF EXISTS conceptual_spaces CASCADE;
DROP TABLE IF EXISTS concept_labels CASCADE;
DROP TABLE IF EXISTS concepts CASCADE;

-- =========================
-- Core Concepts
-- =========================
CREATE TABLE concepts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE concept_labels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concept_id UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  label_text TEXT NOT NULL,
  language_code TEXT NOT NULL, -- ISO 639-1 (e.g., 'en', 'es', 'fr')
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT concept_labels_unique UNIQUE (concept_id, language_code, label_text)
);

CREATE INDEX idx_concept_labels_concept_id ON concept_labels(concept_id);
CREATE INDEX idx_concept_labels_language ON concept_labels(language_code);

-- =========================
-- Conceptual Spaces
-- =========================
CREATE TABLE conceptual_spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE, -- e.g., 'color', 'shape', 'taste'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================
-- Quality Dimensions (as JSON-schema-defined fields)
-- =========================
-- Quality dimensions are now semantic "named dimensions" that may carry their own JSON Schema.
-- This supports:
-- - documenting a dimension (or a structured sub-object) explicitly
-- - validating dimension-level payloads if you ever store them separately or use them as references
CREATE TABLE quality_dimensions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conceptual_space_id UUID NOT NULL REFERENCES conceptual_spaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                  -- e.g., 'r', 'g', 'b' or 'cylinder'
  json_schema JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT quality_dimensions_unique UNIQUE (conceptual_space_id, name),
  CONSTRAINT quality_dimensions_schema_is_object CHECK (jsonb_typeof(json_schema) = 'object')
);

CREATE INDEX idx_quality_dimensions_space_id ON quality_dimensions(conceptual_space_id);

-- =========================
-- Concept-Space Relationships
-- =========================
CREATE TABLE concept_space_membership (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concept_id UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  conceptual_space_id UUID NOT NULL REFERENCES conceptual_spaces(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT concept_space_membership_unique UNIQUE (concept_id, conceptual_space_id)
);

CREATE INDEX idx_concept_space_membership_concept ON concept_space_membership(concept_id);
CREATE INDEX idx_concept_space_membership_space ON concept_space_membership(conceptual_space_id);

-- =========================
-- Conceptual Space Objects (formerly "space_points")
-- =========================
-- Renamed to reflect: an instance/value stored in a conceptual space for a concept.
-- This can be a prototype point, an exemplar, or any structured representation (JSONB).
CREATE TABLE conceptual_space_objects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conceptual_space_id UUID NOT NULL REFERENCES conceptual_spaces(id) ON DELETE CASCADE,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT conceptual_space_objects_value_is_object CHECK (jsonb_typeof(value) = 'object')
);

CREATE INDEX idx_cso_space_id ON conceptual_space_objects(conceptual_space_id);
CREATE INDEX idx_cso_value_gin ON conceptual_space_objects USING GIN (value);

-- =========================
-- (Optional but strongly recommended) Space-level schema for validating value
-- =========================
-- If you want a single "shape space schema" or "RGB schema" per space,
-- store it here (dimension schemas can be used as components).
ALTER TABLE conceptual_spaces
ADD COLUMN value_json_schema JSONB NOT NULL DEFAULT '{}'::jsonb,
ADD COLUMN schema_version INT NOT NULL DEFAULT 1,
ADD CONSTRAINT conceptual_spaces_schema_is_object CHECK (jsonb_typeof(value_json_schema) = 'object');

-- =========================
-- Link Concepts to Stored Objects in a Space
-- =========================
-- A concept can have many objects in a space (prototype + exemplars + variants).
CREATE TABLE concept_space_objects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concept_id UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  conceptual_space_object_id UUID NOT NULL REFERENCES conceptual_space_objects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT concept_space_objects_unique UNIQUE (concept_id, conceptual_space_object_id)
);

CREATE INDEX idx_concept_space_objects_concept ON concept_space_objects(concept_id);
CREATE INDEX idx_concept_space_objects_object ON concept_space_objects(conceptual_space_object_id);
