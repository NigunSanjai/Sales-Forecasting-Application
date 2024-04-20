import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxCsvParserModule } from 'ngx-csv-parser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http'
import {ToastrModule} from 'ngx-toastr';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FileListingComponent } from './file-listing/file-listing.component';
import { DeletepopupComponent } from './deletepopup/deletepopup.component';
import { ForecastComponent } from './forecast/forecast.component';
import { ForecastpopupComponent } from './forecastpopup/forecastpopup.component';
import { ChartModule } from 'angular-highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { WelcomeComponent } from './welcome/welcome.component';
import { PredictionsComponent } from './predictions/predictions.component';
import { PredictionCardComponent } from './prediction-card/prediction-card.component';


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    FileListingComponent,
    DeletepopupComponent,
    ForecastComponent,
    ForecastpopupComponent,
    WelcomeComponent,
    PredictionsComponent,
    PredictionCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    FontAwesomeModule,
    NgxCsvParserModule,
    ChartModule,
    HighchartsChartModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
