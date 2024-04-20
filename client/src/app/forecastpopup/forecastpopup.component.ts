import { Component, Inject, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms'
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatChipListbox } from '@angular/material/chips';
import { UploadResponse } from '../home/home.component';
import lottie from 'lottie-web';


interface DropDown {
  value: string;
  viewValue: string;
}

export interface GetFileResponse{
  success : boolean,
  message : string
}

@Component({
  selector: 'app-forecastpopup',
  templateUrl: './forecastpopup.component.html',
  styleUrls: ['./forecastpopup.component.css']
})
export class ForecastpopupComponent implements OnInit {

  user_name: string;
  file_name : string;
  rocket:any;
  animation:any;
  selectedFile: File | null = null;
  periodControl = new FormControl(0);
  formControl = new FormControl(null);
  titleControl = new FormControl(null);
  // columnHeaders: string[] = [];
  attributes: DropDown[] = [];

  @ViewChild('chipList') chipList!: MatChipListbox;
  constructor(
    private builder: FormBuilder, 
    private service: AuthService, 
    private toastr: ToastrService,
    private router : Router,
    private dialogref: MatDialogRef<ForecastpopupComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.user_name = sessionStorage.getItem('username')!
      this.file_name = data.file_name

      console.log(this.user_name+"\n"+this.file_name)
  }

  loadAnimation() {
    this.animation = lottie.loadAnimation({
      container: document.getElementById('rocket')!,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '../../assets/lottie/rocket_lottie.json',
    });
  }

  ngOnInit(): void {
    const reader = new FileReader();
    this.rocket = document.getElementById('loading-page')
    this.loadAnimation();

    this.service.get_headers(this.user_name,this.file_name).subscribe(
      res=>{
        const columns:string[] = res.message.split("-")
        this.attributes = columns.slice(1).map((column, index) => {
          return {
            value: String(index + 1),
            viewValue: column.trim(),
          };
        });
      },
      (error) => {
        this.toastr.warning('Server Not Reachable!!')
      }
    ) 
  }

  onUpload(product:string){
    
    const period = this.periodControl.value;
    const frequency: string = Array.isArray(this.chipList.selected) ? 
                              this.chipList.selected[0].value : 
                              this.chipList.selected.value;
                              
                              
    const title = this.titleControl.value;                          
    
    if(product.toString()=='undefined' || period==0 || frequency=="null" || title==null){
      this.toastr.warning('Please Submit Valid Input !!');
    }
    else{
      this.rocket!.style.display = 'flex';
      this.service.upload_file(this.file_name,product,frequency,period!.toString())
      .subscribe(
        (response:UploadResponse) =>{
          const actual_txt = response.df
              const forecast_txt = response.forecast_df;

              sessionStorage.setItem('actual_txt',actual_txt)
              sessionStorage.setItem('forecast_txt',forecast_txt)

              sessionStorage.setItem('allowForecast','yes')
              sessionStorage.setItem('file_name',this.file_name)
              sessionStorage.setItem('attribute',response.attribute)

              sessionStorage.setItem('rmse',response.metrics[0].toString())
              sessionStorage.setItem('mse',response.metrics[1].toString())
              sessionStorage.setItem('mae',response.metrics[2].toString())
              sessionStorage.setItem('mape',response.metrics[3].toString())

              sessionStorage.setItem('title',title);
              sessionStorage.setItem('quantity',response.quantity);
              sessionStorage.setItem('revenue',response.revenue);
              this.rocket!.style.display = 'none';
              this.router.navigate(['forecast'])
              this.dialogref.close();     
        }
      )
      
    }
  }

  

  resetForm(){
    this.selectedFile = null
    this.periodControl.reset()
    this.formControl.reset()
  }
  

}
