import {
    Injectable,
    Injector,
    ComponentFactoryResolver,
    EmbeddedViewRef,
    ApplicationRef,
    ComponentRef
} from '@angular/core';
import { BrowserService } from './browser.service';

export interface IStyle {
    [cssRule: string]: string;
}
@Injectable()
export class DomService {

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private browser: BrowserService,
        private injector: Injector
    ) { }

    private resize() {
        if (this.browser.isIE) {
            var evt = document.createEvent('UIEvents');
            evt.initUIEvent('resize', true, false, window, 0);
            window.dispatchEvent(evt);
        } else {
            window.dispatchEvent(new Event('resize'));
        }
    }

    triggerResize(delay=1){
        setTimeout(this.resize.bind(this),delay);
    }
    createComponentRef(component: any): ComponentRef<any> {
        const componentRef = this.componentFactoryResolver
            .resolveComponentFactory(component)
            .create(this.injector);
        this.appRef.attachView(componentRef.hostView);
        return componentRef;
    }

    getDomElementFromComponentRef(componentRef: ComponentRef<any>): HTMLElement {
        return (componentRef.hostView as EmbeddedViewRef<any>)
            .rootNodes[0] as HTMLElement;
    }

    addChild(child: HTMLElement, parent: HTMLElement = document.body) {
        parent.appendChild(child);
    }

    destroyRef(componentRef: ComponentRef<any>, delay: number) {
        setTimeout(() => {
            this.appRef.detachView(componentRef.hostView);
            componentRef.destroy();
        }, delay);
    }

    setDynamicStyles(styles: IStyle, componentRef: ComponentRef<any>) {
        Object.keys(styles).forEach(cssRule => {
            let cssValue = styles[cssRule];
            componentRef.instance.renderer.setElementStyle(
                componentRef.instance.elementRef.nativeElement,
                cssRule,
                cssValue
            );
        });
    }
}