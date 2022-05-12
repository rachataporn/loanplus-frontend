import { RowState } from "../datatable/state.enum";
import { Subject } from "rxjs";

export class FormsBase<T> {
  value: T;
  id: string;
  key: string;
  label: string;
  labelTha: string;
  labelEng: string;
  required: boolean;
  order: number;
  controlType: string;
  TitleSeq: number;
  RowState: RowState;
  RowVersion: string;

  constructor(options: {
    value?: T,
    id?: string,
    key?: string,
    label?: string,
    labelTha?: string,
    labelEng?: string,
    required?: boolean,
    order?: number,
    controlType?: string,
    TitleSeq?: number,
    RowVersion?: string,
  } = {}) {
    this.value = options.value;
    this.id = options.id || '';
    this.key = options.key || '';
    this.label = options.label || '';
    this.labelTha = options.labelTha || '';
    this.labelEng = options.labelEng || '';
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
    this.TitleSeq = options.TitleSeq === undefined ? null : options.TitleSeq;
    this.RowVersion = options.RowVersion || '';
  }
}

export class DateForms extends FormsBase<string> {
  controlType = 'Date';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}

export class DropdownForms extends FormsBase<string> {
  controlType = 'List';
  isObservableOptions = false;
  isReady:Subject<boolean>;
  options: { value: string, TextTha: string, TextEng: string }[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.isReady = new Subject<boolean>();
    this.options = options['options'] || [];
  }
}

export class TextboxForms extends FormsBase<string> {
  controlType = 'Textbox';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}

export class NumberForms extends FormsBase<string> {
  controlType = 'Number';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}

export class YearForms extends FormsBase<string> {
  controlType = 'Year';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}
