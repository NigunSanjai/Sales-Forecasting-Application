import { Component,OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as Papa from 'papaparse';
import { saveAs } from 'file-saver';

import {Chart} from 'angular-highcharts';
import * as Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import ExportData from 'highcharts/modules/export-data';
import { AuthService } from '../service/auth.service';

Exporting(Highcharts);
OfflineExporting(Highcharts);
ExportData(Highcharts);


@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css']
})
export class ForecastComponent{
  user_name = sessionStorage.getItem('username')
  
  actual_txt = sessionStorage.getItem('actual_txt')
  forecast_txt = sessionStorage.getItem('forecast_txt')
  
  rmse = '0';
  mse = '0';
  mae = '0';
  mape = '0';

  attribute = 'attribute'
  quantity = '25'
  revenue = '100'
  title = 'Forecast'

  lineChart:Chart;
  barChart:Chart;


  constructor(
    private router:Router,
    private toastr:ToastrService,
    private location:Location,
    private servie:AuthService
  ){ 
    console.log(this.forecast_txt);
    console.log(this.actual_txt);
  

    this.rmse = sessionStorage.getItem('rmse')!
    this.mse = sessionStorage.getItem('mse')!
    this.mae = sessionStorage.getItem('mae')!
    this.mape = sessionStorage.getItem('mape')!+'%';

    this.attribute = sessionStorage.getItem('attribute')!
    this.quantity = sessionStorage.getItem('quantity')!
    this.revenue = sessionStorage.getItem('revenue')!
    this.title = sessionStorage.getItem('title')!

    this.actual_txt = sessionStorage.getItem('actual_txt')!;
    this.forecast_txt = sessionStorage.getItem('forecast_txt')!;

    sessionStorage.setItem('allowForecast','no')
    
    var csv = this.actual_txt;
    var rows = csv.split('\n').slice(1); // remove the header row
    var dates_1: string[] = rows.map(row => row.split(',')[1]);
    var values_1: number[] = rows.map(row => Number(row.split(',')[2]));

    const org_data = values_1.map((value, index) => ({
      x: Date.parse(dates_1[index]),
      y: value
    }));

    
    csv = this.forecast_txt;
    rows = csv.split('\n').slice(1); // remove the header row
    var dates_2: string[] = rows.map(row => row.split(',')[1]);
    var values_2: number[] = rows.map(row => Number(row.split(',')[2]));

    const forecast_data = values_2.map((value, index) => ({
      x: Date.parse(dates_2[index]),
      y: value
    }));

        
    this.lineChart = new Chart({
      chart: {
        type: 'line',
      },
      title: {
        text: sessionStorage.getItem('title')!
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Date'
        }
      },
      yAxis: {
        title: {
          text: sessionStorage.getItem('attribute')!
        }
      },
      
      series: [
        {
          name: 'Actual',
          type:'line',
          data: org_data,
          color:'#204485'
        },
        { 
          name: 'Forecast',
          type:'line',
          data: forecast_data,
          color:'orange'
        }
    ]
    });

    this.barChart = new Chart({
      chart: {
        type: 'column', // Change to column
      },
      title: {
        text: sessionStorage.getItem('title')!
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Date'
        }
      },
      yAxis: {
        title: {
          text: sessionStorage.getItem('attribute')!
        }
      },
      
      series: [
        { 
          name: 'Forecast',
          type:'column', // Change to column
          data: forecast_data,
          color:'orange'
        },
      ]
    });
    
  }

 

  download_csv(){
    const forecast_txt = sessionStorage.getItem('forecast_txt')!
    const forecast_data = Papa.parse(forecast_txt, { header: true }).data;
    const csv = Papa.unparse(forecast_data);
    const blob = new Blob([csv], { type: 'text/csv' });
    saveAs(blob, this.title);
    this.toastr.success('File is Downloading!!'); 
  }

  goBack(){
    sessionStorage.setItem('allowForecast','no')
    this.location.back()
  }

  logout(){
    sessionStorage.setItem('username','null');
    this.router.navigate(['login']);
  }

}
