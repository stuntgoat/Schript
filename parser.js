// parser.js
// Functions to create an abstract syntax tree from an array of Scheme tokens.
// exports: parse
var predicates = require('./predicates.js');
var assert = require('assert');

// null 'equals' [], that is they should be interchangable

// ("cat")
var string_cat = [['STRING', 'cat'], null];

// '(a 7 "cat")
var cat = ['QUOTE', ['a', 7, ['STRING', 'cat'], null]];

// ('a 7 "cat")
var unquoted_cat =  [['QUOTE', 'a'], 7, ['STRING', 'cat'], null];

// (+ 5 6 (- 8 3))
var arith_1 = ['+', 5, 6, ['-', 8, 3, null], null];

// (define foo 2)
var define_1 = ['define', 'foo', 2, null];

// ((lambda (x) (* x x)) 2)
var lambda_1 = [['lambda', ['x', null], ['*', 'x', 'x', null]], 2, null];

// (lambda () (* 90 3))
var lambda_2 = ['lambda', [null], ['*', 90, 3, null], null];

// (list 2 4 5)
var list_1 = ['list', 2, 4, 5, null];
// eval(cons(2, cons(4, cons(5, null)

// (if (< 2 5 8) 0 1)
var if_1 = ['if', ['<', 2, 5, 8, null], 0, 1, null];
// if = if eval(cadr if_node), eval(caddr), else cadddr.



function car(sexp) {
    if (sexp.length) {
	return sexp[0];
    } else {
	return false;
    }
}

function cdr(sexp) {
    var cdr_sexp;
    if (sexp.length > 2) {
	cdr_sexp = sexp.slice();
	cdr_sexp.splice(0, 1);
	return cdr_sexp;
    } else {
	return false;
    }
}

function cons(exp1, exp2) {
    if (predicates.is_array(exp2)) {
	exp2.unshift(exp1);
	return exp2;
    } else {
	return false;
    }
}

function ast_to_js(sexp) {

    if (bindings[car(sexp)]) {
	return bindings[car(sexp)](cdr(sexp));
    } else {
	// pass to form handlers
    }
    throw new Error('in ' + sexp + ' ' + car(sexp) + ' not supported');
}



var bindings = {
    '+': generate_math_operator("+"),
    '-': generate_math_operator("-"),
    '*': generate_math_operator("*"),
    '/': generate_math_operator("/"),
    '<': generate_compare('<'),
    '>': generate_compare('>'),
    '>=': generate_compare('>='),
    '<=': generate_compare('<=')
};

function generate_math_operator(op) {
    return function(args) {
	assert.deepEqual(true, (args.length >= 2));
	var i, tmp, first, last,
        statement = '',
	first = args[0];
	
	statement += predicates.is_array(first) ? ast_to_js(first) : first;
	for (i=1; i<args.length; i++) {
	    tmp = predicates.is_array(args[i]) ? ast_to_js(args[i]) : args[i];
	    if (i === (args.length - 1)) {
		if (predicates.is_null(tmp)) {
		    break;
		} else if (predicates.is_array(tmp)) {
		    statement += (op + ast_to_js(last));
		} else {
		    throw new Error(args[i] + ', last item in a list, is not an s-expression or null');
		}
		break;
	    }
	    statement += (op + tmp);
	}
	return '(' + statement + ')';
    };
}

function generate_compare(op) {  
    return function (args) {
        var res = '',
        i = 0; 
        if (args.length < 2) {
            throw new Error('too few args:');
	}
 	do {
	    res += '(' + args[i] + ' ' + op + ' ' + args[i+1] + ')';
	    i++;
	    if (i < args.length - 1) {
                res += ' && ';
            }
        } while (i < args.length - 1)
        return res;
    };
}

// (+ 5 2 (- 3 6 8))
var arith_2 = ['+', 5, 2, ['-', 3, 6, 8, null], null];
var arith_3 = ['<', 1, 2, ['+', 3, 4, null], null];

console.log(ast_to_js(arith_2));

exports.car = car;
exports.cdr = cdr;
exports.cons = cons;
exports.ast_to_js = ast_to_js;
