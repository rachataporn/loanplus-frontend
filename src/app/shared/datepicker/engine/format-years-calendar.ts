import {
  DatepickerFormatOptions,
  YearsCalendarViewModel,
  CalendarCellViewModel
} from '../models/index';
import { shiftDate } from 'ngx-bootstrap/chronos/utils/date-setters';
import { formatDate } from 'ngx-bootstrap/chronos/format';
import { createMatrix } from '../utils/matrix-utils';

const height = 4;
const width = 4;
export const yearsPerCalendar = height * width;
const initialShift = (Math.floor(yearsPerCalendar / 2) - 1) * -1;
const shift = { year: 1 };

export function formatYearsCalendar(
  viewDate: Date,
  formatOptions: DatepickerFormatOptions
): YearsCalendarViewModel {
  const initialDate = shiftDate(viewDate, { year: initialShift });
  const matrixOptions = { width, height, initialDate, shift };
  const yearsMatrix = createMatrix<
    CalendarCellViewModel
  >(matrixOptions, date => ({
    date,
    label: (Number(formatDate(date, formatOptions.yearLabel, formatOptions.locale))).toString()
  }));
  const yearTitle = formatYearRangeTitle(yearsMatrix, formatOptions);

  return {
    years: yearsMatrix,
    monthTitle: '',
    yearTitle
  };
}

function formatYearRangeTitle(
  yearsMatrix: CalendarCellViewModel[][],
  formatOptions: DatepickerFormatOptions
): string {
  const from = (Number(formatDate(
    yearsMatrix[0][0].date,
    formatOptions.yearTitle,
    formatOptions.locale
  ))).toString();
  const to = (Number(formatDate(
    yearsMatrix[height - 1][width - 1].date,
    formatOptions.yearTitle,
    formatOptions.locale
  ))).toString();

  return `${from} - ${to}`;
}
