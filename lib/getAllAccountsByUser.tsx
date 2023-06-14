import { createClient } from '@/lib/supabase-client';

export default async function getAllAccountsByUser(userId: string): Promise<string[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('accounts')
      .eq('id', userId);

    if (error) {
      throw new Error(error.message);
    }

    // Extract the 'accounts' property from the returned data and handle null values
    const accounts = data
      .map((profile: { accounts: string[] | null }) => profile.accounts ?? [])
      .flat();

    return accounts;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
