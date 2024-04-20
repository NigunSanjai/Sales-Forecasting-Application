import { Component } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms'
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { SharedService } from '../service/shared-service.service';


export interface LoginResponse {
  success: boolean;
  message: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  loading_flag = false;

  constructor(
    private builder:FormBuilder, 
    private toastr:ToastrService,
    private service:AuthService, 
    private router:Router,
    private shared:SharedService){
      sessionStorage.clear();
      sessionStorage.setItem('username','null')
      
  }


  userData:any;

  loginForm = this.builder.group({
    username:this.builder.control('', Validators.required),
    password:this.builder.control('', Validators.required),
  }
  )

  proceedLogin() {
    if (this.loginForm.valid) {
      
      this.loading_flag = true

      this.service.login(this.loginForm.value.username!, this.loginForm.value.password!)
  .subscribe(
    (result) => {
      result = result as LoginResponse;
      const success = result.success;
      const message = result.message;
      if (success) {
        sessionStorage.setItem('username',message)
        this.shared.setUserId(message);
        
        setTimeout(() => {
          this.toastr.success(`Welcome ${message}`);
          this.router.navigate(['home']);
          this.loading_flag = false;
        }, 2500);
        // 
      } else {
        // this.loading.style.display='none'
        this.loading_flag = false;
        this.toastr.warning(message);
      }
    },
    (error) => {
      console.error(error);
      this.loading_flag = false;
      this.toastr.warning("Server Not Reachable!!");
    }
  );

    } else {
      this.toastr.warning('Please Enter Valid data !!')
    }
  }


}
