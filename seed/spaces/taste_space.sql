-- Seed file: Taste Space
-- This creates a general taste space that can be used for any concepts
-- Based on the five basic tastes: sweet, sour, salty, bitter, and umami

-- Create the Taste Space
INSERT INTO conceptual_spaces (name, value_json_schema)
VALUES (
  'taste_space',
  '{
    "type": "object",
    "properties": {
      "sweet": {
        "type": "number",
        "minimum": 0,
        "maximum": 1,
        "description": "Sweetness intensity (0-1)"
      },
      "sour": {
        "type": "number",
        "minimum": 0,
        "maximum": 1,
        "description": "Sourness intensity (0-1)"
      },
      "salty": {
        "type": "number",
        "minimum": 0,
        "maximum": 1,
        "description": "Saltiness intensity (0-1)"
      },
      "bitter": {
        "type": "number",
        "minimum": 0,
        "maximum": 1,
        "description": "Bitterness intensity (0-1)"
      },
      "umami": {
        "type": "number",
        "minimum": 0,
        "maximum": 1,
        "description": "Umami intensity (0-1)"
      }
    },
    "required": ["sweet", "sour", "salty", "bitter", "umami"],
    "additionalProperties": false
  }'::jsonb
);

-- Create quality dimensions for the Taste space
DO $$
DECLARE
  v_space_id uuid;
BEGIN
  -- Get the space ID
  SELECT id INTO v_space_id
  FROM conceptual_spaces
  WHERE name = 'taste_space';

  -- Create quality dimensions
  INSERT INTO quality_dimensions (conceptual_space_id, name, json_schema)
  VALUES
    (v_space_id, 'sweet', '{"type": "number", "minimum": 0, "maximum": 1}'::jsonb),
    (v_space_id, 'sour', '{"type": "number", "minimum": 0, "maximum": 1}'::jsonb),
    (v_space_id, 'salty', '{"type": "number", "minimum": 0, "maximum": 1}'::jsonb),
    (v_space_id, 'bitter', '{"type": "number", "minimum": 0, "maximum": 1}'::jsonb),
    (v_space_id, 'umami', '{"type": "number", "minimum": 0, "maximum": 1}'::jsonb);

  RAISE NOTICE 'Taste Space created successfully';
  RAISE NOTICE 'Space ID: %', v_space_id;
END $$;
