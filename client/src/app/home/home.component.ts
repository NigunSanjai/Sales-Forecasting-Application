import { Component,ViewChild } from '@angular/core';
import { Router} from '@angular/router';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MatChipListbox } from '@angular/material/chips';
import { FormControl } from '@angular/forms';
import lottie from 'lottie-web';

export interface UploadResponse {
  success: boolean;
  message: string;
  forecast_df: string;
  df: string;
  attribute:string;
  metrics:Number[],
  quantity:string,
  revenue:string
}

export interface UploadFile {
  user_id:string|null,
  file_name:string|null,
  file:any|null,
  product:string,
  frequency:string,
  period:string,
  title:string
}

export interface DropDown {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {
  user_name: string | null;
  selectedFile: File | null = null;
  periodControl = new FormControl(0);
  formControl = new FormControl(null);
  titleControl = new FormControl(null);

  columnHeaders: string[] = [];

  animation: any;

  loading_animation:any;

  rocket:any = null;

  loadAnimation() {
    this.animation = lottie.loadAnimation({
      container: document.getElementById('lottie')!,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '../../assets/lottie/statistics-lottie.json',
    });
  }

  loadAnimation_1() {
    this.animation = lottie.loadAnimation({
      container: document.getElementById('rocket')!,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '../../assets/lottie/rocket_lottie.json',
    });
  }

  ngOnInit() {
    this.rocket = document.getElementById('loading-page')
    // if(this.rocket) this.rocket!.style.display = 'none'
    this.loadAnimation();
    this.loadAnimation_1();
  }

  @ViewChild('chipList') chipList!: MatChipListbox;
  
  constructor(
    private router: Router, 
    private authService:AuthService,
    private toastr:ToastrService
    ) {
    const state = this.router.getCurrentNavigation()?.extras.state;
    this.user_name = sessionStorage.getItem('username')
    sessionStorage.setItem('allowFiles','no')
    sessionStorage.setItem('allowForecast','no')
    console.log(`Home component ${this.user_name}`)
  }

  

  attributes: DropDown[] = [];

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
  
    reader.onload = () => {
      const csvData = reader.result!.toString();
      // console.log(csvData)
      const rows = csvData.split('\n');
      if (rows.length > 0) {
        const columns = rows[0].split(','); // assume first row has column headers
        this.columnHeaders = columns;
        this.attributes = columns.slice(1).map((column, index) => {
          return {
            value: String(index + 1),
            viewValue: column.trim(),
          };
        });
      }
    };
  
    reader.readAsText(this.selectedFile!);
  }
  

  onUpload(product:string) {

    if(this.selectedFile==null){
      this.toastr.warning('Please select a File!!');
    }

    else if (this.selectedFile && this.selectedFile.type === 'text/csv') {
      
      // try{
        const frequency: string = Array.isArray(this.chipList.selected) ? 
                              this.chipList.selected[0].value : 
                              this.chipList.selected.value;

        const period = this.periodControl.value;

        const title = this.titleControl.value;

        console.log(title)

        console.log(`Product : ${product.toString()}\nFrequency : ${frequency}\nPeriod : ${period}`)
  
        if(product.toString()=='undefined' || period==0 || frequency=="null" || title==null){
          this.toastr.warning('Please Submit Valid Input !!');
        }
        else{
          const uploadFile: UploadFile = {
            user_id:this.user_name,
            file_name:this.selectedFile.name,
            file:this.selectedFile,
            product:product,
            frequency:frequency,
            period:String(period),
            title:title
          };
    
          this.rocket!.style.display = 'flex';

          this.authService.uploadFile(uploadFile).subscribe(
            (response:UploadResponse) => {
              const actual_txt = response.df
              const forecast_txt = response.forecast_df;

              sessionStorage.setItem('actual_txt',actual_txt)
              sessionStorage.setItem('forecast_txt',forecast_txt)

              sessionStorage.setItem('allowForecast','yes')

              sessionStorage.setItem('attribute',response.attribute)

              sessionStorage.setItem('rmse',response.metrics[0].toString())
              sessionStorage.setItem('mse',response.metrics[1].toString())
              sessionStorage.setItem('mae',response.metrics[2].toString())
              sessionStorage.setItem('mape',response.metrics[3].toString())

              sessionStorage.setItem('title',title);
              sessionStorage.setItem('quantity',response.quantity);
              sessionStorage.setItem('revenue',response.revenue);
              
              console.log(response.attribute)
              console.log(response.metrics)
              this.router.navigate(['forecast'])
              this.rocket!.style.display = 'none';
            },
            (error) => {
              this.rocket!.style.display = 'none';
              console.log('File upload failed:', error);
              this.toastr.warning('Server Not Reachable!!');
            }
          );
        } 
      // }
      // catch(e){
      //   this.toastr.warning('error');
      // }
        
    }
    else this.toastr.warning('Invalid file format. Please select a CSV file.');
    
  }

  resetForm(){
    this.selectedFile = null
    this.periodControl.reset()
    this.formControl.reset()
    this.titleControl.reset()
  }

  logout(){
    sessionStorage.setItem('username','null');
    this.router.navigate(['login']);
  }

  openFiles(){
    sessionStorage.setItem('allowFiles','yes');
    this.router.navigate(['files']);
  }

}