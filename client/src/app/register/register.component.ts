import { Component } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms'
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

export interface RegisterResponse {
  success: boolean;
  message: string;
}
export interface User {
  id: string | null | undefined;
  name: string | null | undefined;
  password: string | null | undefined;
  email: string | null | undefined;
  gender: string | null | undefined;
  isActive: boolean | null | undefined;
}


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {

  loading_flag = false;

  constructor(private builder:FormBuilder, private toastr:ToastrService,
    private service:AuthService, private router:Router){
  }

  registerForm = this.builder.group({
    
    id:this.builder.control('', Validators.compose([
      Validators.required,
      Validators.minLength(5)
    ])),

    name:this.builder.control('',Validators.required),
    
    password:this.builder.control('',Validators.compose([
      Validators.required,
      Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
    ])),
    
    email:this.builder.control('',Validators.compose([
      Validators.required,
      Validators.email
    ])),

    gender:this.builder.control('male'),

    isActive:this.builder.control(false)
  });

  proceedRegistration() {
    if (this.registerForm.valid) {
      
      this.loading_flag = true

      const user: User = {
        id: this.registerForm.value.id,
        name: this.registerForm.value.name,
        password: this.registerForm.value.password,
        email: this.registerForm.value.email,
        gender: '-',
        isActive: this.registerForm.value.isActive
      };
  
      this.service.RegisterUser(user).subscribe(
        (result) => {
          result = result as RegisterResponse;
          const success = result.success;
          const message = result.message;
          if (success) {
            setTimeout(() => {
              this.toastr.success(message);
              this.router.navigate(['login']);
              this.loading_flag = false;
            }, 2500);
            
          } else {
            this.loading_flag = false;
            this.toastr.warning(message);
          }
        },
        (error) => {
          this.loading_flag = false;
          console.error(error);
          this.toastr.warning("Server Not Reachable!!");
        }

      );
      

    } else {
      this.toastr.warning('Please Enter Valid data !!')
    }
  }
  

}
