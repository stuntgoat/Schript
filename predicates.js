// predicates.js

var tester = Object.prototype.toString;

function is_backquote(item) {
    return item === '`';
}

function is_comma(item) {
    return item === ',';
}

function is_lparen(item) {
    return item === '(';
}

function is_rparen(item) {
    return item === ')';
}

function is_object(test) {
    return tester.call(test) === '[object Object]';
}

function is_array(test) {
    return tester.call(test) === '[object Array]';
}

function is_string(test) {
    return tester.call(test) === '[object String]';
}

function is_number(test) {
    return tester.call(test) === '[object Number]';
}

function is_function(test) {
    return tester.call(test) === '[object Function]';
}

function is_boolean(test) {
    return tester.call(test) === '[object Boolean]';
}

exports.is_backquote = is_backquote;
exports.is_comma = is_comma;
exports.is_lparen = is_lparen;
exports.is_rparen = is_rparen;
exports.is_object = is_object;
exports.is_array = is_array;
exports.is_string = is_string;
exports.is_number = is_number;
exports.is_function = is_function;
exports.is_boolean = is_boolean;