// math_operators.js
// exports: operators, an object with math operators in Scheme as keys and JavaScript 
// functions that print JavaScript code based on arguments.

// The pattern for these procedures is to use the object['func'] to find
// the key in a lookup table that references these procedures and passes the 
// object['args'] value(s) to these functions.
var predicates = require('./predicates.js');
var translate = require('./translate.js');

function added(args) {
    var stack = [];
    
    for (var i in args) {
    	console.log(args[i]);
    	if (predicates.is_object(args[i])) { 
    	    stack.push(translate.ast_to_js(args[i]));
    	} else {
    	    stack.push(args[i]);
    	}	
    }
    return '(' + stack.join("+") + ')';
}

function subtracted(operands) {
    return operands.join("-");
}

function multiplied(args) {
    var stack = [];
    
    for (var i in args) {
    	console.log(args[i]);
    	if (predicates.is_object(args[i])) { 
    	    stack.push(translate.ast_to_js(args[i]));
    	} else {
    	    stack.push(args[i]);
    	}	
    }
    return '(' + stack.join("*") + ')';
}

function divided(operands) {
    return operands.join("/");
}

function square_root(arg) {
    // will only ever be passed a single object.
    var stack = [];
    for (var i in arg) {
    	console.log(arg[i]);
    	if (predicates.is_object(arg[i])) { 
    	    stack.push(translate.ast_to_js(arg[i]));
    	} else {
    	    stack.push(arg[i]);
    	}	
    }
    return 'Math.sqrt(' + stack.join(' ') + ')';
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
