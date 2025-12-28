export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      concept_labels: {
        Row: {
          concept_id: string
          created_at: string
          id: string
          label_text: string
          language_code: string
        }
        Insert: {
          concept_id: string
          created_at?: string
          id?: string
          label_text: string
          language_code: string
        }
        Update: {
          concept_id?: string
          created_at?: string
          id?: string
          label_text?: string
          language_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "concept_labels_concept_id_fkey"
            columns: ["concept_id"]
            isOneToOne: false
            referencedRelation: "concepts"
            referencedColumns: ["id"]
          },
        ]
      }
      concept_space_membership: {
        Row: {
          concept_id: string
          conceptual_space_id: string
          created_at: string
          id: string
        }
        Insert: {
          concept_id: string
          conceptual_space_id: string
          created_at?: string
          id?: string
        }
        Update: {
          concept_id?: string
          conceptual_space_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "concept_space_membership_concept_id_fkey"
            columns: ["concept_id"]
            isOneToOne: false
            referencedRelation: "concepts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concept_space_membership_conceptual_space_id_fkey"
            columns: ["conceptual_space_id"]
            isOneToOne: false
            referencedRelation: "conceptual_spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      concept_space_objects: {
        Row: {
          concept_id: string
          conceptual_space_object_id: string
          created_at: string
          id: string
        }
        Insert: {
          concept_id: string
          conceptual_space_object_id: string
          created_at?: string
          id?: string
        }
        Update: {
          concept_id?: string
          conceptual_space_object_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "concept_space_objects_concept_id_fkey"
            columns: ["concept_id"]
            isOneToOne: false
            referencedRelation: "concepts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concept_space_objects_conceptual_space_object_id_fkey"
            columns: ["conceptual_space_object_id"]
            isOneToOne: false
            referencedRelation: "conceptual_space_objects"
            referencedColumns: ["id"]
          },
        ]
      }
      concepts: {
        Row: {
          created_at: string
          id: string
        }
        Insert: {
          created_at?: string
          id?: string
        }
        Update: {
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      conceptual_space_objects: {
        Row: {
          conceptual_space_id: string
          created_at: string
          id: string
          value: Json
        }
        Insert: {
          conceptual_space_id: string
          created_at?: string
          id?: string
          value?: Json
        }
        Update: {
          conceptual_space_id?: string
          created_at?: string
          id?: string
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "conceptual_space_objects_conceptual_space_id_fkey"
            columns: ["conceptual_space_id"]
            isOneToOne: false
            referencedRelation: "conceptual_spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      conceptual_spaces: {
        Row: {
          created_at: string
          id: string
          name: string
          schema_version: number
          value_json_schema: Json
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          schema_version?: number
          value_json_schema?: Json
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          schema_version?: number
          value_json_schema?: Json
        }
        Relationships: []
      }
      quality_dimensions: {
        Row: {
          conceptual_space_id: string
          created_at: string
          id: string
          json_schema: Json
          name: string
        }
        Insert: {
          conceptual_space_id: string
          created_at?: string
          id?: string
          json_schema?: Json
          name: string
        }
        Update: {
          conceptual_space_id?: string
          created_at?: string
          id?: string
          json_schema?: Json
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "quality_dimensions_conceptual_space_id_fkey"
            columns: ["conceptual_space_id"]
            isOneToOne: false
            referencedRelation: "conceptual_spaces"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
