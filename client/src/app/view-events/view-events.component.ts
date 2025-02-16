import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-view-events',
  templateUrl: './view-events.component.html',
  styleUrls: ['./view-events.component.scss']
})
export class ViewEventsComponent implements OnInit {

  itemForm!: FormGroup;
  events: any[] = [];

  currentEvent!:any;
  educatorEvents: any[] = [];
  role!:any;
  update:boolean =false;
  message!:any;

  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private httpService: HttpService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      materials: ['', Validators.required]
    });

    
   this.role = this.authService.getRole();
   this.fetchEvents();

  }

  // Method to handle form submission
  onSubmit(): void {

      // Make an API call to save the event
      
      if (this.itemForm.valid) {
        this.httpService.updateEvent(this.itemForm.value, this.currentEvent.id).subscribe(
          response => {
            this.message = 'Event updated successfully';
            setTimeout(() => {
              this.message = '';
            }, 3000);
            // Refresh the events list after successful update
            this.fetchEvents();
            // Clear the form
            this.update = false;
          },
          error => {
           this.message = 'Error updating event';
          }
        );
      }
  }

  // Method to fetch all events
  fetchEvents(): void {

   if(this.role === 'institution' || this.role === 'student'){
     this.httpService.GetAllevents().subscribe(
       response => {
         this.events = response;
       },
       error => {
         console.error('Error fetching events', error);
       }
     );
   } else  if(this.role === 'educator'){
    this.httpService.getAllEventAgenda().subscribe(
      (response) => {
        this.educatorEvents = response;
        console.log(response)
      },
      () => {
        this.events = [];
      }
    );
  }
  }

  // Method to handle event update
  onUpdate(event: any): void {
    this.update = true;
    this.itemForm.patchValue(event);
    this.currentEvent = event;

  }


  onRegistration(eventId : any) {
    
    }




}