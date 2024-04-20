import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import {User} from '../user.interface';
import { LoginResponse } from '../login/login.component';
import { RegisterResponse } from '../register/register.component';
import { UploadFile, UploadResponse } from '../home/home.component';
import { FileListResponse } from '../file-listing/file-listing.component';
import { SharedService } from './shared-service.service';
import { FileDeleteResponse } from '../deletepopup/deletepopup.component';
import { GetFileResponse } from '../forecastpopup/forecastpopup.component';
import { MailResponse } from '../welcome/welcome.component';
import { PredictionListResponse } from '../predictions/predictions.component';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  API_URL = 'http://localhost:5000';

  constructor(private http: HttpClient,
    private shared:SharedService) {}

  RegisterUser(user: User) {
    return this.http.post<RegisterResponse>(`${this.API_URL}/register`, user);
  }

  login(username: string, password: string) {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, {username, password});
  }

  uploadFile(uploadFile:UploadFile){
    const formData = new FormData();
    console.log(uploadFile.file_name!)
    
    formData.append('file_name',uploadFile.file_name!)
    formData.append('user_id', uploadFile.user_id!);
    formData.append('file', uploadFile.file);

    formData.append('product', uploadFile.product);
    formData.append('frequency', uploadFile.frequency);
    formData.append('period', uploadFile.period);
    formData.append('title', uploadFile.title)


    return this.http.post<UploadResponse>(`${this.API_URL}/upload`,formData);
  }

  isLoggedIn(){
    return sessionStorage.getItem('username')!=null;
  }

  getFiles(userId: string) {
    const formData = new FormData();
    formData.append('user_id',userId)
    return this.http.post<FileListResponse>(`${this.API_URL}/get_files`,formData);
  }

  deleteFile(username:string, file_name:string){
    const formData = new FormData();
    formData.append('user_id',username)
    formData.append('file_name',file_name)
    console.log('at service file...delete file')
    return this.http.post<FileDeleteResponse>(`${this.API_URL}/delete_file`,formData);
  }

  deleteForecast(username:string, title:string, file_name:string, attribute:string,
    frequency:string, period:number){
    const formData = new FormData();
    console.log('at service file...delete forecast')
    formData.append('user_id',username)
    formData.append('file_name',file_name)
    formData.append('title',title)
    formData.append('attribute',attribute)
    formData.append('frequency',frequency)
    formData.append('period',period.toString())

    return this.http.post<FileDeleteResponse>(`${this.API_URL}/delete_prediction`,formData);
  }

  get_headers(username:string, file_name:string){
    
    const formData = new FormData();
    formData.append('user_id',username)
    formData.append('file_name',file_name)
  
    return this.http.post<GetFileResponse>(`${this.API_URL}/get_headers`,formData);

  }

  upload_file(file_name:string,product:string, frequency:string, period:string){
    console.log(`file_name : ${file_name}\nProduct : ${product}\nFrequency : ${frequency}\nPeriod : ${period}`)
    const formData = new FormData();
    formData.append('user_id',sessionStorage.getItem('username')!)
    formData.append('file_name',file_name);
    formData.append('col_index',product);
    formData.append('frequency',frequency);
    formData.append('period',period);

    return this.http.post<UploadResponse>(`${this.API_URL}/forecast`,formData);
  }

  send_mail(name:string,to_mail:string,type:string,message:string){

    console.log(`${name}\n${to_mail}\n${type}\n${message}`)

    const formData = new FormData();
    formData.append('name',name)
    formData.append('to_mail',to_mail);
    formData.append('type',type);
    formData.append('message',message);

    return this.http.post<MailResponse>(`${this.API_URL}/send_mail`,formData);
  }

  get_predictions(user_id:string){
    const formData = new FormData();
    formData.append('user_id',user_id)
    return this.http.post<PredictionListResponse>(`${this.API_URL}/get_predictions`,formData);
  }

 

}
