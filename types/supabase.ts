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
          avatar_url: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
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
