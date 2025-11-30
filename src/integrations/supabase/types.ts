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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          activity_level: string | null
          age: number | null
          allergies: string[] | null
          created_at: string | null
          daily_calorie_goal: number | null
          dietary_preferences: string[] | null
          full_name: string
          gender: string | null
          health_conditions: string[] | null
          height: number | null
          id: string
          status: string | null
          target_weight: number | null
          telegram_id: string
          updated_at: string | null
          weight: number | null
        }
        Insert: {
          activity_level?: string | null
          age?: number | null
          allergies?: string[] | null
          created_at?: string | null
          daily_calorie_goal?: number | null
          dietary_preferences?: string[] | null
          full_name: string
          gender?: string | null
          health_conditions?: string[] | null
          height?: number | null
          id?: string
          status?: string | null
          target_weight?: number | null
          telegram_id: string
          updated_at?: string | null
          weight?: number | null
        }
        Update: {
          activity_level?: string | null
          age?: number | null
          allergies?: string[] | null
          created_at?: string | null
          daily_calorie_goal?: number | null
          dietary_preferences?: string[] | null
          full_name?: string
          gender?: string | null
          health_conditions?: string[] | null
          height?: number | null
          id?: string
          status?: string | null
          target_weight?: number | null
          telegram_id?: string
          updated_at?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          client_id: string
          created_at: string | null
          id: string
          last_message_at: string | null
          platform: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          platform?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          platform?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          category: string
          client_id: string
          created_at: string | null
          feedback_text: string
          id: string
          rating: number | null
          suggestions: string | null
        }
        Insert: {
          category: string
          client_id: string
          created_at?: string | null
          feedback_text: string
          id?: string
          rating?: number | null
          suggestions?: string | null
        }
        Update: {
          category?: string
          client_id?: string
          created_at?: string | null
          feedback_text?: string
          id?: string
          rating?: number | null
          suggestions?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_plans: {
        Row: {
          client_id: string
          created_at: string | null
          date: string
          foods: Json
          id: string
          meal_type: string
          notes: string | null
          status: string | null
          total_calories: number | null
          total_carbs: number | null
          total_fats: number | null
          total_protein: number | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          date: string
          foods: Json
          id?: string
          meal_type: string
          notes?: string | null
          status?: string | null
          total_calories?: number | null
          total_carbs?: number | null
          total_fats?: number | null
          total_protein?: number | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          date?: string
          foods?: Json
          id?: string
          meal_type?: string
          notes?: string | null
          status?: string | null
          total_calories?: number | null
          total_carbs?: number | null
          total_fats?: number | null
          total_protein?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "meal_plans_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string | null
          conversation_id: string
          created_at: string | null
          id: string
          message_type: string
          metadata: Json | null
          sender_type: string
        }
        Insert: {
          content?: string | null
          conversation_id: string
          created_at?: string | null
          id?: string
          message_type: string
          metadata?: Json | null
          sender_type: string
        }
        Update: {
          content?: string | null
          conversation_id?: string
          created_at?: string | null
          id?: string
          message_type?: string
          metadata?: Json | null
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      progress_logs: {
        Row: {
          body_measurements: Json | null
          client_id: string
          created_at: string | null
          energy_level: number | null
          id: string
          log_date: string
          mood: string | null
          notes: string | null
          photos: string[] | null
          weight: number | null
        }
        Insert: {
          body_measurements?: Json | null
          client_id: string
          created_at?: string | null
          energy_level?: number | null
          id?: string
          log_date: string
          mood?: string | null
          notes?: string | null
          photos?: string[] | null
          weight?: number | null
        }
        Update: {
          body_measurements?: Json | null
          client_id?: string
          created_at?: string | null
          energy_level?: number | null
          id?: string
          log_date?: string
          mood?: string | null
          notes?: string | null
          photos?: string[] | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "progress_logs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          client_id: string
          created_at: string | null
          description: string
          id: string
          priority: string | null
          resolution: string | null
          resolved_at: string | null
          status: string | null
          subject: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          client_id: string
          created_at?: string | null
          description: string
          id?: string
          priority?: string | null
          resolution?: string | null
          resolved_at?: string | null
          status?: string | null
          subject: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          client_id?: string
          created_at?: string | null
          description?: string
          id?: string
          priority?: string | null
          resolution?: string | null
          resolved_at?: string | null
          status?: string | null
          subject?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_plans: {
        Row: {
          calories_burned: number | null
          client_id: string
          created_at: string | null
          date: string
          duration_minutes: number | null
          exercises: Json
          id: string
          notes: string | null
          status: string | null
          workout_type: string
        }
        Insert: {
          calories_burned?: number | null
          client_id: string
          created_at?: string | null
          date: string
          duration_minutes?: number | null
          exercises: Json
          id?: string
          notes?: string | null
          status?: string | null
          workout_type: string
        }
        Update: {
          calories_burned?: number | null
          client_id?: string
          created_at?: string | null
          date?: string
          duration_minutes?: number | null
          exercises?: Json
          id?: string
          notes?: string | null
          status?: string | null
          workout_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_plans_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
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
