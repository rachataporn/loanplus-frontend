import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TemplateView {
    TemplateViewId: number,
    TemplateName: string,
    Active: boolean,
    RowVersion: string
}

export interface View {
    ViewId: number,
    TemplateViewId: number,
    ViewNameTha: string,
    ViewNameEng: string,
    ViewSeq: number,
    Active: boolean,
    RowVersion: string
}

@Injectable()
export class Lomt10Service {
    constructor(private http: HttpClient,
    ) { }

    getTemplateView(search: any, page: any) {
        const param = {
            Keyword: search.keywords,
            sort: page.sort,
            index: page.index,
            size: page.size
        };
        return this.http.get<any>('loan/securitiesTemplateView/getTemplateView', { params: param });
    }

    getView(search: any, page: any) {
        const param = {
            TemplateViewID: search.TemplateViewID,
            sort: page.sort,
            index: page.index,
            size: page.size
        };
        return this.http.get<any>('loan/securitiesTemplateView/getView', { params: param });
    }

    saveTemplateView(templateView: TemplateView) {
        if (templateView.TemplateViewId)
            return this.http.put<TemplateView>('loan/securitiesTemplateView/editTemplateView', templateView);
        else return this.http.post<TemplateView>('loan/securitiesTemplateView/addTemplateView', templateView);
    }

    saveView(view: View) {
        if (view.ViewId)
            return this.http.put<View>('loan/securitiesTemplateView/editView', view);
        else return this.http.post<View>('loan/securitiesTemplateView/addView', view);
    }

    checkDupTemplateView(TemplateName,TemplateViewId) {
        return this.http.get<any>('loan/securitiesTemplateView/checkDupTemplateView', { params: { TemplateName: TemplateName,TemplateViewId : TemplateViewId } });
    }

    checkDupView(ViewSeq,ViewId,TemplateViewId) {
        return this.http.get<any>('loan/securitiesTemplateView/checkDupView', { params: { ViewSeq: ViewSeq, ViewId: ViewId,TemplateViewId : TemplateViewId } });
    }

    checkDupViewName(ViewNameTha,ViewId,TemplateViewId) {
        return this.http.get<any>('loan/securitiesTemplateView/checkDuplicateNameTha', { params: { ViewNameTha: ViewNameTha, ViewId: ViewId, TemplateViewId:TemplateViewId } });
    }

    deleteTemplateView(id, version) {
        return this.http.delete('loan/securitiesTemplateView/deleteTemplateView', { params: { TemplateViewID: id, RowVersion: version } })
    }

    deleteView(id, version) {
        return this.http.delete('loan/securitiesTemplateView/deleteView', { params: { ViewID: id, RowVersion: version } })
    }

    getTemplateViewDetail(templateViewID): Observable<TemplateView> {
        return this.http.get<TemplateView>('loan/securitiesTemplateView/getTemplateViewEdit', { params: { TemplateViewID: templateViewID } });
    }

    getViewDetail(viewID): Observable<View> {
        return this.http.get<View>('loan/securitiesTemplateView/getViewEdit', { params: { viewID: viewID } });
    }

}