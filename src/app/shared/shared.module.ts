import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ModalModule, BsModalRef } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsModalService } from 'ngx-bootstrap/modal';


import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { RadioModule } from './radio/radio.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { ReactiveFormsModule } from '@angular/forms';

import { InputNumberDirective } from './number/input-number.directive';
import { NumericTextboxModule } from './number';
import { ConfirmComponent } from './modal/confirm.component';
import { UpdateConfirmComponent } from './modal/update-confirm.component';
import { ModalLayoutComponent } from './modal/modal-layout.component';
import { ModalService, ModalRef } from './modal/modal.service';
import { TableComponent } from './datatable/table.component';
import { TableClientComponent } from './datatable/table-client.component';
import { TableNoPagerComponent } from './datatable/table-no-pager.component';
import { TableService } from './datatable/table.service';
import { CardComponent } from './card/card.component';
import { LookupInputComponent } from './lookup/lookup.component';
import { LookupService } from './lookup/lookup.service';
import { YearInputComponent } from './year/year.component';
import { PersonalIdInputComponent } from './personalid/personalid.component';
import { ImageUploadComponent } from './image/image-upload.component';
import { ImageUploadSecuritiesComponent } from './image/image-securities-upload.component';
import { ImageUploadBase64Component } from './image/image-upload-base64.component';
import { ImageIdentityUploadComponent } from './image/image-identity-upload.component';
import { FileUploadComponent } from './attachment/file-upload.component';
import { FileUploadAutoComponent } from './attachment/file-upload-auto.component';
import { FileCustomerAttachmentComponent } from './attachment/file-customer-attachment.component';
import { ThaiDatePipe } from './pipe/thaidate.pipe';
import { FocusDirective } from './focus/focus-invalid.directive';
import { FileService } from './service/file.service';
import { SelectFilterService } from './service/select-filter.service';
import { MenuSelectModule } from './menu-select/menu-select.module';
import { NgxCropperjsModule } from 'ngx-cropperjs';
import { ImageCropperComponent } from './image/image-cropper.component';
import { DynamicFormComponent } from './dynamic-forms/dynamic-forms.component';
import { SubDynamicFormComponent } from './sub-dynamic-forms/sub-dynamic-forms.component';
import { CompareDirective } from './validators/compare.directive';

import { ImageDisplayService } from './image/image-display.service';
import { TrimPipe } from './pipe/trim.pipe';
import { BrowserService } from './service/browser.service';
import { BsDatepickerModule } from './datepicker';
import { PlacePredictionService } from './map-autocomplete/place-prediction.service';
import { ImageLookupComponent } from './imageLookup/image-lookup.component';
import { ImageLookupService } from './imageLookup/image-lookup.service';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { GalleryModule } from '@ks89/angular-modal-gallery';
import { NgxImageCompressService } from 'ngx-image-compress';
import { CustomCheckboxComponent } from './datatable/custom-checkbox/custom-checkbox.component';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { DemoTimepickerMeridianComponent } from './timepicker/timepicker';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { NgxPicaModule } from 'ngx-pica';
import { FileAutoUploadService } from './attachment/file-upload-auto.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    CollapseModule.forRoot(),
    TabsModule.forRoot(),
    RadioModule.forRoot(),
    BsDropdownModule.forRoot(),
    ProgressbarModule.forRoot(),
    NgxDatatableModule,
    NumericTextboxModule,
    NgSelectModule,
    MenuSelectModule,
    NgxCropperjsModule,
    ReactiveFormsModule,
    SlickCarouselModule,
    GalleryModule.forRoot(),
    TimepickerModule.forRoot(),
    NgxExtendedPdfViewerModule,
    NgxPicaModule
  ],
  declarations: [
    ConfirmComponent,
    UpdateConfirmComponent,
    ModalLayoutComponent,
    TableComponent,
    TableClientComponent,
    TableNoPagerComponent,
    CustomCheckboxComponent,
    CardComponent,
    LookupInputComponent,
    YearInputComponent,
    PersonalIdInputComponent,
    ThaiDatePipe,
    InputNumberDirective,
    FocusDirective,
    ImageUploadComponent,
    ImageUploadSecuritiesComponent,
    ImageUploadBase64Component,
    ImageIdentityUploadComponent,
    FileUploadComponent,
    ImageCropperComponent,
    DynamicFormComponent,
    SubDynamicFormComponent,
    CompareDirective,
    TrimPipe,
    ImageLookupComponent,
    DemoTimepickerMeridianComponent,
    FileUploadAutoComponent,
    FileCustomerAttachmentComponent
  ],
  entryComponents: [ConfirmComponent, UpdateConfirmComponent, ImageLookupComponent],
  providers: [TableService, BsModalService, ModalService, LookupService, FileService,
    SelectFilterService, ImageDisplayService, BrowserService, PlacePredictionService, ImageLookupService, NgxImageCompressService
    , FileAutoUploadService
  ],
  exports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    ModalModule,
    BsDatepickerModule,
    BsDropdownModule,
    NgxDatatableModule,
    NumericTextboxModule,
    InputNumberDirective,
    FocusDirective,
    CollapseModule,
    TabsModule,
    RadioModule,
    TooltipModule,
    TableComponent,
    TableClientComponent,
    TableNoPagerComponent,
    CustomCheckboxComponent,
    CardComponent,
    LookupInputComponent,
    YearInputComponent,
    PersonalIdInputComponent,
    ThaiDatePipe,
    NgSelectModule,
    ProgressbarModule,
    ModalLayoutComponent,
    ImageUploadComponent,
    ImageUploadSecuritiesComponent,
    ImageUploadBase64Component,
    ImageIdentityUploadComponent,
    FileUploadComponent,
    MenuSelectModule,
    ImageCropperComponent,
    DynamicFormComponent,
    SubDynamicFormComponent,
    CompareDirective,
    TrimPipe,
    GalleryModule,
    TimepickerModule,
    NgxExtendedPdfViewerModule,
    FileUploadAutoComponent,
    FileCustomerAttachmentComponent
  ]
})
export class SharedModule { }
