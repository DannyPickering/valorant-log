import { createClient } from '@/lib/supabase-client';
import { PostgrestError } from '@supabase/supabase-js';

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

export async function getAllAccountsByUser(userId: string): Promise<string[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('valorant_accounts')
      .select('name')
      .eq('profile_id', userId);

    if (error) {
      throw new Error(error.message);
    }

    const accountsArray = data.map(obj => obj.name || '')
    return accountsArray

  } catch (error) {
    throw new Error((error as Error).message);
  }
}
