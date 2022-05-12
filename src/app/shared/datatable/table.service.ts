import { Injectable } from '@angular/core';
import { Page } from '@app/shared';

@Injectable()
export class TableService{
    setPageIndex(page:Page,deletedCount:number=1){
       const index = Math.min( Math.ceil((page.totalElements-deletedCount)/page.size) - 1,page.index);
       page.index = index < 0 ? 0 : index;
       return page;
    }
}
