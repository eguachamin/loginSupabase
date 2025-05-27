import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { supabase } from './../../supabase.client';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ChatPage implements OnInit, OnDestroy {
  messageText = '';
  messages: any[] = [];
  username = '';
  subscription: any;

  constructor(private router: Router) {}

  async ngOnInit() {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    this.username = user?.email || 'Anónimo';

    const { data , error} = await supabase
      .from('messages')
      .select('id, content, username, inserted_at')
      .order('inserted_at', { ascending: true });
    if (error) {
      console.error('Error cargando mensajes:', error.message);
    } else {
      this.messages = data || [];
    }

    this.subscription = supabase
      .channel('chat-room')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, (payload) => {
        const newMsg = payload.new;

        // Confirmar que tiene username
        if (!newMsg['username']) {
          newMsg['username'] = 'Anónimo';
        }

        this.messages.push(newMsg);
        this.messages = [...this.messages]; // Forzar redibujo en Angular
        console.log('Nuevo mensaje recibido:', newMsg);
      }
    );

  await this.subscription.subscribe();
  }

  async sendMessage() {
    if (this.messageText.trim() === '') return;

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    const { error } = await supabase.from('messages').insert([
      {
        content: this.messageText,
        user_id: user?.id,
        username: this.username
      }
    ]);

    if (!error) {
      this.messageText = '';
    } else {
      console.error(error.message);
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      supabase.removeChannel(this.subscription);
    }
  }

  logout() {
    supabase.auth.signOut();
    this.router.navigate(['/auth']);
  }
}
