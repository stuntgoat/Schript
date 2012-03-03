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

    	if (predicates.is_object(args[i])) { 
    	    stack.push(translate.ast_to_js(args[i]));
    	} else {
    	    stack.push(args[i]);
    	}	
    }
    return '(' + stack.join("+") + ')';
}

function subtracted(args) {
    var stack = [];
    for (var i in args) {

    	if (predicates.is_object(args[i])) { 
    	    stack.push(translate.ast_to_js(args[i]));
    	} else {
    	    stack.push(args[i]);
    	}	
    }
    return '(' + stack.join("-") + ')';
}

function multiplied(args) {
    var stack = [];
    
    for (var i in args) {

    	if (predicates.is_object(args[i])) { 
    	    stack.push(translate.ast_to_js(args[i]));
    	} else {
    	    stack.push(args[i]);
    	}	
    }
    return '(' + stack.join("*") + ')';
}

function divided(args) {
    var stack = [];
    
    for (var i in args) {
    	if (predicates.is_object(args[i])) { 
    	    stack.push(translate.ast_to_js(args[i]));
    	} else {
    	    stack.push(args[i]);
    	}	
    }
    return '(' + stack.join("/") + ')';
}

function square_root(arg) {
    // will only ever be passed a single object.
    var stack = [];
    for (var i in arg) {
    	if (predicates.is_object(arg[i])) { 
    	    stack.push(translate.ast_to_js(arg[i]));
    	} else {
    	    stack.push(arg[i]);
    	}	
    }
    return 'Math.sqrt(' + stack.join(' ') + ')';
}

function exponent(args) {
    var stack = [];
    for (var i in args) {
    	if (predicates.is_object(args[i])) { 
    	    stack.push(translate.ast_to_js(args[i]));
    	} else {
    	    stack.push(args[i]);
    	}	
    }
    return 'Math.pow(' + stack.join(',') + ')';
}

function remainder(args) {
    var stack = [];
    for (var i in args) {
    	if (predicates.is_object(args[i])) { 
    	    stack.push(translate.ast_to_js(args[i]));
    	} else {
    	    stack.push(args[i]);
    	}	
    }
    return '(' + stack.join('%') + ')';
    // returns JavaScript modulo but retains the sign of the dividend
}

function modulo(operands) {
    // returns JavaScript modulo but retains the sign of the divisor
    // OLD:    var divisor_sign = (operands[1] < 1) ? 0 : 1;
    var dividend_stack = [];
    var divisor_stack = [];

    var dividend = operands[0];
    var divisor = operands[1];

    var dividend_evaluated = null;    
    var divisor_evaluated = null;    

    if (predicates.is_object(dividend)) {
	dividend_stack.push(translate.ast_to_js(dividend));
    } else {
	dividend_stack.push(dividend);
    }
    if (predicates.is_object(divisor)) {
	divisor_stack.push(translate.ast_to_js(divisor));
    } else {
	divisor_stack.push(divisor);
    }
    divisor_evaluated = '(' + divisor_stack.join('') + ')';
    dividend_evaluated = '(' + divisor_stack.join('') + ')';
    
    // need to use eval
    if (parseFloat(divisor_evaluated) > 0) {
	return 'Math.abs(' + dividend_evaluated + '%' + divisor_evaluated + ')';
    } else {
	return '(-1 * Math.abs(' + dividend_evaluated + '%' + divisor_evaluated + '))';
    }
}

var math = {
    '+': added,
    '-': subtracted,
    '*': multiplied,
    '/': divided,
    'sqrt': square_root,
    'expt': exponent,
    'remainder': remainder,
    'modulo': modulo
};

exports.math = math;
