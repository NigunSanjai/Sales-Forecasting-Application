import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';


export interface Prediction{
  id: number,
  title: string,
  file_name: string,
  attribute: string,
  frequency: string,
  period: number,
  actual_txt: string,
  forecast_txt: string, 
  metrics: number[]
}


export interface PredictionListResponse {
  success: boolean;
  data: Prediction[];
}

@Component({
  selector: 'app-predictions',
  templateUrl: './predictions.component.html',
  styleUrls: ['./predictions.component.css']
})

export class PredictionsComponent {

  user_name:string;
  show_table:boolean = false;
  predictions:Prediction[]  = [];

  constructor(private service:AuthService, private toastr:ToastrService){

    this.user_name = sessionStorage.getItem('username')!

    service.get_predictions(this.user_name).subscribe(
      (res:PredictionListResponse)=>{

        if(res.success){
          if(res.data.length>0){
            this.show_table = true;
            this.predictions = res.data;
          }else this.show_table = false;
        }
        else{
          this.show_table = false;
        }
      },
      err=>{
        this.show_table = false;
        toastr.warning("Server Not Reachable!!")
      }
    )

  }

  onPredictionDeleted(deletedPrediction: Prediction) {
    this.predictions = this.predictions.filter((prediction) => prediction !== deletedPrediction);
    if(this.predictions.length==0) this.show_table = false;
  }
}
