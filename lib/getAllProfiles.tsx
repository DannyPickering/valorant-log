import { createClient } from '@/lib/supabase-client';

export default async function getAllProfiles() {
  try {
    const supabase = createClient();
    const { data, error }: { data: any, error: any } = await supabase
      .from('profiles')
      .select('*');

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
