

var tester = Object.prototype.toString;

function is_lparen(item) {
    if (item === '(') {
	return true;
    } else {
	return false;
    }
}
exports.is_lparen = is_lparen;

function is_rparen(item) {
    if (item === ')') {
	return true;
    } else {
	return false;
    }
}
exports.is_rparen = is_rparen;

function is_object(test) {
    if (tester.call(test) === '[object Object]') { 
	return true;
    }
    return false;
}
exports.is_object = is_object;

function is_array(test) {
    if (tester.call(test) === '[object Array]') { 
	return true;
    }
    return false;
}
exports.is_array = is_array;

function is_string(test) {
    if (tester.call(test) === '[object String]') { 
	return true;
    }
    return false;
}
exports.is_string = is_string;

function is_number(test) {
    if (tester.call(test) === '[object Number]') { 
	return true;
    }
    return false;
}
exports.is_number = is_number;

function is_function(test) {
    if (tester.call(test) === '[object Function]') { 
	return true;
    }
    return false;
}
exports.is_function = is_function;

function is_boolean(test) {
    if (tester.call(test) === '[object Boolean]') { 
	return true;
    }
    return false;
}
exports.is_boolean = is_boolean;