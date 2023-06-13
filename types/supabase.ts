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
      GamesData: {
        Row: {
          act: number | null
          agent: string | null
          combat_score: number | null
          created_at: string | null
          episode: number | null
          first_bloods: number | null
          game_id: number | null
          id: number
          map: string | null
          match_mvp: boolean | null
          queue: string | null
          team_mvp: boolean | null
          username: string | null
          won_game: boolean | null
        }
        Insert: {
          act?: number | null
          agent?: string | null
          combat_score?: number | null
          created_at?: string | null
          episode?: number | null
          first_bloods?: number | null
          game_id?: number | null
          id?: number
          map?: string | null
          match_mvp?: boolean | null
          queue?: string | null
          team_mvp?: boolean | null
          username?: string | null
          won_game?: boolean | null
        }
        Update: {
          act?: number | null
          agent?: string | null
          combat_score?: number | null
          created_at?: string | null
          episode?: number | null
          first_bloods?: number | null
          game_id?: number | null
          id?: number
          map?: string | null
          match_mvp?: boolean | null
          queue?: string | null
          team_mvp?: boolean | null
          username?: string | null
          won_game?: boolean | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          accounts: string[] | null
          avatar_url: string | null
          discord_id: string | null
          id: string
          is_admin: boolean | null
          updated_at: string | null
        }
        Insert: {
          accounts?: string[] | null
          avatar_url?: string | null
          discord_id?: string | null
          id: string
          is_admin?: boolean | null
          updated_at?: string | null
        }
        Update: {
          accounts?: string[] | null
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
