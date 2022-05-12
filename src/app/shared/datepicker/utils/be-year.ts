import { addFormatToken } from 'ngx-bootstrap/chronos/format/format'
import { getFullYear } from 'ngx-bootstrap/chronos/utils/date-getters';
import { addRegexToken, match1to2, match1to4, match1to6, match2, match4, match6, matchSigned } from 'ngx-bootstrap/chronos/parse/regex';
import { addParseToken } from 'ngx-bootstrap/chronos/parse/token';
import { YEAR } from 'ngx-bootstrap/chronos/units/constants';
import { toInt } from 'ngx-bootstrap/chronos/utils/type-checks';

// FORMATTING
function getYear(date, opts) {
    return getFullYear(date, opts.isUTC).toString();
}
function getThaiYear(date:Date,opt ){
    return (date.getFullYear()+543).toString();
}
addFormatToken('Y', null, null, function (date, opts) {
    var y = getFullYear(date, opts.isUTC);
    return y <= 9999 ? y.toString(10) : "+" + y;
});
addFormatToken(null, ['YY', 2, false], null, function (date, opts) {
    return (getFullYear(date, opts.isUTC) % 100).toString(10);
});
addFormatToken(null, ['YYYY', 4, false], null, getThaiYear);
addFormatToken(null, ['YYYYY', 5, false], null, getThaiYear);
addFormatToken(null, ['YYYYYY', 6, true], null, getThaiYear);
// ALIASES

// PARSING
addRegexToken('Y', matchSigned);
addRegexToken('YY', match1to2, match2);
addRegexToken('YYYY', match1to4, match4);
addRegexToken('YYYYY', match1to6, match6);
addRegexToken('YYYYYY', match1to6, match6);
addParseToken(['YYYYY', 'YYYYYY'], YEAR);
addParseToken('YYYY', function (input, array, config) {
    array[YEAR] = input.length === 2 ? parseTwoDigitYear(input) : toInt(input)-543;
    return config;
});
addParseToken('YY', function (input, array, config) {
    array[YEAR] = parseTwoDigitYear(input) - 43;
    return config;
});
addParseToken('Y', function (input, array, config) {
    array[YEAR] = parseInt(input, 10);
    return config;
});
 function parseTwoDigitYear(input) {
    return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
}
 function daysInYear(year) {
    return isLeapYear(year) ? 366 : 365;
}
 function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}
//# sourceMappingURL=year.js.map