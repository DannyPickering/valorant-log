import { Database } from "./supabase";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Games = Database["public"]["Tables"]["games"]["Row"];
export type ValorantAccountGames = Database["public"]["Tables"]["valorant_account_games"]["Row"];
export type ValorantAccount = Database["public"]["Tables"]["valorant_accounts"]["Row"];
export type ValorantAgent = Database["public"]["Tables"]["valorant_agents"]["Row"];
export type ValorantMap = Database["public"]["Tables"]["valorant_maps"]["Row"];
export type ValorantQueue = Database["public"]["Tables"]["valorant_queues"]["Row"];
export type ValorantSeason = Database["public"]["Tables"]["valorant_seasons"]["Row"];