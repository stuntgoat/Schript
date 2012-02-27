// math_operators.js
// exports: operators, an object with math operators in Scheme as keys and JavaScript 
// functions that print JavaScript code based on arguments.

function operate(operator, operands) {
    var output = '';
    for (var i in operands) {
	if (i === operands.length - 1) {
	    output += operands[i];	    
	} else {
	    output += operands[i] + operator;
	}
    }
    return output;
}

function added(operands) {
    return operate('+', operands);
}

function subtracted(operands) {
    return operate('-', operands);
}

function multiplied(operands) {
    return operate('*', operands);
}

function divided(operands) {
    return operate('/', operands);
}

var operators = {
    '+': added,
    '-': subtracted,
    '*': multiplied,
    '/': divided
};

exports.operators = operators;























