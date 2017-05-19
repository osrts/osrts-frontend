import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../services/feathers.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public user = {};
  public error= {};
  constructor(private router: Router, private socketService: SocketService) { }

  signIn() {
    this.socketService.authenticate(this.user).then(response => {
      this.postSignIn();
    })
    .catch((error)=>{
      this.error['title'] = "Connexion refusée";
      this.error['message'] = "Nom de compte ou mot de passe incorrect.";
    });
  }

  private postSignIn(): void {
    this.router.navigate(['/admin']);
  }
}
