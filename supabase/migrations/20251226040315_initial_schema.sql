-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================
-- Core Concepts
-- =========================
-- Represents abstract concepts that can be labeled and positioned in conceptual spaces
CREATE TABLE concepts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Multi-language labels for concepts
CREATE TABLE concept_labels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concept_id UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  label_text TEXT NOT NULL,
  language_code TEXT NOT NULL, -- ISO 639-1 (e.g., 'en', 'es', 'fr')
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Prevent duplicate labels per concept per language
  CONSTRAINT concept_labels_unique UNIQUE (concept_id, language_code, label_text)
);

CREATE INDEX idx_concept_labels_concept_id ON concept_labels(concept_id);
CREATE INDEX idx_concept_labels_language ON concept_labels(language_code);

-- =========================
-- Conceptual Spaces & Quality Dimensions
-- =========================
-- Defines the abstract spaces in which concepts can be represented (e.g., color, shape, taste)
CREATE TABLE conceptual_spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE, -- e.g., 'color', 'shape', 'taste'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Dimensions within a conceptual space that define its structure
CREATE TABLE quality_dimensions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conceptual_space_id UUID NOT NULL REFERENCES conceptual_spaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                    -- e.g., 'red', 'green', 'blue' for RGB color space
  data_type TEXT NOT NULL DEFAULT 'float', -- 'integer' | 'float' | 'enum'
  min_value DOUBLE PRECISION,            -- e.g., 0
  max_value DOUBLE PRECISION,            -- e.g., 255
  unit TEXT,                             -- e.g., 'level', 'degrees', 'intensity'
  sort_order INT NOT NULL DEFAULT 0,     -- Display/processing order
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_quality_dimensions_space_id ON quality_dimensions(conceptual_space_id);
CREATE UNIQUE INDEX idx_quality_dimensions_space_name ON quality_dimensions(conceptual_space_id, name);

-- =========================
-- Concept-Space Relationships
-- =========================
-- Defines which concepts are represented/meaningful in which conceptual spaces
-- E.g., the concept "red" belongs to the "color" conceptual space
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
-- Points in Conceptual Spaces
-- =========================
-- Represents specific locations within a conceptual space
CREATE TABLE space_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conceptual_space_id UUID NOT NULL REFERENCES conceptual_spaces(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_space_points_space_id ON space_points(conceptual_space_id);

-- Dimensional values for each point (e.g., R=255, G=0, B=0 for pure red)
CREATE TABLE space_point_values (
  point_id UUID NOT NULL REFERENCES space_points(id) ON DELETE CASCADE,
  dimension_id UUID NOT NULL REFERENCES quality_dimensions(id) ON DELETE CASCADE,
  value DOUBLE PRECISION NOT NULL,
  PRIMARY KEY (point_id, dimension_id)
);

CREATE INDEX idx_space_point_values_point ON space_point_values(point_id);
CREATE INDEX idx_space_point_values_dimension ON space_point_values(dimension_id);

