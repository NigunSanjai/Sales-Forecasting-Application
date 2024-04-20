import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Prediction } from '../predictions/predictions.component';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeletepopupComponent } from '../deletepopup/deletepopup.component';

@Component({
  selector: 'app-prediction-card',
  templateUrl: './prediction-card.component.html',
  styleUrls: ['./prediction-card.component.css']
})
export class PredictionCardComponent {

  @Input() prediction!: Prediction;
  @Output() predictionDeleted = new EventEmitter<Prediction>();

  constructor(
    private toastr:ToastrService,
    private service:AuthService,
    private router:Router,
    private dialog:MatDialog
  ) {
  }

  ngOnInit(): void {
    console.log(this.prediction.title)
  }

  viewPrediction(){
    const actual_txt = this.prediction.actual_txt
    const forecast_txt = this.prediction.forecast_txt;

    console.log(forecast_txt)

    sessionStorage.setItem('actual_txt',actual_txt)
    sessionStorage.setItem('forecast_txt',forecast_txt)

    sessionStorage.setItem('allowForecast','yes')

    sessionStorage.setItem('attribute',this.prediction.attribute)

    sessionStorage.setItem('rmse',this.prediction.metrics[0].toString())
    sessionStorage.setItem('mse',this.prediction.metrics[1].toString())
    sessionStorage.setItem('mae',this.prediction.metrics[2].toString())
    sessionStorage.setItem('mape',this.prediction.metrics[3].toString())

    sessionStorage.setItem('title',this.prediction.title);
    sessionStorage.setItem('quantity','8.0');
    sessionStorage.setItem('revenue','0.85');
    
    this.router.navigate(['forecast'])
  }

  deletePrediction(): void {
    const popup = this.dialog.open(DeletepopupComponent,{
      enterAnimationDuration:'300ms',
      exitAnimationDuration:'100ms',
      data:{
        from : "prediction-card",
        title : this.prediction.title,
        file_name : this.prediction.file_name,
        attribute : this.prediction.attribute,
        frequency : this.prediction.frequency,
        period:this.prediction.period
      }
    }
      );
      popup.afterClosed().subscribe(
        (result) => {
          this.predictionDeleted.emit(this.prediction);
      });
      
  }

}

