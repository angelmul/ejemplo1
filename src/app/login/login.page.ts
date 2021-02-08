import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseAuthService } from 'src/providers/auth-service/firebase-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    public authService: FirebaseAuthService,
    public router: Router
  ) {}

  ngOnInit() {}

  logIn(email, password) {
    this.authService.loginUser(email.value, password.value)
    .then( (data)=>{

      console.log("login correcto");
      
      this.goToHome();
      
      })
      
      .catch( (error)=>{
      
        console.log("Error en el login: "+error['message']);
      
      });
  }
  
  goToRegister(){
    this.router.navigate(['register']);          
  }

  goToHome(){
    this.router.navigate(['home']);          
  }

}
