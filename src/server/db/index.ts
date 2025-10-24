import type { SupabaseClient, User } from '@supabase/supabase-js';
import { ProfileOperations } from './profile';
import { NoteOperations } from './note';

/**
 * Main Database class that aggregates all domain-specific operations
 */
export class Database {
  private profile: ProfileOperations;
  private note: NoteOperations;

  constructor(
    private supabase: SupabaseClient,
    private user: User
  ) {
    this.profile = new ProfileOperations(supabase, user);
    this.note = new NoteOperations(supabase, user);
  }

  // Profile operations
  async profileGet() {
    return this.profile.get();
  }

  async profileUpdate(data: { name?: string; timezone?: string }) {
    return this.profile.update(data);
  }

  // Note operations
  async noteList() {
    return this.note.list();
  }

  async noteGet(id: string) {
    return this.note.get(id);
  }

  async noteCreate(data: { title: string; content?: string }) {
    return this.note.create(data);
  }

  async noteUpdate(id: string, data: { title?: string; content?: string }) {
    return this.note.update(id, data);
  }

  async noteDelete(id: string) {
    return this.note.delete(id);
  }
}

