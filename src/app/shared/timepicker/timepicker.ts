import { Component } from '@angular/core';
 
@Component({
  selector: 'input[timePicker]',
  templateUrl: './timepicker.html'
})
export class DemoTimepickerMeridianComponent {
  ismeridian: boolean = true;
 
  mytime: Date = new Date();
 
  toggleMode(): void {
    this.ismeridian = !this.ismeridian;
  }
}