import { createClient } from '@/lib/supabase-client';
import { ValorantAccount } from '@/types/collections';

export async function getAllProfiles() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('profiles').select('*');

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function getAllAccountsByUser(userId: string): Promise<ValorantAccount[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('valorant_accounts')
      .select('*')
      .eq('profile_id', userId);

    if (error) {
      throw new Error(error.message);
    }

    return data

  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function getAllMaps() {
  try {
    const supabase = createClient();
    let { data, error } = await supabase
      .from('valorant_maps')
      .select('*');

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function updateMapById(id: number, is_active: boolean) {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('valorant_maps')
      .update({ is_active: is_active })
      .eq('id', id)

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function getAllAgents() {
  try {
    const supabase = createClient();
    let { data, error } = await supabase
      .from('valorant_agents')
      .select('*');

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function getCurrentSeason() {
  try {
    const supabase = createClient();
    let { data, error } = await supabase
      .from('valorant_seasons')
      .select('*')
      .eq('is_current', true)
      .limit(1);

    if (error) {
      throw new Error(error.message);
    }

    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
