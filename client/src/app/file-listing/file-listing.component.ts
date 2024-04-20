import { Component,ViewChild,ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../service/shared-service.service';
import { DeletepopupComponent } from '../deletepopup/deletepopup.component';
import { ToastrService } from 'ngx-toastr';
import { ForecastpopupComponent } from '../forecastpopup/forecastpopup.component';

export interface FileListResponse {
  success: boolean;
  data: { num: number, name: string, data: string }[];
}

@Component({
  selector: 'app-file-listing',
  templateUrl: './file-listing.component.html',
  styleUrls: ['./file-listing.component.css']
})
export class FileListingComponent {

   user_id:string = 'user'
   show_table = true;

  constructor(
    private router: Router, 
    private service:AuthService,
    private shared:SharedService,
    private dialog:MatDialog,
    private cdr: ChangeDetectorRef,
    private toastr:ToastrService){
      this.user_id = shared.user_id
      this.LoadFile(this.user_id)
      // console.log(shared.allow_files);
      console.log(`File Lisiting component ${this.user_id}`)
      sessionStorage.setItem('filesUser',this.user_id)
    }
  

  fileList:any;
  dataSource:any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  LoadFile(user_id:string){
    this.service.getFiles(user_id).subscribe(
      (response: FileListResponse) => {
        
        if(response.data.length>0) {
          this.fileList = response.data;
          this.dataSource = new MatTableDataSource(this.fileList);
          this.dataSource.paginator = this.paginator
          this.show_table =true;
        }else this.show_table = false;
        
      },
      error => {
        console.log(error);
        this.toastr.warning("Server Not Reachable!!")
      }
    );
  }
  

  displayedColumns: string[] = ['num','file','forecast','delete'];

  openDeleteDialog(file_name: any): void {
    const popup = this.dialog.open(DeletepopupComponent,{
      enterAnimationDuration:'300ms',
      exitAnimationDuration:'100ms',
      data:{
        file_name:file_name,
        from : 'file-listing'
      }
    }
      )
      popup.afterClosed().subscribe(
        res=>{
          this.LoadFile(this.user_id);
        }
      )
  }

  openForecastDialog(file_name:any){
    const popup = this.dialog.open(ForecastpopupComponent,{
      enterAnimationDuration:'300ms',
      exitAnimationDuration:'100ms',
      data:{
        file_name:file_name
      }
    }
    )
      
  }

  logout(){
    sessionStorage.setItem('username','null');
    this.router.navigate(['login']);
  }
}
