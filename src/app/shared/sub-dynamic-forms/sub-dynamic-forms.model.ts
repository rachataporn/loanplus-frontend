import { RowState } from "../datatable/state.enum";

export class SubFormsBase<T> {
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
  options: any[];
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

export class DateSubForms extends SubFormsBase<string> {
  controlType = 'Date';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}

export class DropdownSubForms extends SubFormsBase<string> {
  controlType = 'List';
  options: { value: string, TextTha: string, TextEng: string }[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}

export class TextboxSubForms extends SubFormsBase<string> {
  controlType = 'Textbox';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}

export class NumberSubForms extends SubFormsBase<string> {
  controlType = 'Number';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}

export class YearSubForms extends SubFormsBase<string> {
  controlType = 'Year';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}

export class RadioSubForms extends SubFormsBase<string> {
  controlType = 'Radio';
  options: { value: string, TextTha: string, TextEng: string }[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}

export class MainSubForms extends SubFormsBase<string> {
  controlType = 'Main';
  options: SubFormsBase<any>[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}