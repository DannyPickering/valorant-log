export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      games: {
        Row: {
          created_at: string | null
          id: number
          match_mvp_id: number | null
          team_mvp_id: number | null
          valorant_map_id: number | null
          valorant_queue_id: number | null
          valorant_season_id: number | null
          won_game: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          match_mvp_id?: number | null
          team_mvp_id?: number | null
          valorant_map_id?: number | null
          valorant_queue_id?: number | null
          valorant_season_id?: number | null
          won_game?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: number
          match_mvp_id?: number | null
          team_mvp_id?: number | null
          valorant_map_id?: number | null
          valorant_queue_id?: number | null
          valorant_season_id?: number | null
          won_game?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "games_match_mvp_id_fkey"
            columns: ["match_mvp_id"]
            referencedRelation: "valorant_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_team_mvp_id_fkey"
            columns: ["team_mvp_id"]
            referencedRelation: "valorant_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_valorant_map_id_fkey"
            columns: ["valorant_map_id"]
            referencedRelation: "valorant_maps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_valorant_queue_id_fkey"
            columns: ["valorant_queue_id"]
            referencedRelation: "valorant_queues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_valorant_season_id_fkey"
            columns: ["valorant_season_id"]
            referencedRelation: "valorant_seasons"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          discord_id: string | null
          id: string
          is_admin: boolean | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          discord_id?: string | null
          id: string
          is_admin?: boolean | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          discord_id?: string | null
          id?: string
          is_admin?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      valorant_account_games: {
        Row: {
          combat_score: number | null
          created_at: string | null
          first_blood_count: number | null
          game_id: number | null
          id: number
          valorant_account_id: number | null
          valorant_agent_id: number | null
        }
        Insert: {
          combat_score?: number | null
          created_at?: string | null
          first_blood_count?: number | null
          game_id?: number | null
          id?: number
          valorant_account_id?: number | null
          valorant_agent_id?: number | null
        }
        Update: {
          combat_score?: number | null
          created_at?: string | null
          first_blood_count?: number | null
          game_id?: number | null
          id?: number
          valorant_account_id?: number | null
          valorant_agent_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "valorant_account_games_game_id_fkey"
            columns: ["game_id"]
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "valorant_account_games_valorant_account_id_fkey"
            columns: ["valorant_account_id"]
            referencedRelation: "valorant_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "valorant_account_games_valorant_agent_id_fkey"
            columns: ["valorant_agent_id"]
            referencedRelation: "valorant_agents"
            referencedColumns: ["id"]
          }
        ]
      }
      valorant_accounts: {
        Row: {
          created_at: string | null
          id: number
          name: string | null
          profile_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name?: string | null
          profile_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string | null
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "valorant_accounts_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      valorant_agents: {
        Row: {
          created_at: string | null
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      valorant_maps: {
        Row: {
          created_at: string | null
          id: number
          is_active: boolean | null
          name: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          name?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          name?: string | null
        }
        Relationships: []
      }
      valorant_queues: {
        Row: {
          created_at: string | null
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      valorant_seasons: {
        Row: {
          act: number | null
          created_at: string | null
          episode: number | null
          id: number
          is_current: boolean | null
        }
        Insert: {
          act?: number | null
          created_at?: string | null
          episode?: number | null
          id?: number
          is_current?: boolean | null
        }
        Update: {
          act?: number | null
          created_at?: string | null
          episode?: number | null
          id?: number
          is_current?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_avatar: {
        Args: {
          avatar_url: string
        }
        Returns: Record<string, unknown>
      }
      delete_storage_object: {
        Args: {
          bucket: string
          object: string
        }
        Returns: Record<string, unknown>
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
