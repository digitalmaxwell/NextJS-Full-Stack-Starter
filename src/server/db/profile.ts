import type { SupabaseClient, User } from '@supabase/supabase-js';

export class ProfileOperations {
  constructor(
    private supabase: SupabaseClient,
    private user: User
  ) {}

  async get() {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', this.user.id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(data: { name?: string; timezone?: string }) {
    const { data: profile, error } = await this.supabase
      .from('profiles')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', this.user.id)
      .select()
      .single();

    if (error) throw error;
    return profile;
  }
}

