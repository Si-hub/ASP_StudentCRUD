import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { Course } from 'src/app/Interfaces/course';
import { Student } from 'src/app/Interfaces/student';
import * as moment from 'moment';
import { ThisReceiver } from '@angular/compiler';
import { CourseService } from 'src/app/Services/course.service';
import { StudentService } from 'src/app/Services/student.service';

export const MY_DATE_FORMATS= {

    parse: {
      dateInput:"DD/MM/YYYY"
    },

    display: {
      dateInput:'DD/MM/YYYY',
      monthYearLabel:'MMMM YYYY',
      dataA11yLabel:'LL',
      monthYear11yLabel:'MMMM YYYY'
    }

};


@Component({
  selector: 'app-dialog-add-edit',
  templateUrl: './dialog-add-edit.component.html',
  styleUrls: ['./dialog-add-edit.component.css'],
  providers:[
    {provide:MAT_DATE_FORMATS, useValue:MY_DATE_FORMATS}
  ]
})


export class DialogAddEditComponent implements OnInit {

  formStudent:FormGroup;
  action:string = 'Add';
  actionButton:string = 'Save';
  listCourse:Course[]=[];


  constructor(
    private dialogReference:MatDialogRef<DialogAddEditComponent>,
    @Inject(MAT_DIALOG_DATA)public studentData:Student,
    private fb:FormBuilder,
    private _snackBar:MatSnackBar,
    private _courseService:CourseService,
    private _studentService:StudentService
  ) {

      this.formStudent = this.fb.group({

        fullName:['', Validators.required],
        courseId:['', Validators.required],
        phone:['', Validators.required],
        email:['', Validators.required],
        studentAdmissionDate:['', Validators.required],
        

      });


      this._courseService.getList().subscribe({

        next:(data) =>{
          if(data.status){
  
            this.listCourse = data.value;
  
          }
            
        },
          error:(e)=> {}
      });

   }


  ngOnInit(): void {

    if(this.studentData){

      this.formStudent.patchValue({

      fullName:this.studentData.fullName,
      courseId:this.studentData.courseId,
      phone:this.studentData.phone,
      email:this.studentData.email,
      studentAdmissionDate:moment(this.studentData.studentAdmissionDate,'DD/MM/YYYY')

      })

      this.action ="Edit";
      this.actionButton = "Update";

    }
  }


  showAlert(msg:string,title:string){

    this._snackBar.open(msg,title,{
      horizontalPosition:'end',
      verticalPosition:'top',
      duration:3000
    });

  }

  addEditStudent(){

    const model:Student = {

      studentId:this.studentData == null ? 0: this.studentData.studentId,
      fullName:this.formStudent.value.fullName,
      courseId:this.formStudent.value.courseId,
      phone:this.formStudent.value.phone,
      email:this.formStudent.value.email,
      studentAdmissionDate:moment(this.formStudent.value.studentAdmissionDate).format('DD/MM/YYYY')

    }

    if(this.studentData == null){
  
      this._studentService.add(model).subscribe({

        next:(data) =>{
          if(data.status){
  
            this.showAlert("Student was created!","success");
            this.dialogReference.close("created");
  
          }else{
            this.showAlert("could not create", "Error")
          }
            
        },
          error:(e)=> {}
      });

    }else{

      this._studentService.update(model).subscribe({

        next:(data) =>{
          if(data.status){
  
            this.showAlert("Student was edited!","success");
            this.dialogReference.close("edited");
  
          }else{
            this.showAlert("could not edit", "Error")
          }
            
        },
          error:(e)=> {}
      });

    }

    

  }



}
