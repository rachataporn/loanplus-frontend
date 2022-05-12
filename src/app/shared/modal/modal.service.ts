import { Injectable,Component } from '@angular/core';
import { Observable,Subject } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConfirmComponent } from './confirm.component';
import { ImageLookupComponent } from '../imageLookup/image-lookup.component';
import { HttpClient } from '@angular/common/http';
import { UpdateConfirmComponent } from './update-confirm.component';

export enum Size{
    small = "modal-sm",
    medium = "",
    large = "modal-lg"
}

export class ModelRef extends BsModalRef{

}

@Injectable()
export class ModalRef{
  content?: any | null;
  hide: () => void;
}

@Injectable()
export class ModalService {

  constructor(
    private bsModalService: BsModalService,
    private http: HttpClient,
  ) { }

  confirm(message: string,size?:Size) : Observable<boolean> {
    const initialState = {
      message: message
    };
    const modal = this.bsModalService.show(ConfirmComponent, { initialState,ignoreBackdropClick:true,class:size });
    return modal.content.selected;
  }

  updateConfirm(message: string,size?:Size) : Observable<boolean> {
    const initialState = {
      message: message
    };
    const modal = this.bsModalService.show(UpdateConfirmComponent, { initialState,ignoreBackdropClick:true,class:Size.large });
    return modal.content.selected;
  }

  open(content,size?:Size) : ModalRef {
    const modal = this.bsModalService.show(content, { ignoreBackdropClick:true,class:size });
    return modal;
  }

  openComponent(content,size?:Size,initialObject?:Object):Observable<any>{
    const initialState = initialObject || {};
    const modal = this.bsModalService.show(content, { initialState, ignoreBackdropClick:true,class:size });
    return modal.content.selected;
  }

  openImageLookup(size?:Size,initialObject?:Object) : Observable<any> {
    const subject = new Subject<any>();
    const initialState = initialObject || {};
    const modal = this.bsModalService.show(ImageLookupComponent, { initialState, ignoreBackdropClick:true,class:size });
    modal.content.subject = subject;
    return modal.content.subject;
  }
}