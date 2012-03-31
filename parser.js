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
function ast_to_js(sexp, env) {
    // TODO: - use is_within_env instead of a series of ifs
    //       - lowercase the car(sexp)
    //       - if an atom or a sexp is quoted ['QUOTE', 9] <= '9 and ['QUOTE', [9, 4, null]] <= '(9 4)
    console.log('SEXP in define', sexp);
    console.log('ENV in define', env);
    if (predicates.is_array(sexp)) {
	if (bindings[car(sexp)]) {
	    console.log('RETURNING BINDINGS CALL', sexp);
	    return bindings[car(sexp)](cdr(sexp));
	} else if (form_handlers[car(sexp)]) {
	    return form_handlers[car(sexp)](cdr(sexp));
	} else if (((sexp.length === 2)) && (sexp[1] === null)) {
	    console.log('sexp.length == 2 and the second elem is null', sexp);
	    // a list of one value, not in ENV
	    return ast_to_js(car(sexp), ENV);
	}
	
	throw new Error('in ' + sexp + ' ' + car(sexp) + ' not supported');
    } else if (bindings[sexp]) {  // TODO: look in `env` bindings first? or 
	return bindings[sexp]; // return the bound value
    } else {
	console.log("RETURNING sexp", sexp);
	return sexp; // not in bindings, so return the value
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
    expression += 'function () { if (' + ast_to_js(conditional, ENV) + ') { return ' + ast_to_js(texp, ENV) + '; }'; // using global if
    expression += ' else { return ' + ast_to_js(fexp, ENV) + '; }}()'; // using global ENV
    return expression;
}
				   
function define(cdr_define) { // pass env to define???
    
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
	expression += 'return ' + ast_to_js(procedure_expr, null) + ';'; // not using global ENV
	expression += '}';
	add_binding_procedure(procedure_name, ENV); // using global ENV
	return expression + ';';

    } else if (predicates.is_string(car(cdr_define))) {
	// we are defining something that accepts zero arguments
	procedure_name = car((cdr_define));
	console.log("procedure name:", procedure_name);
	procedure_expr = cdr(cdr_define);

	expression += 'var ' + procedure_name + ' = ';
	if (is_within_env(car(procedure_expr))) { // if car expression is in env, pass procedure to ast_to_js
	    expression += ast_to_js(procedure_expr, null); // not using ENV
	} else { // otherwise it's a var
	    console.log("expression:", expression);
	    console.log("procedure expression:", procedure_expr);
	    
	    expression += car(procedure_expr);
	}
	add_binding_var(procedure_name, ast_to_js(procedure_expr, null), ENV); // not using ENV in ast_to_js but placing variable into ENV
	console.log('returning expression in define: ', expression);
	return expression + ';';
    }
    return '';
};

function translate_cons(cdr_cons) {
    var first = car(cdr_cons);	
    var first_checked; // check quote status
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
	first_checked = ast_to_js(first, null); // not using ENV
    }
    if (predicates.is_quoted(second)) {
	if (predicates.is_array(cdr(second))) {
	    second_checked = car(cdr(second));	    
	} else {
	    second_checked = cdr(second);	    
	}
    } else {
	second_checked = ast_to_js(second, null); // not using ENV
    }
    if (predicates.is_array(second_checked)) {
	result = cons(first_checked, second_checked);
	return scheme_data_to_js(result); // if this is not to be evaled
    } else {
	// if this is not to be evaled
	return scheme_data_to_js([first, second]); // a dotted pair
    }
}

var ENV = {
    // bindings for debugging backquote behavior
    // x: 8,
    // y: 92, 
    // z: "cloud"
};

var form_handlers = {
    define: define,
    'if': translate_if,
    cons: translate_cons // cons scheme to Javascript. cons() works on the AST but translate_cons is for returning scheme data
};

var bindings = {
    '+': generate_math_operator("+"),
    '-': generate_math_operator("-"),
    '*': generate_math_operator("*"),
    '/': generate_math_operator("/"),
    '<': generate_compare('<'),
    '>': generate_compare('>'),
    '>=': generate_compare('>='),
    '<=': generate_compare('<='),
};

function add_binding_procedure(name, binding) {
    // TODO: do not allow rebinding of builtins???
    binding[name] = local_procedure(name);
}

