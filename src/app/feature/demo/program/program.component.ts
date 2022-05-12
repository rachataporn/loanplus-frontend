import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LangService, AlertService } from '@app/core';
import { programService, Example, ExampleAttachment, ExampleReport } from './program.service';
import { ModalService, Size, ImageFile, RowState, FileService } from '@app/shared';
import { AttributeLookupComponent } from './attribute-lookup.component';
import { SingleLookupComponent } from './single-lookup.component';
import { finalize, switchMap } from 'rxjs/operators';
import { Attachment } from '@app/shared/attachment/attachment.model';
import { Category } from '@app/shared/service/configuration.service';
import { ConfigurationReportService } from '@app/shared/service/configuration.report.service';

@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.scss']
})
export class ProgramComponent implements OnInit {

  samples = [
    { Value: "1", Text: "list1" },
    { Value: "2", Text: "list2" },
    { Value: "3", Text: "list3" },
    { Value: "4", Text: "list4" },
    { Value: "5", Text: "list5" },
  ]
  selected = [];
  datatables = [
    { guid: Math.random(), AttributeID: 1, AttributeNameTha: 'ขนาด', AttributeNameEng: 'Size', Active: true },
    { guid: Math.random(), AttributeID: 2, AttributeNameTha: 'น้ำหนัก', AttributeNameEng: 'Weight', Active: false }
  ];

  SingleLookupContent = SingleLookupComponent;

  programForm: FormGroup;
  uploadForm: FormGroup;
  imageFile: ImageFile = new ImageFile();
  attachmentFile: Attachment = new Attachment();
  attachmentFiles: Attachment[] = [];
  saving: boolean;
  submitted: boolean;
  master = [];
  focusToggle: boolean;
  example: Example;
  category = Category.Example;
  srcResult = null;
  exampleReport: ExampleReport = {} as ExampleReport;

  constructor(
    private fb: FormBuilder,
    private modal: ModalService,
    private route: ActivatedRoute,
    private ps: programService,
    private as: AlertService,
    public lang: LangService,
    private fs: FileService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.ps.getDemo().subscribe((val: Example) => {
      this.example = val;
      this.rebuildForm();
    });
  }

  createForm() {
    this.programForm = this.fb.group({
      TextValue: [null, Validators.required],
      RadioValue: ["A", Validators.required],
      BaseRadioValue: [null, Validators.required],
      CheckboxValue: [null, Validators.required],
      DateValue: [new Date(), Validators.required],
      NumberValue: [null, [Validators.required, Validators.min(1), Validators.max(999)]],
      CurrencyValue: [null, Validators.required],
      SelectValue: [null, Validators.required],
      TextareaValue: [null, Validators.required],
      YearValue: [null, Validators.required],
      LookupValue: [null]
    });

    this.uploadForm = this.fb.group({
      Description: [null],
      ImageName: [null, Validators.required],
      FileName: [null, Validators.required],
      exampleAttachmentsForm: this.fb.array([])
    })
    this.uploadForm.controls.FileName.valueChanges.subscribe(
      (val) => {
      }
    )
  }
  addAttachment() {
    this.exampleAttachments.push(this.createDetailForm({ Id: 0 } as ExampleAttachment));
    this.exampleAttachments.markAsDirty();
  }

  generateReport() {
    this.exampleReport.CompanyCode = '001';
    this.exampleReport.ReportName = 'TestEmployee';
    this.exampleReport.ExportType = 'pdf';

    this.ps.generateReport(this.exampleReport).pipe(
      finalize(() => {
      })
    )
      .subscribe((res) => {
        if (res) {
          this.srcResult = res;
        }
      });
  }

  removeAttachment(index) {
    this.attachmentFiles.splice(index, 1);
    let detail = this.exampleAttachments.at(index) as FormGroup;
    if (detail.controls.RowState.value !== RowState.Add) {
      //เซตค่าในตัวแปรที่ต้องการลบ ให้เป็นสถานะ delete 
      const deleting = this.example.ExampleAttachments.find(item =>
        item.Id == detail.controls.Id.value
      )
      deleting.RowState = RowState.Delete;
    }

    //--ลบข้อมูลrecordนี้ออกจาก formarray
    this.exampleAttachments.removeAt(index);
    this.exampleAttachments.markAsDirty();
    //---------------------------------
  }

