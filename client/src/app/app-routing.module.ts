import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './guard/auth.guard';
import { FileListingComponent } from './file-listing/file-listing.component';
import { ForecastComponent } from './forecast/forecast.component';
import { LoginguardGuard } from './loginguard.guard';
import { FilesGuard } from './files.guard';
import { ForecastGuard } from './forecast.guard';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { PredictionsComponent } from './predictions/predictions.component';


const routes: Routes = [
  {path:'',component:WelcomeComponent},
  {path:'files',component:FileListingComponent,canActivate:[FilesGuard]},
  {path:'register',component:RegisterComponent,canActivate:[LoginguardGuard]},
  {path:'login',component:LoginComponent,canActivate:[LoginguardGuard]},
  {path:'home',component:HomeComponent,canActivate:[AuthGuard]},
  {path:'forecast',component:ForecastComponent,canActivate:[ForecastGuard]},
  {path:'predictions',component:PredictionsComponent,canActivate:[AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
