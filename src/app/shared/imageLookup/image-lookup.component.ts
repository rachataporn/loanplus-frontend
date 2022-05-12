import { Component, OnInit, Output, EventEmitter, HostListener, ViewChild } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { ModalService, Size } from '../modal/modal.service';
import { ImageLookupService } from "./image-lookup.service";
import { Subject } from "rxjs";
import { finalize } from "rxjs/operators";
//import { GalleryItem, ImageItem, GalleryComponent } from '@ngx-gallery/core';
import { ImageDisplayService } from "../image/image-display.service";

@Component({
  selector: 'app-product-lookup',
  templateUrl: './image-lookup.component.html',
  styleUrls: ['./image-lookup.component.css'],
})

export class ImageLookupComponent implements OnInit {
  @Output() onClose = new EventEmitter();
  productCode: string
  companyCode: string
  slides = [];
  galleryIndex: number = 0;
  showNavPrev: boolean = true;
  showNavNext: boolean = true;
  loading: boolean = false;
  loadingComplete: boolean = false;
  slideConfigImgProductSingle = {
    slidesToShow: 1
    , slidesToScroll: 1
    , arrows: false
    , swipe: true
    , asNavFor: '.multi'
    , fade: true
    , infinite: false
  };
  slideConfigImgProductmulti = {
    slidesToShow: 4
    , slidesToScroll: 1
    , prevArrow: ".product-nav.prev"
    , nextArrow: ".product-nav.next"
    , asNavFor: '.single'
    , focusOnSelect: true
    , infinite: false
    , responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 424,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  constructor(
    public bsModalRef: BsModalRef,
    public pl: ImageLookupService,
    public image: ImageDisplayService,
  ) {

  }

  ngOnInit() {
    this.loading = true;
    // this.pl.getImageAll(this.companyCode)
    // .pipe(finalize (() => { this.loading = false; this.loadingComplete = true}))
    // .subscribe(
    //   res => {
    //     this.slides = res;
    //   }
    // )
    this.loading = false;
    this.loadingComplete = true;
    this.slides = [{ "RowNumber": 1, "ProductImageID": 31534, "CompanyCode": "001", "ProductCode": "AT611100088", "ViewID": 1, "ImageName": "1625538629.jpg", "Active": true, "CreatedBy": "admin", "CreatedDate": "2019-07-24T14:55:38.66+07:00", "CreatedProgram": "IMMT03", "UpdatedBy": "admin", "UpdatedDate": "2019-07-24T14:55:38.66+07:00", "UpdatedProgram": "IMMT03", "RowVersion": "AAAAAAASG4A=", "ImageProduct": "https://apps.softsquaregroup.com/aaa.content/Images/Product/AT611100088/1625538629.jpg" }, { "RowNumber": 2, "ProductImageID": 31535, "CompanyCode": "001", "ProductCode": "AT611100088", "ViewID": 2, "ImageName": "5625538675.jpg", "Active": true, "CreatedBy": "admin", "CreatedDate": "2019-07-24T14:55:38.707+07:00", "CreatedProgram": "IMMT03", "UpdatedBy": "admin", "UpdatedDate": "2019-07-24T14:55:38.707+07:00", "UpdatedProgram": "IMMT03", "RowVersion": "AAAAAAASG4E=", "ImageProduct": "https://apps.softsquaregroup.com/aaa.content/Images/Product/AT611100088/5625538675.jpg" }, { "RowNumber": 3, "ProductImageID": 31536, "CompanyCode": "001", "ProductCode": "AT611100088", "ViewID": 3, "ImageName": "2625538706.jpg", "Active": true, "CreatedBy": "admin", "CreatedDate": "2019-07-24T14:55:38.737+07:00", "CreatedProgram": "IMMT03", "UpdatedBy": "admin", "UpdatedDate": "2019-07-24T14:55:38.737+07:00", "UpdatedProgram": "IMMT03", "RowVersion": "AAAAAAASG4I=", "ImageProduct": "https://apps.softsquaregroup.com/aaa.content/Images/Product/AT611100088/2625538706.jpg" }, { "RowNumber": 4, "ProductImageID": 31537, "CompanyCode": "001", "ProductCode": "AT611100088", "ViewID": 4, "ImageName": "6625538753.jpg", "Active": true, "CreatedBy": "admin", "CreatedDate": "2019-07-24T14:55:38.783+07:00", "CreatedProgram": "IMMT03", "UpdatedBy": "admin", "UpdatedDate": "2019-07-24T14:55:38.783+07:00", "UpdatedProgram": "IMMT03", "RowVersion": "AAAAAAASG4M=", "ImageProduct": "https://apps.softsquaregroup.com/aaa.content/Images/Product/AT611100088/6625538753.jpg" }, { "RowNumber": 5, "ProductImageID": 31538, "CompanyCode": "001", "ProductCode": "AT611100088", "ViewID": 5, "ImageName": "3625538784.jpg", "Active": true, "CreatedBy": "admin", "CreatedDate": "2019-07-24T14:55:38.83+07:00", "CreatedProgram": "IMMT03", "UpdatedBy": "admin", "UpdatedDate": "2019-07-24T14:55:38.83+07:00", "UpdatedProgram": "IMMT03", "RowVersion": "AAAAAAASG4Q=", "ImageProduct": "https://apps.softsquaregroup.com/aaa.content/Images/Product/AT611100088/3625538784.jpg" }, { "RowNumber": 6, "ProductImageID": 31533, "CompanyCode": "001", "ProductCode": "AT611100088", "ViewID": 7, "ImageName": "4625538566.jpg", "Active": true, "CreatedBy": "admin", "CreatedDate": "2019-07-24T14:55:38.63+07:00", "CreatedProgram": "IMMT03", "UpdatedBy": "admin", "UpdatedDate": "2019-07-24T14:55:38.63+07:00", "UpdatedProgram": "IMMT03", "RowVersion": "AAAAAAASG38=", "ImageProduct": "https://apps.softsquaregroup.com/aaa.content/Images/Product/AT611100088/4625538566.jpg" }];
  }

  close(): void {
    this.bsModalRef.hide();
  }
}