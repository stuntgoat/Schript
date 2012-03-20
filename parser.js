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


// ((lambda (x) (* x x)) 2)
var lambda_1 = [['lambda', ['x', null], ['*', 'x', 'x', null]], 2, null];

// (lambda () (* 90 3))
var lambda_2 = ['lambda', [null], ['*', 90, 3, null], null];

// (list 2 4 5)
var list_1 = ['list', 2, 4, 5, null];
// eval(cons(2, cons(4, cons(5, null)

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
    if (predicates.is_array(sexp)) {
	if (bindings[car(sexp)]) {
	    return bindings[car(sexp)](cdr(sexp));
	} else if (form_handlers[car(sexp)]) {
	    // pass to form handlers
	    return form_handlers[car(sexp)](cdr(sexp));
	}
	throw new Error('in ' + sexp + ' ' + car(sexp) + ' not supported');
    } else { // not an expression so return the value
	return sexp;
    }
}

function is_within_env(arg) {
    return (bindings[arg] || form_handlers[arg]);
}

function list_arguments(arguments) {
    var args_with_commas;
    if (arguments[(arguments.length - 1)] === null) {
	arguments.pop();
	args_with_commas = arguments.join(', ');
    } else {
	args_with_commas = arguments.join(', ');
    } 
    return args_with_commas;
}

function my_if(cdr_if) {
    var conditional = car(cdr_if);
    var expression = '';
    var fexp = car(cdr(cdr(cdr_if)));
    var texp = car(cdr(cdr_if));
    // console.log('conditional', conditional);console.log('true expr', texp); console.log('false expr', fexp);
    expression += 'function () { if (' + ast_to_js(conditional) + ') { return ' + ast_to_js(texp) + '; }';
    expression += ' else { return ' + ast_to_js(fexp) + '; }}()';
    return expression;
}

function define(cdr_define) {
    var expression = '';
    var procedure_args;
    var procedure_expr;
    var procedure_name;
    // variable and expression/value or (function arguments) expression
    if (predicates.is_array(car(cdr_define))) {
	// we are defining a procedure that takes args
	procedure_name = car(car(cdr_define));
	procedure_args = cdr(car(cdr_define));
	procedure_expr = car(cdr(cdr_define));
	expression += 'var ' + procedure_name + ' = ';
	expression += 'function ' +'(' + list_arguments(procedure_args) + ') {';
	expression += 'return ' + ast_to_js(procedure_expr) + ';';
	expression += '}';
	return expression + ';';

    } else if (predicates.is_string(car(cdr_define))) {
	// we are defining something that accepts zero arguments
	procedure_name = car((cdr_define));
	procedure_expr = cdr(cdr_define);
	expression += 'var ' + procedure_name + ' = ';
	if (is_within_env(car(procedure_expr))) { // if car expression is in env, pass procedure to ast_to_js
	    expression += ast_to_js(procedure_expr);	    
	} else { // otherwise it's a var
	    expression += car(procedure_expr);
	}
	return expression + ';';
    }
}

var form_handlers = {
    define: define,
    'if': my_if 
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
	assert.deepEqual(true, (args.length >= 3));
        var first;	
        var i;
        var last;
        var statement = '';
        var tmp;        
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
        var first;
        var i = 0;
        var arg_length = args.length;
        var second;        
        var statement = '';
	assert.deepEqual(true, (args.length >= 2));
 	do {
            first = predicates.is_array(args[i]) ? ast_to_js(args[i]) : args[i];
            second = predicates.is_array(args[i+1]) ? ast_to_js(args[i+1]) : args[i+1];
            if (i === arg_length - 2) { 
                if (predicates.is_null(second)) {
		    break;
		} else if (predicates.is_array(first)) {
		    statement += (op + ast_to_js(first));
		} else {
		    throw new Error(args[i] + ', last item in a list, is not an s-expression or null');
		}
		break;                
            }
            statement += '(' + first + ' ' + op + ' ' + second + ')';
	    i++;
	    if (i < arg_length - 2) {
                statement += ' && ';
            }
        } while (i < arg_length - 1)
        return statement;
    };
}

// (+ 5 2 (- 3 6 8))
var arith_2 = ['+', 5, 2, ['-', 3, 6, 8, null], null];
var arith_3 = ['<', 1, 2, ['+', 3, 4, null], null];

exports.car = car;
exports.cdr = cdr;
exports.cons = cons;
exports.ast_to_js = ast_to_js;

// // (define foo 2)
// var define_1 = ['define', 'foo', 2, null];
// console.log(ast_to_js(define_1));

// // (define (sqr_me x) (* x x))
// var define_2 = ['define', ['sqr_me', 'x', 'y', 'z', null], ['*', 'x', 'y', null], null];
// console.log(ast_to_js(define_2));

// var if_1 = ['if', ['<', 2, 5, 8, null], 0, 1, null];
// console.log(my_if(cdr(if_1)));