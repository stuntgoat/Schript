// parser.js
// Functions to create an abstract syntax tree from an array of Scheme tokens.
// exports: parse
// TODO: 

var predicates = require('./predicates.js');
var assert = require('assert');

// null 'equals' [], that is they should be interchangable

// ("cat")
var string_cat = [['STRING', 'cat'], null];

// '(a 7 "cat") => (a 7 "cat") when evaled at repl
var cat = ['QUOTE', ['a', 7, ['STRING', 'cat'], null]];

// ('a 7 "cat") // an error
var unquoted_cat =  [['QUOTE', 'a'], 7, ['STRING', 'cat'], null];

// (+ 5 6 (- 8 3))
var arith_1 = ['+', 5, 6, ['-', 8, 3, null], null];

// ((lambda (x) (* x x)) 2)
var lambda_1 = [['lambda', ['x', null], ['*', 'x', 'x', null]], 2, null];

// (lambda () (* 90 3))
var lambda_2 = ['lambda', [null], ['*', 90, 3, null], null];

// (list 2 4 5)
var list_1 = ['list', 2, 4, 5, null];


////////////////////////////////////////////////////////////////////////////////
// for traversing the AST
function car(sexp) {
    if (sexp.length) {
	return sexp[0];
    } else {
	return false;
    }
}

function cdr(sexp) {
    var cdr_sexp;
    if (sexp.length >= 2) {
	cdr_sexp = sexp.slice();
	cdr_sexp.splice(0, 1);
	return cdr_sexp;
    } else {
	return false;
    }
}
function cons(exp1, exp2) {
    // returns a new copy of the consed pair
    var new_exp;
    if (predicates.is_array(exp2)) {
	new_exp = exp2.slice();
	new_exp.unshift(exp1);
	return new_exp;
    } else {
	return false;
    }
}
////////////////////////////////////////////////////////////////////////////////
function ast_to_js(sexp) {
    // TODO: - use is_within_env instead of a series of ifs
    //       - lowercase the car(sexp)
    //       - if an atom or a sexp is quoted ['QUOTE', 9] <= '9 and ['QUOTE', [9, 4, null]] <= '(9 4)
    console.log('AST_TO_JS:', sexp);
    if (predicates.is_array(sexp)) {
	if (bindings[car(sexp)]) {
	    return bindings[car(sexp)](cdr(sexp));
	} else if (form_handlers[car(sexp)]) {
	    return form_handlers[car(sexp)](cdr(sexp));
	} else if (((sexp.length === 2)) && (sexp[1] === null)) {
	    // a list of one value, not in ENV
	    return ast_to_js(car(sexp));
	}
	throw new Error('in ' + sexp + ' ' + car(sexp) + ' not supported');
    } else { // not an expression so return the value
	console.log("NOT AN EXPRESSION: ", sexp);
	return sexp;
    }
}

function unquote_symbols(string) {
    var expression = '';
    var current_stack = [];
    var i;
    var split_string = string.split('');
    for (i=0; i<split_string.length; i++) {
	// if item has quotes, remove them or leave them based on 2 conditions.
	// use predicates
    }
    return expression;
}

////////////////////////////////////////////////////////////////////////////////
function scheme_data_to_js(scheme_data) {
    // return the unevaluated Scheme data as JavaScript data
    // print identifiers as they are
    // TODO: print quoted identifiers
    // print Scheme strings as quoted strings
    // recursively traverse tree and unquote strings for JavaScript representation after JSON.stringify is called
    var i;
    var output = '[';
    var tmp = [];
    for (i=0; i<scheme_data.length; i++) {
	if (predicates.is_array(scheme_data[i])) {
	    tmp.push(scheme_data_to_js(scheme_data[i]));
	} else if ( (i == (scheme_data.length - 1)) && predicates.is_null(scheme_data[i])) {
	    tmp.push('null');
	} else {
	    if (predicates.is_quoted(scheme_data[i])) {
		tmp.push(scheme_data[i]);
	    } else {
		tmp.push(scheme_data[i].toString());		
	    }
	}
    }
    output += tmp.join(",");
    output += "]";
    return output;
    
    // parse out the quotes unless the string is quoted. That is,
    // if a string is quoted with one quote on each end, remove them because
    // this string is not meant to be quoted- it is meant to be a symbol ( a variable in ENV )
    

};

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

function quote() {

}

function translate_if(cdr_if) {
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
	add_binding_procedure(procedure_name);
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
	add_binding_var(procedure_name, ast_to_js(procedure_expr));
	return expression + ';';
    }
    return '';
};

