import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lots16Service } from '@app/feature/lo/lots16/lots16.service';
import { Page, ModalService, ModalRef, Size } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
// import { Lots16ContractLookupComponent } from './lots16-contract-lookup.component';

@Component({
  templateUrl: './lots16.component.html'
})

export class Lots16Component implements OnInit {
  // lots16ContractLookupContent = Lots16ContractLookupComponent;
  searchForm: FormGroup;
  branchDDL = [];
  paidStatus = [];
  loanPaymentsList = [];
  beforeSearch = '';
  page = new Page();
  statusPage: boolean;

  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private sv: Lots16Service,
    public lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService,
    private route: ActivatedRoute,
  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      MgmCode: null,
      CustomerName: null,
      flagSearch: true,
      beforeSearch: null,
      page: new Page(),
    });
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('LOTS16');
    if (saveData) this.searchForm.patchValue(saveData);
    this.page = this.searchForm.controls.page.value;
    if (!this.searchForm.controls.flagSearch.value) {
      this.beforeSearch = this.searchForm.controls.beforeSearch.value;
      this.statusPage = this.searchForm.controls.flagSearch.value;
    } else {
      this.statusPage = true;
    }

    this.route.data.subscribe((data) => {
    });
    this.search();
  }

  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'LOTS16');
  }

  onTableEvent(event) {
    this.page = event;
    this.onSearch();
  }

  search() {
    this.page = new Page();
    this.statusPage = true;
    this.onSearch();
  }

  onSearch() {

    if (this.searchForm.controls['MgmCode'].value) {
      this.searchForm.controls['MgmCode'].setValue(this.searchForm.controls['MgmCode'].value.trim());
    }

    if (this.searchForm.controls['CustomerName'].value) {
      this.searchForm.controls['CustomerName'].setValue(this.searchForm.controls['CustomerName'].value.trim());
    }
    this.sv.getMasterQueryList(this.statusPage ? (this.searchForm.value) : this.beforeSearch, this.page)
      .pipe(finalize(() => {
      }))
      .subscribe(
        (res: any) => {
          this.loanPaymentsList = res.Rows;
          this.page.totalElements = res.Total;
        });
  }

  add() {
    this.router.navigate(['/lo/lots16/detail'], { skipLocationChange: true });
  }



  remove(value) {
    this.modal.confirm("Message.STD00003").subscribe(
      (res) => {
        if (res) {
          this.sv.delete(value.MgmCode, value.RowVersion)
            .subscribe(() => {
              this.as.success("", "Message.STD00014");
              this.search();
            });
        }
      })
  }


  onViewInformation(MgmCode) {
    this.router.navigate(['/lo/lots16/detail', { MgmCode: MgmCode }], { skipLocationChange: true });
  }

}
