import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms'
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

export interface FileDeleteResponse{
  success:boolean,
  message:string
}

@Component({
  selector: 'app-deletepopup',
  templateUrl: './deletepopup.component.html',
  styleUrls: ['./deletepopup.component.css']
})
export class DeletepopupComponent {

  constructor(
    private service: AuthService, 
    private toastr: ToastrService,
    private router:Router,
    private dialogref: MatDialogRef<DeletepopupComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  rolelist: any;
  editdata: any;


  deleteFile() {
    var from = this.data.from
    var username = sessionStorage.getItem('username')!

    if(from=='file-listing'){
      // this.toastr.success(`From : ${from}`)
      var file_name =this.data.file_name
      
      // console.log(file_name)
      // console.log(username)

      this.service.deleteFile(username,file_name).subscribe(
        (res:FileDeleteResponse) => {
          if(res.success){
            this.toastr.success(res.message);
            this.dialogref.close();
            
          }
          else{
            this.toastr.warning(res.message);
          }
          
      });
      
    }
    
    else{
      // this.toastr.success(`From : ${from}`)
      // this.toastr.success('From Predictions!!');
      // console.log('At delete component!!')
      this.service.deleteForecast(username, this.data.title, this.data.file_name, this.data.attribute,
        this.data.frequency, this.data.period).subscribe(
          (res:FileDeleteResponse)=>{
            this.toastr.success(res.message);
            this.dialogref.close();
          },
          err=>{

          }
          
        )
    }
  }

}