function translate_cons(cdr_cons) {
    console.log('cdr_cons @ beginning of translate_cons: ', cdr_cons);
//    var first = cdr_cons[0];
    var first = car(cdr_cons);	
    var first_checked; // check quote status
    //     var second = cdr_cons[1];
    var second = car(cdr(cdr_cons)); 
    var second_checked; // check quote status
    var result;

    if (predicates.is_quoted(first)) { // eval each argument, unless quoted
	if (predicates.is_array(cdr(first))) { 
	    first_checked = car(cdr(first));	    
	} else {
	    first_checked = cdr(first);	    
	}
    } else {
	first_checked = ast_to_js(first);
    }
    if (predicates.is_quoted(second)) {
	console.log("second is quoted", cdr_cons);
	if (predicates.is_array(cdr(second))) {

	    second_checked = car(cdr(second));	    
	    console.log("cdr(second) is array", cdr_cons);
	} else {
	    second_checked = cdr(second);	    
	    console.log("cdr(second) is NOT array", cdr_cons);
	}
    } else {
	console.log("second is NOT quoted", cdr_cons);
	second_checked = ast_to_js(second);
    }
    if (predicates.is_array(second_checked)) {
	result = cons(first_checked, second_checked);
	return scheme_data_to_js(result);
    } else {
	return scheme_data_to_js([first, second]);	    
    }
}

var ENV = {
};

var form_handlers = {
    define: define,
    'if': translate_if,
    cons: translate_cons
};

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

function add_binding_procedure(name) {
    // TODO: do not allow rebinding of builtins???
    bindings[name] = local_procedure(name);
}

function add_binding_var(name, value) {
    bindings[name] = value;
}

function local_procedure(name) { 
    return function() {
	var function_call = '';
	var i = 0;
	var args = [];
	function_call += name;
	function_call += '(';
	for (i; i<arguments.length; i++) {
	    args.push(arguments[i]);
	}
	function_call += args.join(', ');
	function_call += ');';
	return function_call;
    };
}

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

function double_to_single_quoted(string) {
    // replaces doubly quoted strings ( ie. '"\"string\""' becomes '"string"'
    var quote_test = /(\'\")|(\"\')|(\"\")|(\'\')/g;
    return string.replace(quote_test, '"');
}

function single_to_none(string) {
    var quote_test = /(\')|(\")/g;
    return string.replace(quote_test, '');
}

// (+ 5 2 (- 3 6 8))
var arith_2 = ['+', 5, 2, ['-', 3, 6, 8, null], null];
var arith_3 = ['<', 1, 2, ['+', 3, 4, null], null];

exports.car = car;
exports.cdr = cdr;
exports.cons = cons;
exports.ast_to_js = ast_to_js;
exports.bindings = bindings;
exports.form_handlers = form_handlers;

// (cons (list 9 7) (list 8 3 4 5)) => ((9 7) 8 3 4 5) -> [[9, 7, null], 8, 3, 4, 5, null]

// (cons 4 '(9)) =SCHEME> (4 9) -AST> ['cons', 4, ['QUOTE', [9, null]], null] -JS> [4, 9];
// var cons_1 = ['cons', 4, ['QUOTE', [9, null]], null];
// console.log("scheme: (cons 4 '(9))");
// console.log("AST: ", cons_1);
// console.log("translation: ", ast_to_js(cons_1));

// console.log('\n');
// var cons_2 = ['cons', 9, 0, null];
// console.log("(cons 9 0)");
// console.log("AST: ", cons_2);
// console.log("translation: ", ast_to_js(cons_2));

// console.log('\n');
// var cons_3 = ['cons', ['QUOTE', 'hammer'], ['QUOTE', [0, 4, null]], null];

// console.log("AST: ", cons_3);
// console.log("translation: ", ast_to_js(cons_3));
// console.log("translation 2: ", ast_to_js(cons_3));
// // console.log('\n');
// // console.log("example Scheme: (cons \"hammer\" '(0 4))");
// // var cons_4 = ['cons', '"hammer"', ['QUOTE', [0, 4, null]], null];
// // console.log("AST: ", cons_4);
// // console.log("translation: ", ast_to_js(cons_4));


console.log('\n');
console.log("example Scheme: (cons \"hammer\" '(0 4))");
var cons_4 = ['cons', '"hammer"', ['QUOTE', [0, 4, null]], null];
console.log("AST: ", cons_4);
console.log("translation: ", ast_to_js(cons_4));
console.log("translation 2: ", ast_to_js(cons_4));
