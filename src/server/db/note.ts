import type { SupabaseClient, User } from '@supabase/supabase-js';

export class NoteOperations {
  constructor(
    private supabase: SupabaseClient,
    private user: User
  ) {}

  async list() {
    const { data, error } = await this.supabase
      .from('notes')
      .select('*')
      .eq('user_id', this.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async get(id: string) {
    const { data, error } = await this.supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .eq('user_id', this.user.id)
      .single();

    if (error) throw error;
    return data;
  }

  async create(data: { title: string; content?: string }) {
    const { data: note, error } = await this.supabase
      .from('notes')
      .insert({
        user_id: this.user.id,
        title: data.title,
        content: data.content || '',
      })
      .select()
      .single();

    if (error) throw error;
    return note;
  }

  async update(id: string, data: { title?: string; content?: string }) {
    const { data: note, error } = await this.supabase
      .from('notes')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', this.user.id)
      .select()
      .single();

    if (error) throw error;
    return note;
  }

  async delete(id: string) {
    const { error } = await this.supabase
      .from('notes')
      .delete()
      .eq('id', id)
      .eq('user_id', this.user.id);

    if (error) throw error;
    return { success: true };
  }
}

