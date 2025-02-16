import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';
 
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashbaord.component.html',
  styleUrls: ['./dashbaord.component.scss']
})
export class DashboardComponent implements OnInit {
  itemForm!: FormGroup;
  events: any[] = [];


  educatorEvents: any[] = [];
  eventStatus: any[] = [];
  role: string = '';
  showMessage: boolean = false;
  responseMessage: string = '';

  allocatedResources: any[] = [];

  resources: any[] = [];
 
  eventId: any;
  studentId: string = '';
  searchStudentId: string = '';
  username:any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private httpService: HttpService,
    private authService: AuthService
  ) {

this.itemForm = this.fb.group({

      eventId: ['', [Validators.required]],
      studentId: ['', [Validators.required]]
    });
  }

 
  ngOnInit(): void {
    this.getUserRole();
    this.username =this.authService.getUsername();
    this.fetchEvents();
    
    if(this.role === 'institution'){
      // this.fetchAllocatedResources();
      this.fetchResources();
    }
  }
 
  getUserRole(): void {
    this.role = this.authService.getRole(); // Fetch user role
  }
 
  // registerEvent(): void {
  //   if (this.eventId && this.studentId) {
  //     this.httpService.registerForEvent({ eventId: this.eventId, studentId: this.studentId }).subscribe(
  //       () => {
  //         this.showMessage = true;
  //         this.responseMessage = 'Registration successful!';
  //         this.eventId = '';
  //         this.studentId = '';
  //       },
  //       () => {
  //         this.showMessage = true;
  //         this.responseMessage = 'Error registering for event';
  //       }
  //     );
  //   }
  // }

  registerEvent(): void {
    if (this.eventId && this.studentId) {
      const details = { studentId: this.studentId }; // Only send studentId in body
      this.httpService.registerForEvent(this.eventId, details).subscribe(
        () => {
          this.showMessage = true;
          this.responseMessage = 'Registration successful!';
          this.eventId = '';
          this.studentId = '';
        },
        () => {
          this.showMessage = true;
          this.responseMessage = 'Error registering for event';
        }
      );
    } else {
      this.showMessage = true;

      this.responseMessage = 'Please enter both Event ID and Student ID.';
    }
  }
 
  // searchEventStatus(event:any): void {
  //   const eventId=event.target.value.toLowerCase().trim();
  //   if (!eventId) {
  //     console.log(eventId)
  //     this.fetchAllocatedResources(eventId)
  //     this.showMessage = true;
  //     this.responseMessage = 'Please enter a Event ID.';
  //     return;
  //   }
    
   
  //   // this.httpService.getBookingDetails(eventId).subscribe(
  //   //   (response) => {
  //   //     this.eventStatus = response; // Store the retrieved event status
  //   //     this.showMessage = false; // Hide any previous error message
  //   //   },
  //   //   (error) => {
  //   //     console.error('Error fetching event status', error);
  //   //     this.showMessage = true;
  //   //     this.responseMessage = 'Error fetching event registration status.';
  //   //   }
  //   // );
  // }
 
  fetchEvents(): void {
    if(this.role === 'institution'){

      this.httpService.GetAllevents().subscribe(
        (response) => {
          this.events = response;
        },
        () => {
          this.events = [];
        }
      );
    }else if(this.role === 'educator'){
      this.httpService.getAllEventAgenda().subscribe(
        (response) => {
          this.educatorEvents = response;
        },
        () => {
          this.events = [];
        }
      );
    }
  }


  fetchResources(): void {

    this.httpService.GetAllResources().subscribe(
      (response) => {
        this.resources = response;
      },
      (error) => {
        console.error('Error fetching resources', error);
      }
    );
  }
 
fetchAllocatedResources(): void {
  console.log(this.eventId);
  this.httpService.GetAllocatedResources(this.eventId).subscribe(
    (response) => {
      this.allocatedResources = response;
      console.log(this.allocatedResources);
 
      if (this.allocatedResources.length === 0) {
        this.showMessage = true;
        this.responseMessage = "No Resource Allocated!";
        setTimeout(() => {
          this.showMessage = false;

        }, 2000);
      }
    },
    (error) => {
      console.error('Error fetching allocated resources', error);
    }
  );
}
 
  onUpdate(event: any): void {
    const updatedDetails = {
  name: event.name,
      description: event.description,
      material: event.material,
    }; // Add relevant fields to update
   
  this.httpService.updateEvent(updatedDetails, event.id).subscribe(
      (response) => {
        this.showMessage = true;
        this.responseMessage = 'Event updated successfully!';
        this.fetchEvents();
      },
      (error) => {
        console.error('Error updating event', error);
        this.showMessage = true;
        this.responseMessage = 'Error updating event';
      }
    );
  }

  onDelete(eventId: any): void {
      this.httpService.deleteEvent(eventId).subscribe(
        (response) => {
          this.showMessage = true;
          this.responseMessage = 'Event deleted successfully!';
          this.fetchEvents();
        },
        (error) => {
          console.error('Error deleting event', error);
          this.showMessage = true;
          this.responseMessage = 'Error deleting event';
        }
      );
    }


  onLogout(){
    this.authService.logout();
    // this.route.navigateByUrl('/login');
    window.location.reload();
  }
 
}