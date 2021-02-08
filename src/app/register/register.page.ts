import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseAuthService } from 'src/providers/auth-service/firebase-auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(
    public authService: FirebaseAuthService,
    public router: Router
  ) {}

  ngOnInit() {}

  register(email, password) {
    this.authService.registerUser(email.value, password.value)
    .then( (data)=>{

      console.log("Register correcto");
      
      this.goToLogin();
      
      })
      
      .catch( (error)=>{
      
        console.log("Error en el login: "+error['message']);
      
      });
  }
  
  goToLogin(){
    this.router.navigate(['login']);          
  }

}
