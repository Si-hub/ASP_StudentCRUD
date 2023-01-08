import { Component,OnInit,AfterViewInit,ViewChild } from '@angular/core';

import { Student } from './Interfaces/student';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { StudentService } from './Services/student.service';

import { DialogAddEditComponent } from './Dialogs/dialog-add-edit/dialog-add-edit.component';
import { DialogDeleteComponent } from './Dialogs/dialog-delete/dialog-delete.component';
/**
 * @title Table with filtering
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,AfterViewInit{
  displayedColumns:string[] = ['fullName', 'courseTitle', 'email','phone','studentAdmissionDate', 'actions'];
  dataStudent = new MatTableDataSource<Student>();

  @ViewChild(MatPaginator)paginator!: MatPaginator;

  constructor(
    private _snackBar:MatSnackBar,
    private _studentService:StudentService,
    private dialog:MatDialog
  ){

  }

  applyFilter(event:Event){

    const filterValue = (event.target as HTMLInputElement).value;
    this.dataStudent.filter = filterValue.trim().toLowerCase();

  }

  showStudents(){

    this._studentService.getList().subscribe({

      next:(data) =>{
        if(data.status){

          this.dataStudent.data = data.value;

        }
          
      },
        error:(e)=> {}
    });
  }

  ngOnInit(): void {
      this.showStudents();
  }

  ngAfterViewInit(): void {
      this.dataStudent.paginator = this.paginator;
  }

  addNewStudent(){

    this.dialog.open(DialogAddEditComponent,{
      disableClose: true,
      width: "350px"

    }).afterClosed().subscribe(result=> {

      if(result === "created"){
        this.showStudents();
      }
    })
  }

  editStudent(student:Student){

    this.dialog.open(DialogAddEditComponent,{
      disableClose: true,
      data: student,
      width: "350px"

    }).afterClosed().subscribe(result=> {

      if(result === "edited"){
        this.showStudents();
      }
    })
  }

  showAlert(msg:string,title:string){

    this._snackBar.open(msg,title,{
      horizontalPosition:'end',
      verticalPosition:'top',
      duration:3000
    });

  }

  deleteStudent(student:Student){

    this.dialog.open(DialogDeleteComponent, {
      disableClose:true,
      data:student,
    }).afterClosed().subscribe(result=> {

      if(result === "delete"){
        this._studentService.delete(student.studentId).subscribe({
          next:(data) =>{
            if(data.status){
    
              this.showAlert("Student was eliminated", "success");
              this.showStudents();
    
            }else{
              this.showAlert("Could not delete", "error");
            }
              
          },
          error:(e)=> {}
        })
      }
    });

  }

}
