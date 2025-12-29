-- Seed file: Apple Taste Instance
-- This links the 'apple' concept to taste space with a general taste profile
-- Requires: taste_space and apple concept to be created first

DO $$
DECLARE
  v_space_id uuid;
  v_apple_concept_id uuid;
  v_taste_obj_id uuid;
BEGIN
  -- Get the Taste space ID
  SELECT id INTO v_space_id
  FROM conceptual_spaces
  WHERE name = 'taste_space';

  IF v_space_id IS NULL THEN
    RAISE EXCEPTION 'Taste space not found. Please create taste_space first.';
  END IF;

  -- Get the apple concept ID
  SELECT c.id INTO v_apple_concept_id
  FROM concepts c
  JOIN concept_labels cl ON c.id = cl.concept_id
  WHERE cl.label_text = 'Apple' AND cl.language_code = 'en';

  IF v_apple_concept_id IS NULL THEN
    RAISE EXCEPTION 'Apple concept not found. Please run apple.sql first.';
  END IF;

  -- Create a conceptual space object with general apple taste profile
  -- Values represent a balanced, typical apple (average across varieties)
  INSERT INTO conceptual_space_objects (conceptual_space_id, value)
  VALUES (v_space_id, '{"sweet": 0.65, "sour": 0.4, "salty": 0.0, "bitter": 0.05, "umami": 0.0}'::jsonb)
  RETURNING id INTO v_taste_obj_id;

  -- Link the apple concept to the taste object in the space
  INSERT INTO concept_space_objects (concept_id, conceptual_space_object_id)
  VALUES (v_apple_concept_id, v_taste_obj_id);

  RAISE NOTICE 'Apple taste instance created successfully';
  RAISE NOTICE 'Space ID: %', v_space_id;
  RAISE NOTICE 'Apple Concept ID: %', v_apple_concept_id;
  RAISE NOTICE 'Taste Object ID: %', v_taste_obj_id;
END $$;
