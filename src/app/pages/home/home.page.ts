import { supabase } from './../../supabase.client';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HomePage implements OnInit {
  email='';
  constructor(private router:Router) { }

  async ngOnInit() {
    const {data,error}= await supabase.auth.getUser();
    if (error || !data.user)  {
      this.router.navigate(['/auth'])
    }else{
      this.email=data.user.email || '';
    }
  }

  async logout(){
    await supabase.auth.signOut();
    this.router.navigate(['/auth'])
  }
  async irAlChat(){
    this.router.navigate(['/chat'])
  }

}
