import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lots00Service } from '@app/feature/lo/lots00/lots00.service';
import { Page, ModalService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { style } from '@angular/animations';

@Component({
  templateUrl: './lots00.component.html',
  styleUrls: ['./lots00.scss']
})

export class Lots00Component implements OnInit {

  menuForm: FormGroup;
  count: Number = 3;
  page = new Page();
  statusPage: boolean;
  searchForm: FormGroup;
  typeChart: any;
  dataChart: any;
  optionsChart: any;
  typeChart2: any;
  dataChart2: any;
  optionsChart2: any;

  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private lots00Service: Lots00Service,
    private lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService
  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      inputSearch: null,
    });

    this.menuForm = this.fb.group({
      inputSearch: null
    });
  }


  ngOnInit() {
    this.typeChart = 'bar';
    this.dataChart = {
      labels: ['มากราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
              'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
      datasets: [
        {
          // label: 'My Stats Chart',
          data: [3000000, 4300000, 3400000, 1700000, 0, 0,
                0, 0, 0, 0, 0],
          backgroundColor: ['blue', 'blue', 'blue', 'blue', 'blue', 'blue',
                            'blue', 'blue', 'blue', 'blue', 'blue']
        },
        {
          // label: 'My Stats Chart2',
          data: [300000, 700000, 900000, 450000, 0, 0,
                0, 0, 0, 0, 0],
          backgroundColor: ['green', 'green', 'green', 'green', 'green', 'green',
                            'green', 'green', 'green', 'green', 'green']
        }
      ]
    };
    this.optionsChart = {
      responsive: true,
      maintainAspectRatio: false
    };

    this.typeChart2 = 'doughnut';
    this.dataChart2 = {
      // labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      datasets: [
        {
          label: 'My Stats Chart',
          data: [60, 15, 10, 4, 3, 7],
          backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360', 'gray'],
        }
      ]
    };
    this.optionsChart2 = {
      responsive: true,
      maintainAspectRatio: false
    };
  }

}
