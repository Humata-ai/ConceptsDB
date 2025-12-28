-- Auto-generated schema file from Supabase
-- Generated at: 2025-12-28 00:24:02 UTC
-- Project ID: tnuohaidpcqriecdwcly




SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."concept_labels" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "concept_id" "uuid" NOT NULL,
    "label_text" "text" NOT NULL,
    "language_code" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."concept_labels" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."concept_space_membership" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "concept_id" "uuid" NOT NULL,
    "conceptual_space_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."concept_space_membership" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."concept_space_objects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "concept_id" "uuid" NOT NULL,
    "conceptual_space_object_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."concept_space_objects" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."concepts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."concepts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."conceptual_space_objects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "conceptual_space_id" "uuid" NOT NULL,
    "value" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "conceptual_space_objects_value_is_object" CHECK (("jsonb_typeof"("value") = 'object'::"text"))
);


ALTER TABLE "public"."conceptual_space_objects" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."conceptual_spaces" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "value_json_schema" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "schema_version" integer DEFAULT 1 NOT NULL,
    CONSTRAINT "conceptual_spaces_schema_is_object" CHECK (("jsonb_typeof"("value_json_schema") = 'object'::"text"))
);


ALTER TABLE "public"."conceptual_spaces" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."quality_dimensions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "conceptual_space_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "json_schema" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "quality_dimensions_schema_is_object" CHECK (("jsonb_typeof"("json_schema") = 'object'::"text"))
);


ALTER TABLE "public"."quality_dimensions" OWNER TO "postgres";


ALTER TABLE ONLY "public"."concept_labels"
    ADD CONSTRAINT "concept_labels_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."concept_labels"
    ADD CONSTRAINT "concept_labels_unique" UNIQUE ("concept_id", "language_code", "label_text");



ALTER TABLE ONLY "public"."concept_space_membership"
    ADD CONSTRAINT "concept_space_membership_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."concept_space_membership"
    ADD CONSTRAINT "concept_space_membership_unique" UNIQUE ("concept_id", "conceptual_space_id");



ALTER TABLE ONLY "public"."concept_space_objects"
    ADD CONSTRAINT "concept_space_objects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."concept_space_objects"
    ADD CONSTRAINT "concept_space_objects_unique" UNIQUE ("concept_id", "conceptual_space_object_id");



ALTER TABLE ONLY "public"."concepts"
    ADD CONSTRAINT "concepts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."conceptual_space_objects"
    ADD CONSTRAINT "conceptual_space_objects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."conceptual_spaces"
    ADD CONSTRAINT "conceptual_spaces_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."conceptual_spaces"
    ADD CONSTRAINT "conceptual_spaces_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."quality_dimensions"
    ADD CONSTRAINT "quality_dimensions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."quality_dimensions"
    ADD CONSTRAINT "quality_dimensions_unique" UNIQUE ("conceptual_space_id", "name");



CREATE INDEX "idx_concept_labels_concept_id" ON "public"."concept_labels" USING "btree" ("concept_id");



CREATE INDEX "idx_concept_labels_language" ON "public"."concept_labels" USING "btree" ("language_code");



CREATE INDEX "idx_concept_space_membership_concept" ON "public"."concept_space_membership" USING "btree" ("concept_id");



CREATE INDEX "idx_concept_space_membership_space" ON "public"."concept_space_membership" USING "btree" ("conceptual_space_id");



CREATE INDEX "idx_concept_space_objects_concept" ON "public"."concept_space_objects" USING "btree" ("concept_id");



CREATE INDEX "idx_concept_space_objects_object" ON "public"."concept_space_objects" USING "btree" ("conceptual_space_object_id");



CREATE INDEX "idx_cso_space_id" ON "public"."conceptual_space_objects" USING "btree" ("conceptual_space_id");



CREATE INDEX "idx_cso_value_gin" ON "public"."conceptual_space_objects" USING "gin" ("value");



CREATE INDEX "idx_quality_dimensions_space_id" ON "public"."quality_dimensions" USING "btree" ("conceptual_space_id");



ALTER TABLE ONLY "public"."concept_labels"
    ADD CONSTRAINT "concept_labels_concept_id_fkey" FOREIGN KEY ("concept_id") REFERENCES "public"."concepts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."concept_space_membership"
    ADD CONSTRAINT "concept_space_membership_concept_id_fkey" FOREIGN KEY ("concept_id") REFERENCES "public"."concepts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."concept_space_membership"
    ADD CONSTRAINT "concept_space_membership_conceptual_space_id_fkey" FOREIGN KEY ("conceptual_space_id") REFERENCES "public"."conceptual_spaces"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."concept_space_objects"
    ADD CONSTRAINT "concept_space_objects_concept_id_fkey" FOREIGN KEY ("concept_id") REFERENCES "public"."concepts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."concept_space_objects"
    ADD CONSTRAINT "concept_space_objects_conceptual_space_object_id_fkey" FOREIGN KEY ("conceptual_space_object_id") REFERENCES "public"."conceptual_space_objects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."conceptual_space_objects"
    ADD CONSTRAINT "conceptual_space_objects_conceptual_space_id_fkey" FOREIGN KEY ("conceptual_space_id") REFERENCES "public"."conceptual_spaces"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."quality_dimensions"
    ADD CONSTRAINT "quality_dimensions_conceptual_space_id_fkey" FOREIGN KEY ("conceptual_space_id") REFERENCES "public"."conceptual_spaces"("id") ON DELETE CASCADE;



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON TABLE "public"."concept_labels" TO "anon";
GRANT ALL ON TABLE "public"."concept_labels" TO "authenticated";
GRANT ALL ON TABLE "public"."concept_labels" TO "service_role";



GRANT ALL ON TABLE "public"."concept_space_membership" TO "anon";
GRANT ALL ON TABLE "public"."concept_space_membership" TO "authenticated";
GRANT ALL ON TABLE "public"."concept_space_membership" TO "service_role";



GRANT ALL ON TABLE "public"."concept_space_objects" TO "anon";
GRANT ALL ON TABLE "public"."concept_space_objects" TO "authenticated";
GRANT ALL ON TABLE "public"."concept_space_objects" TO "service_role";



GRANT ALL ON TABLE "public"."concepts" TO "anon";
GRANT ALL ON TABLE "public"."concepts" TO "authenticated";
GRANT ALL ON TABLE "public"."concepts" TO "service_role";



GRANT ALL ON TABLE "public"."conceptual_space_objects" TO "anon";
GRANT ALL ON TABLE "public"."conceptual_space_objects" TO "authenticated";
GRANT ALL ON TABLE "public"."conceptual_space_objects" TO "service_role";



GRANT ALL ON TABLE "public"."conceptual_spaces" TO "anon";
GRANT ALL ON TABLE "public"."conceptual_spaces" TO "authenticated";
GRANT ALL ON TABLE "public"."conceptual_spaces" TO "service_role";



GRANT ALL ON TABLE "public"."quality_dimensions" TO "anon";
GRANT ALL ON TABLE "public"."quality_dimensions" TO "authenticated";
GRANT ALL ON TABLE "public"."quality_dimensions" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";







