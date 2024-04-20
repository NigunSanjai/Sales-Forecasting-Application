import { Component, OnInit} from '@angular/core';
import lottie from 'lottie-web';
import { DropDown } from '../home/home.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as emailjs from 'emailjs-com';
import { AuthService } from '../service/auth.service';


export interface MailResponse{
  success:boolean,
  message:string
}

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit{

  
  animation: any;

  animation_1: any;

  contactForm: FormGroup;


  attributes: DropDown[] = [
    {value:'1',
    viewValue:'Appreciation'},
    {value:'2',
    viewValue:'Query'},
    {value:'3',
    viewValue:'Complaint'},];

  constructor(
    private builder:FormBuilder, 
    private toastr:ToastrService,
    private service:AuthService){

    sessionStorage.setItem('username','null')

    this.contactForm = this.builder.group({
  
      name:this.builder.control('',Validators.required),

      email:this.builder.control('',Validators.compose([
        Validators.required,
        Validators.email
      ])),

      messageType: ['', Validators.required],

      message: ['', Validators.required]
  
    });

  }

  ngOnInit() {
    this.loadAnimation();
    this.loadAnimation_1();
    this.loadAnimation_2();

  }

  sendMessage() {
    if(this.contactForm.valid){
      var name = this.contactForm.value.name;
      var mail_id = this.contactForm.value.email;
      var type = this.contactForm.value.messageType;
      var message = this.contactForm.value.message;
      // this.toastr.success('submitted!!');
      this.service.send_mail(name,mail_id,type,message).subscribe(
        (res:MailResponse)=>{
          if(res.success){
            this.toastr.success(res.message);
          }else{
            this.toastr.success(res.message);
          }
          
        },
        (err)=>{

        }
      );
    }
    else{
      this.toastr.warning('Message Not Valid!!')
    }
    
  }

  loadAnimation() {
    this.animation = lottie.loadAnimation({
      container: document.getElementById('lottie')!,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '../../assets/lottie/hero_lottie.json',
    });
  }

  loadAnimation_1() {
    this.animation_1 = lottie.loadAnimation({
      container: document.getElementById('tech')!,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '../../assets/lottie/laptop-lottie.json',
    });
  }

  loadAnimation_2() {
    this.animation_1 = lottie.loadAnimation({
      container: document.getElementById('message')!,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '../../assets/lottie/contact-lottie.json',
    });
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  

  ngOnDestroy() {
    this.animation.destroy();
  }


  

}