  createDetailForm(item: ExampleAttachment): FormGroup {
    let fg = this.fb.group({
      guid: Math.random().toString(),//important for tracking change
      Id: null,
      Code: null,
      FileName: null,
      RowState: RowState.Add
    });
    fg.patchValue(item, { emitEvent: false });
    fg.valueChanges.subscribe(
      (control) => {
        if (control.RowState == RowState.Normal) {
          fg.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
        }
      }
    )
    this.attachmentFiles.push(new Attachment());
    return fg;
  }

  rebuildForm() {
    this.attachmentFiles = [];
    this.uploadForm.patchValue(this.example);
    this.uploadForm.setControl('exampleAttachmentsForm', this.fb.array(this.example.ExampleAttachments.map((detail) => this.createDetailForm(detail))));
  }
  get exampleAttachments() {
    return this.uploadForm.get('exampleAttachmentsForm') as FormArray;
  }
  get NumberValue() {
    return this.programForm.controls.NumberValue;
  }

  get getParameterForSingleLookup() {
    return { ListItemGroupCode: "income_loan" }
  }
  canCheck(row) {
    return row.Active == false;
  }
  identity(row) {
    return row.guid;
  }
  addAttribute() {
    this.selected = [];
    this.modal.openComponent(AttributeLookupComponent, Size.medium, { parameter: "abc" }).subscribe(
      (result) => {
        this.datatables = this.datatables.concat(result);
      }
    )
  }

  removeAttribute(index) {

    const removed = this.datatables.splice(index, 1);
    this.datatables = [...this.datatables];

    const x: number = this.selected.findIndex(o => o.guid === removed[0].guid);
    if (x !== -1) {
      this.selected.splice(x, 1);
      this.selected = [...this.selected];
    }
  }

  back() {

  }
  prepareSave(values: Object) {
    Object.assign(this.example, values);
    const attachments = this.exampleAttachments.getRawValue();
    //add
    const adding = attachments.filter(function (item) {
      return item.RowState == RowState.Add;
    });
    //edit ถ่ายค่าให้เฉพาะที่โดนแก้ไข โดย find ด้วย pk ของ table
    this.example.ExampleAttachments.map(attach => {
      return Object.assign(attach, attachments.filter(item => item.RowState == RowState.Edit).find((item) => {
        return attach.Id == item.Id
      }));
    })
    this.example.ExampleAttachments = this.example.ExampleAttachments.filter(item => item.RowState !== RowState.Normal && item.RowState !== RowState.Add).concat(adding);

  }
  onSubmit() {
    this.submitted = true;
    if (this.uploadForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }
    this.prepareSave(this.uploadForm.getRawValue());
    this.ps.saveDemo(this.example, this.imageFile, this.attachmentFile, this.attachmentFiles).pipe(
      switchMap(() => this.ps.getDemo())
    ).subscribe((val: Example) => {
      this.example = val;
      this.rebuildForm();
      this.as.success("", "Message.STD00006");
    }
    )
  }

  base64ArrayBuffer(arrayBuffer) {
    var base64 = ''
    var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

    var bytes = new Uint8Array(arrayBuffer)
    var byteLength = bytes.byteLength
    var byteRemainder = byteLength % 3
    var mainLength = byteLength - byteRemainder

    var a, b, c, d
    var chunk

    // Main loop deals with bytes in chunks of 3
    for (var i = 0; i < mainLength; i = i + 3) {
      // Combine the three bytes into a single integer
      chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

      // Use bitmasks to extract 6-bit segments from the triplet
      a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
      b = (chunk & 258048) >> 12 // 258048   = (2^6 - 1) << 12
      c = (chunk & 4032) >> 6 // 4032     = (2^6 - 1) << 6
      d = chunk & 63               // 63       = 2^6 - 1

      // Convert the raw binary segments to the appropriate ASCII encoding
      base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
    }

    // Deal with the remaining bytes and padding
    if (byteRemainder == 1) {
      chunk = bytes[mainLength]

      a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

      // Set the 4 least significant bits to zero
      b = (chunk & 3) << 4 // 3   = 2^2 - 1

      base64 += encodings[a] + encodings[b] + '=='
    } else if (byteRemainder == 2) {
      chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

      a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
      b = (chunk & 1008) >> 4 // 1008  = (2^6 - 1) << 4

      // Set the 2 least significant bits to zero
      c = (chunk & 15) << 2 // 15    = 2^4 - 1

      base64 += encodings[a] + encodings[b] + encodings[c] + '='
    }

    return base64
  }
}
