import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lots05Service, LoanAgreement, Contract, SaveL, AssessmentQuestions, ReportParam } from '@app/feature/lo/lots05/lots05.service';
import { Page, ModalService, SelectFilterService, Size, ModalRef, SubFormsBase, NumberSubForms, YearSubForms, DateSubForms, TextboxSubForms, DropdownSubForms, RadioSubForms, MainSubForms, RowState } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { switchMap } from 'rxjs/operators';
import { moment } from 'ngx-bootstrap/chronos/test/chain';

@Component({
  templateUrl: './lots05.component.html',
  styleUrls: ['./lots05.component.scss']
})

export class Lots05Component implements OnInit {
  popup: ModalRef;
  saveLog = {} as SaveL;
  loanAgreement: LoanAgreement = {} as LoanAgreement;
  page = new Page();
  searchForm: FormGroup;
  contactForm: FormGroup;
  branchList: any[];
  contractNo: any[];
  contractNoList: any[];
  loanAgreementData: LoanAgreement[] = [] as LoanAgreement[];
  assessmentList = [];
  subAssessmentList: any[];
  submitted: boolean;
  saving: boolean;
  focusToggle: boolean;
  dataRow: any;
  choices = [
    { value: '1', textTha: 'น้อยที่สุด', textEng: 'Excellent' },
    { value: '2', textTha: 'น้อย', textEng: 'Good' },
    { value: '3', textTha: 'ปานกลาง', textEng: 'Fair' },
    { value: '4', textTha: 'พึงพอใจ', textEng: 'Poor' },
    { value: '5', textTha: 'พึงพอใจมาก', textEng: 'Bad' }
  ];
  assessmentQuestions: any;
  approvePaymentOnlineStatusList = [{ Value: '1', TextTha: 'รออนุมัติสัญญา' }, { Value: '2', TextTha: 'อนุมัติสัญญาแล้ว' }]
  printing: boolean;
  reportParam = {} as ReportParam;

  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private lots05: Lots05Service,
    public lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService,
    private route: ActivatedRoute,
    private selectFilter: SelectFilterService
  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      inputSearch: null,
      ContractNo: null,
      ApproveStatus: '1',
      ApproveDateFrom: [null, Validators.required],
      ApproveDateTo: [null, Validators.required],
    });

    this.searchForm.controls.ApproveStatus.valueChanges.subscribe(val => {
      if (val == '2') {
        this.searchForm.controls.ApproveDateFrom.enable();
        this.searchForm.controls.ApproveDateTo.enable();
        this.searchForm.controls.ApproveDateFrom.setValue(new Date());
        this.searchForm.controls.ApproveDateTo.setValue(new Date());
        this.search();
      } else {
        this.searchForm.controls.ApproveDateFrom.setValue(null);
        this.searchForm.controls.ApproveDateTo.setValue(null);
        this.searchForm.controls.ApproveDateFrom.disable();
        this.searchForm.controls.ApproveDateTo.disable();
        this.search();
      }
    });

    this.searchForm.valueChanges.subscribe(() => this.page.index = 0);

    this.searchForm.controls.inputSearch.valueChanges.subscribe(res => {
      this.searchForm.controls.ContractNo.setValue(null, { emitEvent: false });
      this.filterContractNo(this.searchForm.controls.inputSearch.value, true);
    });

    this.contactForm = this.fb.group({
      ContractNo: null,
      CustomerName: null,
      AppLoanPrincipleAmount: null,
      AppLoanInterestAmount: null,
      Amount: null,
      MobileNumber: null,
      AssessmentQuestions: this.fb.group({}),
      Remark: null
    });
  }

  ngOnInit() {
    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });

    this.route.data.subscribe((data) => {
      this.branchList = data.lots05.Branch;
      this.contractNo = data.lots05.ContractNo;
      this.contractNoList = data.lots05.ContractNo;
    });

    const saveData = this.saveData.retrive('LOTS05');
    if (saveData) this.searchForm.patchValue(saveData);

    const routeContractNo = this.route.snapshot.paramMap.get('ContractNo');
    if (routeContractNo) {
      this.searchForm.reset();
      this.saveData.save(this.searchForm.value, "LOTS05");
      this.searchForm.controls.ContractNo.setValue(routeContractNo);
    }

    this.search();
  }

  search(reset?: boolean) {
    if (this.searchForm.controls.ApproveStatus.value == '2') {
      this.submitted = true;
      if (this.searchForm.invalid) {
        this.focusToggle = !this.focusToggle;
        return;
      }
    }
    this.lots05.getLoanAgreement(this.searchForm.value, this.page)
      .pipe(finalize(() => { }))
      .subscribe(
        (res: any) => {
          this.loanAgreementData = res.Rows;
          this.page.totalElements = res.Total;
          this.rebuildForm();
        }, (error) => {
        });
  }

  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'LOTS05');
  }


  onTableEvent(event) {
    this.search();
  }

  rebuildForm() {
    this.bindDropDownList();
  }

  bindDropDownList() {
    this.filterContractNo(this.searchForm.controls.inputSearch.value, false);

    this.selectFilter.SortByLang(this.branchList);
    this.branchList = [...this.branchList];
  }

  seeContractDetail(id) {
    this.router.navigate(['/lo/lots03/detail', { id: id, backToPage: '/lo/lots05' }], { skipLocationChange: true });
  }

  filterContractNo(companyCode, filter?: boolean) {
    if (companyCode) {
      this.contractNoList = this.contractNo.filter(filter => filter.CompanyCode == companyCode);
    } else {
      this.contractNoList = this.contractNo;
    }
    this.selectFilter.SortByLang(this.contractNoList);
    this.contractNoList = [...this.contractNoList];
  }

  prepareSave(values) {
    delete this.loanAgreement['AssessmentQuestions'];
    this.loanAgreement = values;

    let arr = [];
    this.subAssessmentList.forEach((item) => {
      var data = <AssessmentQuestions>{};
      if (item.RowState == RowState.Add) {
        if (item.controlType == "List" || item.controlType == "Radio") {
          data.ContractAnswerId = null;
          data.CustomerCode = this.dataRow.CustomerCode;
          data.QuestionId = item.key;
          data.Answer = null;
          data.AnswerId = item.value;
          data.RowVersion = item.RowVersion;
          data.RowState = item.RowState;
        } else if (item.controlType == "Date") {
          data.ContractAnswerId = null;
          data.CustomerCode = this.dataRow.CustomerCode;
          data.QuestionId = item.key;
          data.Answer = ((Number(moment(item.value).format('YYYY')) - 543) + "-") + moment(item.value).format('MM-DD');
          data.AnswerId = null;
          data.RowVersion = item.RowVersion;
          data.RowState = item.RowState;
        } else if (item.controlType == "Number" || item.controlType == "Year") {
          data.ContractAnswerId = null;
          data.CustomerCode = this.dataRow.CustomerCode;
          data.QuestionId = item.key;
          data.Answer = item.value.toString();
          data.AnswerId = null;
          data.RowVersion = item.RowVersion;
          data.RowState = item.RowState;
        } else {
          data.ContractAnswerId = null;
          data.CustomerCode = this.dataRow.CustomerCode;
          data.QuestionId = item.key;
          data.Answer = item.value;
          data.AnswerId = null;
          data.RowVersion = item.RowVersion;
          data.RowState = item.RowState;
        }
        arr.push(data);
      }
    });

    this.loanAgreement.AssessmentQuestions = [];
    Object.assign(this.loanAgreement.AssessmentQuestions, arr);

    this.dataRow.Remark = this.contactForm.controls.Remark.value;
  }

  approveLoan(allowed) {
    this.submitted = true;

    if (this.contactForm.invalid) {
      this.as.warning('', 'Message.LO00039');
      this.focusToggle = !this.focusToggle;
      return;
    }

    this.saving = true;
    this.prepareSave(this.dataRow);

    // const presentDate = moment(moment(new Date())).startOf('day');
    // if (!moment(moment(this.dataRow.ContractDate)).isSame(presentDate)) {
    //   this.as.warning('', 'Label.LOTS05.NotPresentDate', []);
    //   return;
    // }

    this.lots05.updateLoanAgreement(this.dataRow, allowed).pipe(
      switchMap(() => this.lots05.getLoanAgreement(this.searchForm.value, this.page)),
      finalize(() => {
        this.closePopup();
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe(res => {

        this.loanAgreementData = res.Rows;
        this.page.totalElements = res.Total;
        this.rebuildForm();
        this.as.success('', 'Message.STD00006');
      })
  }

  popupContactCustomer(data, modal) {
    this.dataRow = data;
    this.contactForm.patchValue(data);
    this.contactForm.controls.CustomerName.setValue(data.CustomerName);
    this.contactForm.disable();
    this.contactForm.controls.Remark.enable();

    this.saveLog.LogSystem = 'LO';
    this.saveLog.LogDiscription = 'ขอดูข้อมูลเบอร์โทรศัพท์ จากหน้า อนุมัติสัญญาเงินกู้ ของ ลูกค้า/สมาชิก เลขที่ ' + data.CustomerCode + ': ' + this.contactForm.controls.CustomerName.value + ' ' + 'เลขที่สัญญา' + ' ' + data.ContractNo;
    this.saveLog.LogItemGroupCode = 'SaveLog';
    this.saveLog.LogItemCode = '2';
    this.saveLog.LogProgram = 'LOTS05';
    this.saveLog.CustomerCode = data.CustomerCode;
    this.saveLog.CustomerName = this.contactForm.controls.CustomerName.value;
    this.saveLog.ContractHeadId = data.ContractHeadId;

    this.lots05.saveLog(this.saveLog).pipe(
      finalize(() => { })
    ).subscribe((res) => {
      this.lots05.getAssessmentQuestion()
        .pipe(finalize(() => {
          this.popup = this.modal.open(modal, Size.large);
        }))
        .subscribe(
          (res: any) => {
            this.assessmentQuestions = res.QuestioniList;
            this.assessmentList = this.getAssessment(res.QuestioniList);
            this.contactForm.setControl('AssessmentQuestions', this.toFormGroup(this.subAssessmentList));
          }, (error) => {
            console.log(error);
          });
    });
  }

  closePopup() {
    this.popup.hide();
    this.contactForm.enable();
    this.contactForm.reset();
  }

  get assessmentQuestion(): FormGroup {
    return this.contactForm.get('AssessmentQuestions') as FormGroup;
  }

  toFormGroup(forms: SubFormsBase<any>[]) {
    let group: any = {};
    forms.forEach(form => {
      group[form.key] = form.required ? new FormControl(form.value || null, Validators.required)
        : new FormControl(form.value || null);

      (group[form.key] as FormControl).valueChanges.subscribe( // set value form dynamic
        val => {
          form.value = val;
        }
      );

      (group[form.key] as FormControl).updateValueAndValidity({ onlySelf: false, emitEvent: true });

    });
    return this.fb.group(group);
  }

  getAssessment(attribute: any[]) { // กำหนด type ของ form โดยดูจาก AssessmentDesc ***ทำ array format form dynamic***
    let forms = [];
    let formsAssessment: SubFormsBase<any>[] = [];

    let formsSub = [];
    let formsSubAssessment: SubFormsBase<any>[] = [];

    attribute.forEach((item) => {
      if (item.AssessmentDesc == "List") {
        var dropdown = new DropdownSubForms();
        dropdown.id = null; // เอาไว้เก็บ key tabel
        dropdown.key = item.QuestionId; // เอาไปเป็นชื่อ form
        dropdown.label = item.QuestionTextTha;
        dropdown.TitleSeq = item.Sequence; // เอาไปเรียงว่าอันไหนขึ้นก่อนใช้เป็น seq
        dropdown.labelTha = item.QuestionTextTha;
        dropdown.labelEng = item.QuestionTextEng;
        dropdown.required = true;
        dropdown.value = null;
        dropdown.options = item.AnswerList; // array data ที่จะเอาไปแสดงเป็น list ของ CBB
        dropdown.RowVersion = null;
        dropdown.RowState = RowState.Add;
        forms.push(dropdown);
        formsSub.push(dropdown);
      } else if (item.AssessmentDesc == "Number") {
        var number = new NumberSubForms();
        number.id = null; // เอาไว้เก็บ key tabel
        number.key = item.QuestionId; // เอาไปเป็นชื่อ form
        number.label = item.QuestionTextTha;
        number.TitleSeq = item.Sequence; // เอาไปเรียงว่าอันไหนขึ้นก่อนใช้เป็น seq
        number.labelTha = item.QuestionTextTha;
        number.labelEng = item.QuestionTextEng;
        number.required = true;
        number.value = null;
        number.RowVersion = null;
        number.RowState = RowState.Add;
        forms.push(number);
        formsSub.push(number);
      } else if (item.AssessmentDesc == "Textbox") {
        var text = new TextboxSubForms();
        text.id = null; // เอาไว้เก็บ key tabel
        text.key = item.QuestionId; // เอาไปเป็นชื่อ form
        text.label = item.QuestionTextTha;
        text.TitleSeq = item.Sequence; // เอาไปเรียงว่าอันไหนขึ้นก่อนใช้เป็น seq
        text.labelTha = item.QuestionTextTha;
        text.labelEng = item.QuestionTextEng;
        text.required = true;
        text.value = null;
        text.RowVersion = null;
        text.RowState = RowState.Add;
        forms.push(text);
        formsSub.push(text);
      } else if (item.AssessmentDesc == "Year") {
        var year = new YearSubForms();
        year.id = null; // เอาไว้เก็บ key tabel
        year.key = item.QuestionId; // เอาไปเป็นชื่อ form
        year.label = item.QuestionTextTha;
        year.TitleSeq = item.Sequence; // เอาไปเรียงว่าอันไหนขึ้นก่อนใช้เป็น seq
        year.labelTha = item.QuestionTextTha;
        year.labelEng = item.QuestionTextEng;
        year.required = true;
        year.value = null;
        year.RowVersion = null;
        year.RowState = RowState.Add;
        forms.push(year);
        formsSub.push(year);
      } else if (item.AssessmentDesc == "Date") {
        var date = new DateSubForms();
        date.id = null; // เอาไว้เก็บ key tabel
        date.key = item.QuestionId; // เอาไปเป็นชื่อ form
        date.label = item.QuestionTextTha;
        date.TitleSeq = item.Sequence; // เอาไปเรียงว่าอันไหนขึ้นก่อนใช้เป็น seq
        date.labelTha = item.QuestionTextTha;
        date.labelEng = item.QuestionTextEng;
        date.required = true;
        date.value = null;
        date.RowVersion = null;
        date.RowState = RowState.Add;
        forms.push(date);
        formsSub.push(date);
      } else if (item.AssessmentDesc == "Radio") {
        var radio = new RadioSubForms();
        radio.id = null; // เอาไว้เก็บ key tabel
        radio.key = item.QuestionId; // เอาไปเป็นชื่อ form
        radio.label = item.QuestionTextTha;
        radio.TitleSeq = item.Sequence; // เอาไปเรียงว่าอันไหนขึ้นก่อนใช้เป็น seq
        radio.labelTha = item.QuestionTextTha;
        radio.labelEng = item.QuestionTextEng;
        radio.required = true;
        radio.value = null;
        radio.options = item.AnswerList; // array data ที่จะเอาไปแสดงเป็น list ของ CBB
        radio.RowVersion = null;
        radio.RowState = RowState.Add;
        forms.push(radio);
        formsSub.push(radio);
      } else if (item.AssessmentDesc == "Main") {
        let subForms = [];
        let subFormsAssessment: SubFormsBase<any>[] = [];

        item.SubQuestionis.forEach((sub_item) => {
          if (sub_item.AssessmentDesc == "List") {
            var dropdown = new DropdownSubForms();
            dropdown.id = null; // เอาไว้เก็บ key tabel
            dropdown.key = sub_item.QuestionId; // เอาไปเป็นชื่อ form
            dropdown.label = sub_item.QuestionTextTha;
            dropdown.TitleSeq = sub_item.Sequence; // เอาไปเรียงว่าอันไหนขึ้นก่อนใช้เป็น seq
            dropdown.labelTha = sub_item.QuestionTextTha;
            dropdown.labelEng = sub_item.QuestionTextEng;
            dropdown.required = true;
            dropdown.value = null;
            dropdown.options = sub_item.AnswerList; // array data ที่จะเอาไปแสดงเป็น list ของ CBB
            dropdown.RowVersion = null;
            dropdown.RowState = RowState.Add;
            subForms.push(dropdown);
            formsSub.push(dropdown);
          } else if (sub_item.AssessmentDesc == "Number") {
            var number = new NumberSubForms();
            number.id = null; // เอาไว้เก็บ key tabel
            number.key = sub_item.QuestionId; // เอาไปเป็นชื่อ form
            number.label = sub_item.QuestionTextTha;
            number.TitleSeq = sub_item.Sequence; // เอาไปเรียงว่าอันไหนขึ้นก่อนใช้เป็น seq
            number.labelTha = sub_item.QuestionTextTha;
            number.labelEng = sub_item.QuestionTextEng;
            number.required = true;
            number.value = null;
            number.RowVersion = null;
            number.RowState = RowState.Add;
            subForms.push(number);
            formsSub.push(number);
          } else if (sub_item.AssessmentDesc == "Textbox") {
            var text = new TextboxSubForms();
            text.id = null; // เอาไว้เก็บ key tabel
            text.key = sub_item.QuestionId; // เอาไปเป็นชื่อ form
            text.label = sub_item.QuestionTextTha;
            text.TitleSeq = sub_item.Sequence; // เอาไปเรียงว่าอันไหนขึ้นก่อนใช้เป็น seq
            text.labelTha = sub_item.QuestionTextTha;
            text.labelEng = sub_item.QuestionTextEng;
            text.required = true;
            text.value = null;
            text.RowVersion = null;
            text.RowState = RowState.Add;
            subForms.push(text);
            formsSub.push(text);
          } else if (sub_item.AssessmentDesc == "Year") {
            var year = new YearSubForms();
            year.id = null; // เอาไว้เก็บ key tabel
            year.key = sub_item.QuestionId; // เอาไปเป็นชื่อ form
            year.label = sub_item.QuestionTextTha;
            year.TitleSeq = sub_item.Sequence; // เอาไปเรียงว่าอันไหนขึ้นก่อนใช้เป็น seq
            year.labelTha = sub_item.QuestionTextTha;
            year.labelEng = sub_item.QuestionTextEng;
            year.required = true;
            year.value = null;
            year.RowVersion = null;
            year.RowState = RowState.Add;
            subForms.push(year);
            formsSub.push(year);
          } else if (sub_item.AssessmentDesc == "Date") {
            var date = new DateSubForms();
            date.id = null; // เอาไว้เก็บ key tabel
            date.key = sub_item.QuestionId; // เอาไปเป็นชื่อ form
            date.label = sub_item.QuestionTextTha;
            date.TitleSeq = sub_item.Sequence; // เอาไปเรียงว่าอันไหนขึ้นก่อนใช้เป็น seq
            date.labelTha = sub_item.QuestionTextTha;
            date.labelEng = sub_item.QuestionTextEng;
            date.required = true;
            date.value = null;
            date.RowVersion = null;
            date.RowState = RowState.Add;
            subForms.push(date);
            formsSub.push(date);
          } else if (sub_item.AssessmentDesc == "Radio") {
            var radio = new RadioSubForms();
            radio.id = null; // เอาไว้เก็บ key tabel
            radio.key = sub_item.QuestionId; // เอาไปเป็นชื่อ form
            radio.label = sub_item.QuestionTextTha;
            radio.TitleSeq = sub_item.Sequence; // เอาไปเรียงว่าอันไหนขึ้นก่อนใช้เป็น seq
            radio.labelTha = sub_item.QuestionTextTha;
            radio.labelEng = sub_item.QuestionTextEng;
            radio.required = true;
            radio.value = null;
            radio.options = sub_item.AnswerList; // array data ที่จะเอาไปแสดงเป็น list ของ CBB
            radio.RowVersion = null;
            radio.RowState = RowState.Add;
            subForms.push(radio);
            formsSub.push(radio);
          }

        })

        subFormsAssessment = subForms;

        var main = new MainSubForms();
        main.id = null; // เอาไว้เก็บ key tabel
        main.key = item.QuestionId; // เอาไปเป็นชื่อ form
        main.label = item.QuestionTextTha;
        main.TitleSeq = item.Sequence; // เอาไปเรียงว่าอันไหนขึ้นก่อนใช้เป็น seq
        main.labelTha = item.QuestionTextTha;
        main.labelEng = item.QuestionTextEng;
        main.required = false; // ทำหน้าที่แค่เป็น head เลยไม่จำเป็นต้อง required
        main.value = null;
        main.options = subFormsAssessment; // array data ที่จะเอาไปแสดงเป็น list ของ CBB
        main.RowVersion = null;
        main.RowState = RowState.Normal; // ทำหน้าที่แค่เป็น head เลยไม่จำเป็นต้อง save
        forms.push(main);
        formsSub.push(main);
      }
    })
    formsSubAssessment = formsSub;
    this.subAssessmentList = formsSubAssessment;

    formsAssessment = forms;
    return formsAssessment;
  }

  onPrint() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    this.printing = true;
    this.reportParam.ApprovePaymentOnlineDateFrom = this.searchForm.controls.ApproveDateFrom.value;
    this.reportParam.ApprovePaymentOnlineDateTo = this.searchForm.controls.ApproveDateTo.value;
    this.reportParam.ApprovePaymentOnlineStatus = this.searchForm.controls.ApproveStatus.value;
    this.reportParam.ContractNo = this.searchForm.controls.ContractNo.value;
    this.reportParam.inputSearch = this.searchForm.controls.inputSearch.value;

    this.lots05.generateReport(this.reportParam)
      .pipe(finalize(() => {
        this.submitted = false;
        this.printing = false;
      }))
      .subscribe(
        (res: any) => {
          this.OpenWindow(res);
        });
  }

  async OpenWindow(data) {
    let doc = document.createElement("a");
    doc.href = "data:application/xlsx;base64," + data;
    doc.download = "Contract_Approve_Report-" + ((Number(moment(new Date()).format('YYYY')) - 543) + "-") + moment(new Date()).format('MM-DD') + ".xlsx";
    doc.click();
  }
}