function add_binding_var(name, value, binding) {
    binding[name] = value;
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
	// statement += predicates.is_array(first) ? ast_to_js(first) : first;
	statement += ast_to_js(first, ENV); // use ENV

	for (i=1; i<args.length; i++) {
	    tmp = predicates.is_array(args[i]) ? ast_to_js(args[i], ENV) : args[i]; // ENV
	    if (i === (args.length - 1)) {
		if (predicates.is_null(tmp)) {
		    break;
		} else if (predicates.is_array(tmp)) {
		    statement += (op + ast_to_js(last, ENV)); // global ENV
		} else {
		    throw new Error(args[i] + ', last item in a list, is not an s-expression or null');
		}
		break;
	    } // not at last arg
	    // support variables that are dynamically loaded into `bindings`
	    console.log("THIS IS TMP", tmp);
	    if (bindings[tmp]) { // not working
		console.log('Y should be here', tmp);
		statement += (op + bindings[tmp]);		
	    } else {
		console.log('Y IS HERE INSTEAD:', tmp);
		statement += (op + tmp);		
	    }
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
            first = predicates.is_array(args[i]) ? ast_to_js(args[i], null) : args[i];
            second = predicates.is_array(args[i+1]) ? ast_to_js(args[i+1], null) : args[i+1];
            if (i === arg_length - 2) { 
                if (predicates.is_null(second)) {
		    break;
		} else if (predicates.is_array(first)) {
		    statement += (op + ast_to_js(first, null)); // do not pass local ENV when creating functions
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
    // TODO: check that the quote comes at the ends of the string and that the 
    // matching groups are the same
    // replaces doubly quoted strings ( ie. '"\"string\""' becomes '"string"'
    var quote_test = /(\'\")|(\"\')|(\"\")|(\'\')/g;
    return string.replace(quote_test, '"');
}

function single_to_none(string) {
    // TODO: check that the quote comes at the ends of the string and that the 
    // matching groups are the same
    var quote_test = /(\')|(\")/g; 
    return string.replace(quote_test, '');
}

function macro_eval(node) {
    // completely evaluate an escaped expression within a backquoted s-expression
    // that is, return the value after calling `eval` from within JavaScript
    console.log("CALLING EVAL::ast_to_js on node:", node);
    return eval(ast_to_js(node), ENV); // TODO: which env to use???
}

function expandbq(bq) {
    // passed the entire backquoted object
    // ie ['define', 'a', ['COMMA', x], null] was passed in from 
    //  ['BACKQUOTE', ['define', 'a', ['COMMA', x], null]]
    // TODO: - add environment as an argument???
    console.log(bq);
    var i;
    var quoted_expression = [];
    // find unquoted symbols and expressions in the expression
    for (i=0;i<bq.length;i++) {
	console.log("bq[i]", bq[i]);
	var elem = bq[i];
	if (predicates.is_array(elem)) { // sexp
	    if (predicates.is_comma_escaped(elem)) { 
		console.log("IS COMMA ESCAPED", elem);
		quoted_expression.push(macro_eval(car(cdr(elem)))); // eval escaped sexps, containing bound variables
	    } else { // this node is still backquoted
		quoted_expression.push(expandbq(elem));
	    }
	    
//	    } else if (predicates.is_backquoted(elem)) {
//		quoted_expression.push(expandbq(cdr(elem))); // expand double backquotes
	} else {
	    quoted_expression.push(elem);
	}
    }
    return quoted_expression;
}

// '`(define a ,x)';
// var bq1 = ['BACKQUOTE', ['define', 'a', ['COMMA', 'x'], null] ];
// console.log(expandbq(car(cdr(bq1))));

// var bq2 = ['if', ['<', ['COMMA', 'x'], ['COMMA', ['+', 'y', 3, null]], null], 1, 0, null];    
// var expected_ouput = ['if', ['<', 8, 95, null], 1, 0, null];
// console.log(expandbq(bq2));


var ast = ['define', 'foo', 2, null];
var expected_output = "var foo = 2;";
console.log('input:', ast);                   
console.log('output 1:', ast_to_js(ast, null));
console.log('ENV', ENV);




exports.car = car;
exports.cdr = cdr;
exports.cons = cons;
exports.ast_to_js = ast_to_js;
exports.bindings = bindings;
exports.form_handlers = form_handlers;
exports.expandbq = expandbq;
exports.ENV = ENV;