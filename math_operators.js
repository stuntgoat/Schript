// math_operators.js
// exports: operators, an object with math operators in Scheme as keys and JavaScript 
// functions that print JavaScript code based on arguments.

// The pattern for these procedures is to use the object['func'] to find
// the key in a lookup table that references these procedures and passes the 
// object['args'] value(s) to these functions.

function added(operands) {
    return operands.join("+");
}

function subtracted(operands) {
    return operands.join("-");
}

function multiplied(operands) {
    return operands.join("*");
}

function divided(operands) {
    return operands.join("/");
}

function square_root(operand) {
    return 'Math.sqrt(' + operand + ')';
}

function exponent(operands) {
    return 'Math.pow(' + operands[0] + ',' + operands[1] + ')';
}

function remainder(operands) {
    // returns JavaScript modulo but retains the sign of the dividend
    return operands[0] + '%' + operands[1];
}

function modulo(operands) {
    // returns JavaScript modulo but retains the sign of the divisor
    var divisor_sign = (operands[1] < 1) ? 0 : 1;
    if (divisor_sign) {
	return 'Math.abs(' + operands[0] + '%' + operands[1] + ')';
    } else {
	return '(-1 * Math.abs(' + operands[0] + '%' + operands[1] + '))';
    }
}

var operators = {
    '+': added,
    '-': subtracted,
    '*': multiplied,
    '/': divided,
    'sqrt': square_root,
    'expt': exponent,
    'remainder': remainder,
    'modulo': modulo
};

exports.operators = operators;
