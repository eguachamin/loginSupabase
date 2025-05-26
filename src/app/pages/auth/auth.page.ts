import { routes } from './../../app.routes';
import { supabase } from './../../supabase.client';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AuthPage {
  email='';
  password='';
  error='';

  constructor(private router: Router) { }

  async login(){
    const {error}=await supabase.auth.signInWithPassword({
      email: this.email,
      password: this.password
    });
    if (error)  {
      this.error=error.message
    }else{
      this.router.navigate(['/home'])
    }
  }
  
  async register(){
    const {error}=await supabase.auth.signUp({
      email: this.email,
      password: this.password
    });
    if (error) {
      this.error=error.message
    }else{
      alert('Registro correcto, verifica tu correo');
    }
  }
  
  
}
