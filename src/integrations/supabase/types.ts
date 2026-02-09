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
      admin_gifts: {
        Row: {
          id: string
          recipient_nickname: string
          item_name: string
          rarity: string
          given_by: string
          created_at: string
        }
        Insert: {
          id?: string
          recipient_nickname: string
          item_name: string
          rarity: string
          given_by: string
          created_at?: string
        }
        Update: {
          id?: string
          recipient_nickname?: string
          item_name?: string
          rarity?: string
          given_by?: string
          created_at?: string
        }
        Relationships: []
      }
      game_players: {
        Row: {
          created_at: string
          current_item: string | null
          current_rarity: string | null
          id: string
          is_host: boolean
          nickname: string
          room_id: string
        }
        Insert: {
          created_at?: string
          current_item?: string | null
          current_rarity?: string | null
          id?: string
          is_host?: boolean
          nickname: string
          room_id: string
        }
        Update: {
          created_at?: string
          current_item?: string | null
          current_rarity?: string | null
          id?: string
          is_host?: boolean
          nickname?: string
          room_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_players_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "game_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      game_rooms: {
        Row: {
          created_at: string
          ends_at: string | null
          game_mode: string
          host_nickname: string
          id: string
          pin_code: string
          started_at: string | null
          status: string
          target_rarity: string
          time_limit_minutes: number
          winner_nickname: string | null
          winning_item: string | null
        }
        Insert: {
          created_at?: string
          ends_at?: string | null
          game_mode?: string
          host_nickname: string
          id?: string
          pin_code: string
          started_at?: string | null
          status?: string
          target_rarity: string
          time_limit_minutes: number
          winner_nickname?: string | null
          winning_item?: string | null
        }
        Update: {
          created_at?: string
          ends_at?: string | null
          game_mode?: string
          host_nickname?: string
          id?: string
          pin_code?: string
          started_at?: string | null
          status?: string
          target_rarity?: string
          time_limit_minutes?: number
          winner_nickname?: string | null
          winning_item?: string | null
        }
        Relationships: []
      }
      player_profiles: {
        Row: {
          created_at: string
          id: string
          nickname: string
          successful_trades: number
          unique_count: number
          updated_at: string
          user_number: number | null
          wins: number
        }
        Insert: {
          created_at?: string
          id?: string
          nickname: string
          successful_trades?: number
          unique_count?: number
          updated_at?: string
          user_number?: number | null
          wins?: number
        }
        Update: {
          created_at?: string
          id?: string
          nickname?: string
          successful_trades?: number
          unique_count?: number
          updated_at?: string
          user_number?: number | null
          wins?: number
        }
        Relationships: []
      }
      site_announcements: {
        Row: {
          id: string
          message: string
          set_by: string
          updated_at: string
        }
        Insert: {
          id?: string
          message: string
          set_by: string
          updated_at?: string
        }
        Update: {
          id?: string
          message?: string
          set_by?: string
          updated_at?: string
        }
        Relationships: []
      }
      friendships: {
        Row: {
          id: string
          requester_nickname: string
          target_nickname: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          requester_nickname: string
          target_nickname: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          requester_nickname?: string
          target_nickname?: string
          status?: string
          created_at?: string
        }
        Relationships: []
      }
      banned_users: {
        Row: {
          id: string
          nickname: string
          banned_by: string
          created_at: string
        }
        Insert: {
          id?: string
          nickname: string
          banned_by: string
          created_at?: string
        }
        Update: {
          id?: string
          nickname?: string
          banned_by?: string
          created_at?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          id: string
          sender_nickname: string
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          sender_nickname: string
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          sender_nickname?: string
          message?: string
          created_at?: string
        }
        Relationships: []
      }
      spawned_packs: {
        Row: {
          id: string
          pack_key: string
          pack_name: string
          spawned_by: string
          created_at: string
        }
        Insert: {
          id?: string
          pack_key: string
          pack_name: string
          spawned_by: string
          created_at?: string
        }
        Update: {
          id?: string
          pack_key?: string
          pack_name?: string
          spawned_by?: string
          created_at?: string
        }
        Relationships: []
      }
      shop_listings: {
        Row: {
          id: string
          seller_nickname: string
          item_name: string
          item_rarity: string
          created_at: string
        }
        Insert: {
          id?: string
          seller_nickname: string
          item_name: string
          item_rarity: string
          created_at?: string
        }
        Update: {
          id?: string
          seller_nickname?: string
          item_name?: string
          item_rarity?: string
          created_at?: string
        }
        Relationships: []
      }
      trade_offers: {
        Row: {
          created_at: string
          id: string
          item_name: string
          item_rarity: string
          nickname: string
          quantity: number
          session_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_name: string
          item_rarity: string
          nickname: string
          quantity?: number
          session_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_name?: string
          item_rarity?: string
          nickname?: string
          quantity?: number
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_offers_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "trade_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      trade_sessions: {
        Row: {
          created_at: string
          id: string
          requester_accepted: boolean
          requester_nickname: string
          status: string
          target_accepted: boolean
          target_nickname: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          requester_accepted?: boolean
          requester_nickname: string
          status?: string
          target_accepted?: boolean
          target_nickname: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          requester_accepted?: boolean
          requester_nickname?: string
          status?: string
          target_accepted?: boolean
          target_nickname?: string
          updated_at?: string
        }
        Relationships: []
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
