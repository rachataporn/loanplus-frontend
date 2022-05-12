import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService } from '@app/core';
import { ModalService, SelectFilterService, Page } from '@app/shared';
import { Lots02Service, RequestLoan } from './lots02.service';
import { Image, PlainGalleryConfig, PlainGalleryStrategy, GridLayout } from '@ks89/angular-modal-gallery';
import { ConfigurationService, ContentType, Category } from '../../../shared/service/configuration.service';
import { finalize, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as numeral from 'numeral';
import { Lots02LookupComponent } from './lots02-lookup.component';

@Component({
  templateUrl: './lots02-detail.component.html'
})
export class Lots02DetailComponent implements OnInit {
  RequestRoanMaster: RequestLoan = {} as RequestLoan;
  RequestRoanForm: FormGroup;
  submitted: boolean;
  focusToggle: boolean;
  saving: boolean;
  disabled: boolean;
  disabledDisApp = false;
  image: string;
  maxAmount = 0;
  dataUrl: string;
  ImagePicture: Image[] = [];
  assetTypeList = [];
  LoanTypeList = [];
  LoanTypeLists = [];
  PeriodList = ['12', '24', '36', '48'];
  contractPeriods = [];
  docStatusList = [];
  approvalStatusList = [];
  loanChannelList = [];
  itemsLOV = [];
  flagCalPeriod: boolean;
  page = new Page();
  Lots02LookupComponent = Lots02LookupComponent;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private as: AlertService,
    private js: Lots02Service,
    public lang: LangService,
    private config: ConfigurationService,
    private selectFilter: SelectFilterService,
    private modal: ModalService,
  ) {
    this.createForm();
  }

  createForm() {
    this.RequestRoanForm = this.fb.group({
      RegisterId: null,
      Name: [{ value: null, disabled: true }],
      Career: [{ value: null, disabled: true }],
      SecuritiesCategoryId: [{ value: null, disabled: true }],
      Email: [{ value: null, disabled: true }],
      FirstName: [{ value: null, disabled: true }],
      IdCard: [{ value: null, disabled: true }],
      ImageName: [{ value: null, disabled: true }],
      LastName: [{ value: null, disabled: true }],
      LoanAmount: [{ value: null, disabled: true }],
      MobileNo: [{ value: null, disabled: true }],
      PrefixId: [{ value: null, disabled: true }],
      RowVersion: null,
      UserLineId: null,
      ApproveAmount: [0, Validators.required],
      AppLoanPeriodAmount: null,
      StatusContract: null,
      FlagApprove: null,
      remark: null,
      RegisterChannel: null
    });

  }

  ngOnInit() {
    this.flagCalPeriod = JSON.parse(this.route.snapshot.params.Flag);
    this.route.data.subscribe((data) => {
      this.RequestRoanMaster = data.requestLoan.RequestRoanDetail ? data.requestLoan.RequestRoanDetail || {} as RequestLoan : {} as RequestLoan;
      this.LoanTypeList = data.requestLoan.master.LoanTypeList;
      this.assetTypeList = data.requestLoan.master.AssetList;
      this.docStatusList = data.requestLoan.master.DocStatusList;
      this.approvalStatusList = data.requestLoan.master.ApprovalStatusList;
      this.loanChannelList = data.requestLoan.master.LoanChannelList;
      this.filterListDropdown();
    });
    this.rebuildForm();
    this.search();
  }

  get getDocStatus() {
    return this.docStatusList.find((item) => { return item.Value == this.RequestRoanForm.controls['StatusContract'].value });
  };

  get getApprovalStatus() {
    return this.approvalStatusList.find((item) => { return item.Value == this.RequestRoanForm.controls['FlagApprove'].value });
  };

  get getLoanChannel() {
    return this.loanChannelList.find((item) => { return item.Value == this.RequestRoanForm.controls['RegisterChannel'].value });
  };

  plainGalleryGrid: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.GRID,
    layout: new GridLayout({ width: '100px', height: '150px' }, { length: 8, wrap: true })
  };

  rebuildForm() {
    this.RequestRoanForm.markAsPristine();
    this.RequestRoanForm.patchValue(this.RequestRoanMaster);
    this.maxAmount = this.RequestRoanForm.controls.LoanAmount.value;
    this.RequestRoanForm.controls.SecuritiesCategoryId.setValue(String(this.RequestRoanMaster.SecuritiesCategoryId));
    var i = 0;
    this.RequestRoanMaster.ApproveLoanImages.forEach(element => {
      this.config.configChanged().subscribe(config => {
        this.dataUrl = `${config.DisplayPath}/${ContentType.Image}/${Category.PreApprove}/${element.imageName}`;
      })
      this.ImagePicture.push(new Image(
        i,
        {
          img: this.dataUrl,
        }
      ))
      i++;
    });

    if (this.RequestRoanForm.controls.FlagApprove.value != '3') {
      this.RequestRoanForm.disable();
      this.disabled = true;
      if (this.flagCalPeriod) {
        this.processPeriod();
      }
    }
  }

  filterListDropdown() {
    // this.LoanTypeLists = this.LoanTypeList.filter(item => item.Active === false);
    this.LoanTypeLists = this.selectFilter.FilterActive(this.LoanTypeList);
    this.selectFilter.SortByLang(this.LoanTypeLists);
    this.LoanTypeLists = [...this.LoanTypeLists];
  }

  onSubmit(flag: boolean) {
    this.submitted = true;
    if (this.RequestRoanForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    if (flag) {
      this.RequestRoanForm.controls.FlagApprove.setValue('1');
    } else {
      this.RequestRoanForm.controls.FlagApprove.setValue('2');
    }

    this.saving = true;
    this.prepareSave(this.RequestRoanForm.getRawValue());
    this.js.saveRequestRoan(this.RequestRoanMaster).pipe(
      switchMap(() => this.js.getSearchEdit(this.RequestRoanForm.controls.RegisterId.value)),
      finalize(() => {
        this.saving = false;
        this.submitted = false;
        this.disabledDisApp =true;
      }))
      .subscribe(
        (res: RequestLoan) => {
          this.RequestRoanMaster = res;
          this.flagCalPeriod = !this.flagCalPeriod;
          this.rebuildForm();
          this.as.success('', 'บันทึกสำเร็จ');
        }
      );
  }

  prepareSave(values: Object) {
    Object.assign(this.RequestRoanMaster, values);
  }

  back() {
    this.router.navigate(['/lo/lots02'], { skipLocationChange: true });
  }

  processPeriod() {
    if (this.contractPeriods.length === 0) {
      return this.getPeriod();
    }
    return this.modal.confirm("Message.STD00002").subscribe(value => {
      if (value) {
        if (this.contractPeriods.length > 0) {
          this.contractPeriods = [];
          this.getPeriod();
        }
      }
      return;
    });
  }

  getPeriod() {
    this.submitted = true;
    const now = new Date();

    let InterestDate = now;
    let rate = this.RequestRoanForm.controls.Interest.value;
    let principleAmount = this.RequestRoanForm.controls.ApproveAmount.value;
    let totalPeriod = this.RequestRoanForm.controls.Period.value;
    let startPaymentDate = now;
    let reqGapPeriod = 1;

    if (rate && principleAmount && totalPeriod && startPaymentDate && reqGapPeriod) {
      this.js.getContractPeriodQuery(Object.assign({
        fixRate: rate,
        AppLoanPrincipleAmount: principleAmount,
        AppLoanTotalPeriod: totalPeriod,
        StartPaymentDate: startPaymentDate,
        ReqGapPeriod: reqGapPeriod,
        InterestDate: InterestDate
      })).subscribe(
        (res: any) => {
          if (res) {
            this.submitted = false;
            this.contractPeriods = res;
            this.RequestRoanForm.controls.AppLoanPeriodAmount.setValue(res[1].TotalAmount, { emitEvent: false });
          }
        }, (error) => {
          console.log(error);
          this.submitted = false;
        });
    } else {
      this.as.warning('กรุณากรอกข้อมูลให้ครบถ้วน', '');
      this.focusToggle = !this.focusToggle;
      this.submitted = false;
      return;
    }
  }

  summaryTotalAmount() {
    if (this.contractPeriods.length > 0) {
      return this.contractPeriods.map(row => row.TotalAmount)
        .reduce((res, cell) => res = numeral(Number(res)).add(Number(cell)).value(), 0);
    }
  }

  summaryTotalApproveAmount() {
    if (this.itemsLOV.length > 0) {
      return this.itemsLOV.map(row => row.loanLimitAmount)
        .reduce((res, cell) => res = numeral(Number(res)).add(Number(cell)).value(), 0);
    }
  }

  summaryPrincipleAmount() {
    if (this.contractPeriods.length > 0) {
      return this.contractPeriods.map(row => row.PrincipleAmount)
        .reduce((res, cell) => res = numeral(Number(res)).add(Number(cell)).value(), 0);
    }
  }

  summaryInterestAmount() {
    if (this.contractPeriods.length > 0) {
      return this.contractPeriods.map(row => row.InterestAmount)
        .reduce((res, cell) => res = numeral(Number(res)).add(Number(cell)).value(), 0);
    }
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.RequestRoanForm.dirty) {
      return true;
    }
    return this.modal.confirm('Message.STD00002');
  }


  search() {
    this.js.getLookUp(this.RequestRoanMaster.RegisterId, this.page)
      .subscribe(
        (res: any) => {
          this.itemsLOV = res.Rows;
          this.page.totalElements = res.Total;
          this.submitted = false;
          this.disabled = this.itemsLOV.length == 0;
          if (this.itemsLOV.length > 0) {
            var hasDuplicates = this.itemsLOV.some(function (item) {
              return item.SecuritiesStatusCode != '3';
            });
            this.disabled = hasDuplicates;
            this.RequestRoanForm.controls.ApproveAmount.setValue(this.summaryTotalApproveAmount());
          }
        });
  }

  addSecurities() {
    this.router.navigate(['/lo/lots13/detail', { RegisRefId: this.RequestRoanForm.controls.RegisterId.value }], { skipLocationChange: true });
  }

  onTableEvent() {
    this.search();
  }
}
