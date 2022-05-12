import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lots12Service } from '@app/feature/lo/lots12/lots12.service';
import { Page, ModalService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';

@Component({
  templateUrl: './lots12.component.html'
})

export class Lots12Component implements OnInit {
  [x: string]: any;

  branch = [{ value: '001', text: '-000-000- อ.บ้านกรวด จ.บุรีรัมย์', active: true }];
  invoiceDate = [{ value: '001', text: 'กรกฏาคม', active: true }
    , { value: '002', text: 'สิงหาคม', active: true }, { value: '003', text: 'กันยายน', active: true }];
  year = [{ value: '001', text: '2562', active: true }
    , { value: '002', text: '2561', active: true }, { value: '001', text: '2560', active: true }];
  period = [{ value: '001', text: '1', active: true }];
  loneType = [{ value: '001', text: 'เลือกทั้งหมด', active: true },
  { value: '002', text: 'F-ที่ดิน-สัญญาเงินกู้-1.25%*60M<100,000', active: true },
  { value: '003', text: 'F-ที่ดิน-สัญญาเงินกู้-1.25%*60M>100,000', active: true },
  { value: '004', text: 'F-ที่ดิน-สัญญาเงินกู้-1.25%*60M', active: true },
  { value: '005', text: 'F-ที่ดิน-งดจำนอง-0.95%*60M', active: true },
  { value: '006', text: 'F-ที่ดิน-ขายฝาก-1.25%*60M', active: true }];
  debtor = [{ value: '001', text: 'นางสาว ยุพา บุผาไต', active: true },
  { value: '002', text: 'นาง ละมุน แก้วมงคล', active: true },
  { value: '003', text: 'นาง ละมุน แก้วมงคล', active: true }
  ];
  coBorrower = [{ value: '001', text: 'นางสาว ยุพา บุผาไต', active: true },
  { value: '002', text: 'นาง ละมุน แก้วมงคล', active: true },
  { value: '003', text: 'นาง ละมุน แก้วมงคล', active: true }
  ];
  guarantor = [{ value: '001', text: 'นางสาว ยุพา บุผาไต', active: true },
  { value: '002', text: 'นาง ละมุน แก้วมงคล', active: true },
  { value: '003', text: 'นาง ละมุน แก้วมงคล', active: true }
  ];

  menuList = [{ customerCode: '001', name: 'นางสาว ยุพา บุผาไต', a: '10000', b: '1000', c: '15%' }
    , { customerCode: '002', name: 'นาย ละมุน แก้วมงคล', a: '20000', b: '2000', c: '10%' }
    , { customerCode: '003', name: 'นาง น้อย นาคประโคน', a: '30000', b: '3000', c: '5%' }];

  menuForm: FormGroup;
  count: Number = 3;
  page = new Page();
  
  statusPage: boolean;
  searchForm: FormGroup;

  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private lots12Service: Lots12Service,
    private lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService
  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      inputSearch: null,
      aa: '1',
      cc: null,
      invoiceDate: null,
      year: null,
      // bb: '2',
      dd: '01/08/2562',
      ee: null,
      period: null
    });

    this.menuForm = this.fb.group({
      inputSearch: null
    });
  }

  ngOnInit() {
    this.searchForm.controls.invoiceDate.disable();
    this.searchForm.controls.year.disable();
  }
}
