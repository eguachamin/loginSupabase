import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client'; // Usa tu archivo existente

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  constructor() {}

  async getCurrentUser() {
    const user = await supabase.auth.getUser();
    return user.data.user;
  }

  async sendMessage(content: string, username: string) {
    const user = await this.getCurrentUser();
    const { error } = await supabase.from('messages').insert([
      {
        content,
        user_id: user?.id,
        username,
      },
    ]);
    return error;
  }

  async getMessages() {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('inserted_at', { ascending: true });
    return { data, error };
  }

  listenToMessages(callback: (msg: any) => void) {
    return supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      }, payload => callback(payload.new))
      .subscribe();
  }
}
