import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-complete',
  templateUrl: './reset-complete.component.html',
  styleUrls: ['../account.scss']
})
export class ResetCompleteComponent implements OnInit {

  constructor( private route: ActivatedRoute,) { }
  isComplete:boolean = false;
  ngOnInit() {
    const complete = this.route.snapshot.paramMap.get('complete');
    this.isComplete = complete == "true";
  }

}
