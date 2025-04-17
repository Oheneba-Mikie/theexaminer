export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      accounts: {
        Row: {
          account_type: string
          balance: number
          color: string | null
          created_at: string
          id: string
          title: string
          user_id: string
        }
        Insert: {
          account_type?: string
          balance?: number
          color?: string | null
          created_at?: string
          id?: string
          title: string
          user_id: string
        }
        Update: {
          account_type?: string
          balance?: number
          color?: string | null
          created_at?: string
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      alert_mappings: {
        Row: {
          alert_definition: string
          category_id: string | null
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          alert_definition: string
          category_id?: string | null
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          alert_definition?: string
          category_id?: string | null
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "alert_mappings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      alert_rules: {
        Row: {
          category_id: string | null
          condition_type: string
          condition_value: string
          created_at: string
          field_name: string
          id: string
          is_active: boolean | null
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          condition_type: string
          condition_value: string
          created_at?: string
          field_name: string
          id?: string
          is_active?: boolean | null
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          condition_type?: string
          condition_value?: string
          created_at?: string
          field_name?: string
          id?: string
          is_active?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "alert_rules_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      alerts: {
        Row: {
          category_id: string | null
          created_at: string
          details: Json | null
          id: string
          received_at: string | null
          severity: string
          source_ip: string | null
          status: string | null
          title: string
          webhook_payload: Json | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          received_at?: string | null
          severity: string
          source_ip?: string | null
          status?: string | null
          title: string
          webhook_payload?: Json | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          received_at?: string | null
          severity?: string
          source_ip?: string | null
          status?: string | null
          title?: string
          webhook_payload?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "alerts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          api_key: string
          created_at: string
          id: string
          key_type: string
          name: string
          provider: string
          secret_key: string
          updated_at: string
          user_id: string
        }
        Insert: {
          api_key: string
          created_at?: string
          id?: string
          key_type?: string
          name?: string
          provider: string
          secret_key: string
          updated_at?: string
          user_id: string
        }
        Update: {
          api_key?: string
          created_at?: string
          id?: string
          key_type?: string
          name?: string
          provider?: string
          secret_key?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      asset_balances: {
        Row: {
          asset: string
          created_at: string | null
          free_balance: number
          id: string
          last_updated: string | null
          locked_balance: number
          user_id: string
        }
        Insert: {
          asset: string
          created_at?: string | null
          free_balance?: number
          id?: string
          last_updated?: string | null
          locked_balance?: number
          user_id: string
        }
        Update: {
          asset?: string
          created_at?: string | null
          free_balance?: number
          id?: string
          last_updated?: string | null
          locked_balance?: number
          user_id?: string
        }
        Relationships: []
      }
      bot_activity_logs: {
        Row: {
          activity_type: string
          created_at: string | null
          id: string
          message: string
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          id?: string
          message: string
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          id?: string
          message?: string
          user_id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      exams: {
        Row: {
          created_at: string
          id: string
          status: string
          submissions: number | null
          title: string
          url: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          status: string
          submissions?: number | null
          title: string
          url?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          status?: string
          submissions?: number | null
          title?: string
          url?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      game_players: {
        Row: {
          created_at: string | null
          id: string
          name: string
          phone_number: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          phone_number: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          phone_number?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      integration_api_keys: {
        Row: {
          api_key: string
          api_secret: string | null
          created_at: string
          id: string
          integration_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          api_key: string
          api_secret?: string | null
          created_at?: string
          id?: string
          integration_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          api_key?: string
          api_secret?: string | null
          created_at?: string
          id?: string
          integration_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      integration_settings: {
        Row: {
          created_at: string
          id: string
          shopify_enabled: boolean | null
          shopify_shop_url: string | null
          updated_at: string
          user_id: string
          woocommerce_consumer_key: string | null
          woocommerce_consumer_secret: string | null
          woocommerce_enabled: boolean | null
          woocommerce_url: string | null
          wordpress_enabled: boolean | null
          wordpress_url: string | null
          wordpress_username: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          shopify_enabled?: boolean | null
          shopify_shop_url?: string | null
          updated_at?: string
          user_id: string
          woocommerce_consumer_key?: string | null
          woocommerce_consumer_secret?: string | null
          woocommerce_enabled?: boolean | null
          woocommerce_url?: string | null
          wordpress_enabled?: boolean | null
          wordpress_url?: string | null
          wordpress_username?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          shopify_enabled?: boolean | null
          shopify_shop_url?: string | null
          updated_at?: string
          user_id?: string
          woocommerce_consumer_key?: string | null
          woocommerce_consumer_secret?: string | null
          woocommerce_enabled?: boolean | null
          woocommerce_url?: string | null
          wordpress_enabled?: boolean | null
          wordpress_url?: string | null
          wordpress_username?: string | null
        }
        Relationships: []
      }
      message_recipients: {
        Row: {
          created_at: string
          id: string
          message_id: string | null
          recipient_name: string
          recipient_phone: string
          sent_at: string | null
          status: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message_id?: string | null
          recipient_name: string
          recipient_phone: string
          sent_at?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message_id?: string | null
          recipient_name?: string
          recipient_phone?: string
          sent_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_recipients_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          sender_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          sender_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          sender_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      money_tracker_transactions: {
        Row: {
          amount: number
          created_at: string
          date: string
          description: string
          id: number
          type: string
        }
        Insert: {
          amount: number
          created_at?: string
          date: string
          description: string
          id?: number
          type: string
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          description?: string
          id?: number
          type?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          industry: string | null
          last_name: string | null
          onboarding_completed: boolean | null
          organization_name: string | null
          updated_at: string
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          industry?: string | null
          last_name?: string | null
          onboarding_completed?: boolean | null
          organization_name?: string | null
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          industry?: string | null
          last_name?: string | null
          onboarding_completed?: boolean | null
          organization_name?: string | null
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      qr_codes: {
        Row: {
          created_at: string | null
          id: string
          last_scanned_at: string | null
          name: string | null
          scan_count: number | null
          short_url: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_scanned_at?: string | null
          name?: string | null
          scan_count?: number | null
          short_url?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_scanned_at?: string | null
          name?: string | null
          scan_count?: number | null
          short_url?: string | null
          url?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          correct_option_id: string
          exam_id: string | null
          id: string
          options: Json
          text: string
        }
        Insert: {
          correct_option_id: string
          exam_id?: string | null
          id?: string
          options: Json
          text: string
        }
        Update: {
          correct_option_id?: string
          exam_id?: string | null
          id?: string
          options?: Json
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      recipients: {
        Row: {
          category_id: string | null
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          phone_number: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          phone_number: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          phone_number?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipients_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      sms_templates: {
        Row: {
          category_id: string | null
          created_at: string
          id: string
          name: string
          template_text: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          id?: string
          name: string
          template_text: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          id?: string
          name?: string
          template_text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sms_templates_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          answers: Json
          exam_id: string | null
          exam_title: string
          id: string
          score: number | null
          student_id: string
          student_name: string
          submitted_at: string
          total_questions: number
        }
        Insert: {
          answers: Json
          exam_id?: string | null
          exam_title: string
          id?: string
          score?: number | null
          student_id: string
          student_name: string
          submitted_at?: string
          total_questions: number
        }
        Update: {
          answers?: Json
          exam_id?: string | null
          exam_title?: string
          id?: string
          score?: number | null
          student_id?: string
          student_name?: string
          submitted_at?: string
          total_questions?: number
        }
        Relationships: [
          {
            foreignKeyName: "submissions_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      trade_history: {
        Row: {
          created_at: string | null
          fees: number
          id: string
          price: number
          profit: number | null
          quantity: number
          session_id: string | null
          side: string
          symbol: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          fees?: number
          id?: string
          price: number
          profit?: number | null
          quantity: number
          session_id?: string | null
          side: string
          symbol: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          fees?: number
          id?: string
          price?: number
          profit?: number | null
          quantity?: number
          session_id?: string | null
          side?: string
          symbol?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_history_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "trading_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      trading_config: {
        Row: {
          created_at: string | null
          id: string
          max_trade_amount: number | null
          min_trade_amount: number
          profit_threshold: number
          trading_pair: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          max_trade_amount?: number | null
          min_trade_amount?: number
          profit_threshold?: number
          trading_pair?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          max_trade_amount?: number | null
          min_trade_amount?: number
          profit_threshold?: number
          trading_pair?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      trading_sessions: {
        Row: {
          created_at: string | null
          end_time: string | null
          final_balance: number | null
          id: string
          initial_balance: number
          start_time: string | null
          status: string | null
          total_fees: number | null
          total_profit: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_time?: string | null
          final_balance?: number | null
          id?: string
          initial_balance: number
          start_time?: string | null
          status?: string | null
          total_fees?: number | null
          total_profit?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_time?: string | null
          final_balance?: number | null
          id?: string
          initial_balance?: number
          start_time?: string | null
          status?: string | null
          total_fees?: number | null
          total_profit?: number | null
          user_id?: string
        }
        Relationships: []
      }
      transaction_categories: {
        Row: {
          color: string | null
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          account_id: string
          amount: number
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          transaction_type: string
          transfer_account_id: string | null
          user_id: string
        }
        Insert: {
          account_id: string
          amount: number
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          transaction_type: string
          transfer_account_id?: string | null
          user_id: string
        }
        Update: {
          account_id?: string
          amount?: number
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          transaction_type?: string
          transfer_account_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_transfer_account_id_fkey"
            columns: ["transfer_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_balances: {
        Row: {
          available_for_trading: number
          binance_sync_status: boolean | null
          created_at: string | null
          environment: string
          id: string
          initial_investment: number
          locked_in_binance: boolean | null
          total_balance: number
          total_profit: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          available_for_trading?: number
          binance_sync_status?: boolean | null
          created_at?: string | null
          environment?: string
          id?: string
          initial_investment?: number
          locked_in_binance?: boolean | null
          total_balance?: number
          total_profit?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          available_for_trading?: number
          binance_sync_status?: boolean | null
          created_at?: string | null
          environment?: string
          id?: string
          initial_investment?: number
          locked_in_binance?: boolean | null
          total_balance?: number
          total_profit?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      web_automations: {
        Row: {
          created_at: string | null
          id: string
          last_executed_at: string | null
          name: string
          site_url: string
          steps: Json
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_executed_at?: string | null
          name: string
          site_url: string
          steps: Json
        }
        Update: {
          created_at?: string | null
          id?: string
          last_executed_at?: string | null
          name?: string
          site_url?: string
          steps?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      handle_qr_code_scan: {
        Args: { qr_id: string }
        Returns: undefined
      }
      increment_qr_scan_count: {
        Args: { qr_id: string }
        Returns: undefined
      }
      transfer_between_accounts: {
        Args: {
          p_from_account_id: string
          p_to_account_id: string
          p_amount: number
          p_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
