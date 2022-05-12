import { Component, OnInit } from '@angular/core';
import { fadeAnimation } from '@app/core';
import { Subject } from 'rxjs';
import { LoadingService } from '@app/core/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  animations: [fadeAnimation]
})
export class LoadingComponent implements OnInit {
  isLoading: Subject<boolean> = this.ls.isLoading;
  constructor(public ls:LoadingService) { }

  ngOnInit() {
  }

}
