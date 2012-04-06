// translate.js
// Functions to create an abstract syntax tree from an array of Scheme tokens.
// exports: parse
// TODO: 


var predicates = require('./predicates.js');
var assert = require('assert');

var lexer = require('./lexer');
var tokenize = lexer.tokenize;
var parser = require('./parser');

// null 'equals' [], that is they should be interchangable

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
    if (predicates.is_array(sexp)) {
	if (bindings[car(sexp)]) {
	    return bindings[car(sexp)](cdr(sexp), env); // Added env to bindings in generate math_operator
	} else if (form_handlers[car(sexp)]) {
	    return form_handlers[car(sexp)](cdr(sexp), env);
	} else if (((sexp.length === 2)) && (sexp[1] === null)) {
	    // a list of one value, not in bindings
	    return ast_to_js(car(sexp), env);
	} else if (env.hasOwnProperty(car(sexp))) {
            // if this is an expression and car(sexp) is in env, pass as a procedure
            return env[car(sexp)](cdr(sexp), env); // NEEDS TESTS!!!
        } else {
	throw new Error('in ' + sexp + ' ' + car(sexp) + ' not supported');
        }

    } else if (env.hasOwnProperty(sexp)) {
        console.log("env.hasOwnProperty(sexp)", sexp);
        return sexp; // return the variable name; value is in env
    } else if (predicates.is_number(sexp)) {
        console.log("predicates.is_number(sexp)", sexp);
        return sexp;
    } else if (predicates.is_quoted_twice(sexp)) {
        console.log("predicates.is_quoted_twice(sexp)", sexp);
        return sexp; // a string???
    } else {
//        return "TYPE NOT FOUND";
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
    // this string is not meant to be quoted- it is meant to be a symbol ( eg within an environment context )
};

function is_within_env(arg, env) { // WARNING, MAY FAIL; needs refactor where called
    return (bindings[arg] || form_handlers[arg] || env[arg]);
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

function translate_if(cdr_if) {
    var conditional = car(cdr_if);
    var expression = '';
    var fexp = car(cdr(cdr(cdr_if)));
    var texp = car(cdr(cdr_if));
    // console.log('conditional', conditional);console.log('true expr', texp); console.log('false expr', fexp);
    expression += 'function () { if (' + ast_to_js(conditional, {}) + ') { return ' + ast_to_js(texp, {}) + '; }'; 
    expression += ' else { return ' + ast_to_js(fexp, {}) + '; }}()'; 
    return expression;
}
				   
function define(cdr_define, env) { // pass env to define???
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
	expression += 'return ' + ast_to_js(procedure_expr, env) + ';'; 
	expression += '}';
	add_binding_procedure(procedure_name, env); 
	return expression + ';';

    } else if (predicates.is_string(car(cdr_define))) {
	// we are defining something that accepts zero arguments
	procedure_name = car((cdr_define));
	procedure_expr = cdr(cdr_define);

	expression += 'var ' + procedure_name + ' = ';
	if (is_within_env(car(procedure_expr), env)) { // if car expression is in env, pass procedure to ast_to_js
	    expression += ast_to_js(procedure_expr, env); 
	} else { // otherwise it's a var
	    expression += car(procedure_expr);
	}
	add_binding_var(procedure_name, ast_to_js(procedure_expr, env), env); 
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
	first_checked = ast_to_js(first, {}); 
    }
    if (predicates.is_quoted(second)) {
	if (predicates.is_array(cdr(second))) {
	    second_checked = car(cdr(second));	    
	} else {
	    second_checked = cdr(second);	    
	}
    } else {
	second_checked = ast_to_js(second, {}); 
    }
    if (predicates.is_array(second_checked)) {
	result = cons(first_checked, second_checked);
	return scheme_data_to_js(result); // if this is not to be evaled
    } else {
	// if this is not to be evaled
	return scheme_data_to_js([first, second]); // a dotted pair
    }
}

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
    '<=': generate_compare('<=')
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
    return function(args, env) {
	assert.deepEqual(true, (args.length >= 3));
        var first;	
        var i;
        var last;
        var statement = '';
        var tmp;        
	first = args[0];
	statement += ast_to_js(first, env);
	for (i=1; i<args.length; i++) {
	    tmp = predicates.is_array(args[i]) ? ast_to_js(args[i], env) : args[i]; 
	    if (i === (args.length - 1)) {
		if (predicates.is_null(tmp)) {
		    break;
		} else if (predicates.is_array(tmp)) {
		    statement += (op + ast_to_js(last, env));
		} else {
		    throw new Error(args[i] + ', last item in a list, is not an s-expression or null');
		}
		break;
	    } // not at last arg
	    // support variables that are dynamically loaded into `bindings`

	    if (env[tmp]) { // not working
		statement += (op + tmp);		
	    } else { // a number
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
            first = predicates.is_array(args[i]) ? ast_to_js(args[i], {}) : args[i];
            second = predicates.is_array(args[i+1]) ? ast_to_js(args[i+1], {}) : args[i+1];
            if (i === arg_length - 2) { 
                if (predicates.is_null(second)) {
		    break;
		} else if (predicates.is_array(first)) {
		    statement += (op + ast_to_js(first, {})); 
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

function expand_vars(node, env) {
    // pass iterate over each node recursively and replace symbols with 
    // values from env
    var i; // counter
    var expanded_node = []; // the evaluated node

    if (predicates.is_array(node)) {
        
        if (predicates.is_comma_escaped(node)) { //  is escaped s-exp or var
            console.log("is comma escaped", node);
            if (predicates.is_array(car(cdr(node)))) { // is expression?
                console.log("is expression ", car(cdr(node)));
//                for (i=0; i<node.length; i++) { 

                return expand_vars(car(cdr(node)), env);
                
            } else if (env.hasOwnProperty(car(cdr(node)))) { // symbol in env?
                return env[car(cdr(node))];
            } else {
                expanded_node.push(car(cdr(node)));
            }
        } else { // not escaped, but still an array so iterate over and expand vars
            for (i=0; i<node.length; i++) { 
                console.log("node[i]: ", node[i]);
                expanded_node.push(expand_vars(node[i], env));
            }
            return expanded_node;
        }

    } else if (env.hasOwnProperty(node)) { // symbol in env?
        return env[node];
    } else {
        return node;
    }
    
    return expanded_node;
}           

// //var input = ['define', 'a', ['COMMA', ['+', 'x', 99, null]], null];
//  var input = ['define', 'a', ['COMMA', 'x'], null];
// // var expected_ouput = ['define', 'a', 8, null];
// var LOCAL_ENV = {
//     x: 8
// };
// console.log("input : ", input);
// console.log("output: ", expand_vars(input, LOCAL_ENV));




// function macro_eval(node, env) {
//     // completely evaluate an escaped expression within a backquoted s-expression
//     // that is, return the value after calling `eval` from within JavaScript
//     //    console.log(node, env);
    
//     // substitute all vars with values in env
//     // fully evaluate expression to JavaScript 
//     // then eval JavaScript and return value

    
//     return eval(ast_to_js(node, env)); // TODO: which env to use???
// }
    
// function expandbq(bq, env) {
//     // passed the entire backquoted object (ast node), sans backquote identifier
//     // ie ['define', 'a', ['COMMA', x], null] was passed in from 
//     //  ['BACKQUOTE', ['define', 'a', ['COMMA', x], null]]
//     var i;
//     var quoted_expression = [];
    
//     // find unquoted symbols and expressions in the expression
//     for (i=0;i<bq.length;i++) {
// 	var elem = bq[i];
// 	if (predicates.is_array(elem)) { // sexp 
// 	    if (predicates.is_comma_escaped(elem)) { 
                
//                 // substitute all vars with values in env
                
//                 // fully evaluate expression to JavaScript 
                
//                 // then eval JavaScript and return value
                
// 		quoted_expression.push(macro_eval(car(cdr(elem)), env)); // eval escaped s-exp, with env
                
// 	    } else { // this node is still backquoted
// 		quoted_expression.push(expandbq(elem, env));
// 	    }
// 	} else { // elem is another symbol 
// 	    quoted_expression.push(elem);
//         }
//     }
//         return quoted_expression;
// }

function schript(text) {
    // given Scheme, output JavaScript
    
    var i; // counter 
    var LOCAL_ENV = {}; // the local environment
    var tokens = tokenize(text); // all tokens
    var sexps = parser.separate_sexps(tokens); // Arrays s-exps as tokens
    var JS = '';
    
    for (i=0; i< sexps.length; i++) {
        var parsed = parser.parse(sexps[i]);
        JS += ast_to_js(parsed, LOCAL_ENV) + '\n';
    }
    
    return JS;
}

exports.car = car;
exports.cdr = cdr;
exports.cons = cons;
exports.ast_to_js = ast_to_js;
exports.bindings = bindings;
exports.form_handlers = form_handlers;
// exports.expandbq = expandbq;
exports.expand_vars = expand_vars;

// var ast = ['define', 'foo', '"ham"', null];
// var expected_output = 'var foo = "ham";';
// var LOCAL_ENV = {};
// console.log('input:', ast);                   
// console.log('output 1:', ast_to_js(ast, LOCAL_ENV));
// console.log('LOCAL_ENV:', LOCAL_ENV);                   




var input = "(define x 27)(define y 9)(+ x y)";
var output = schript(input);
console.log(output);





// // ("cat")
// var string_cat = [['STRING', 'cat'], null];

// // '(a 7 "cat") => (a 7 "cat") when evaled at repl
// var cat = ['QUOTE', ['a', 7, ['STRING', 'cat'], null]];

// // ('a 7 "cat") // an error
// var unquoted_cat =  [['QUOTE', 'a'], 7, ['STRING', 'cat'], null];

// // (+ 5 6 (- 8 3))
// var arith_1 = ['+', 5, 6, ['-', 8, 3, null], null];

// // ((lambda (x) (* x x)) 2)
// var lambda_1 = [['lambda', ['x', null], ['*', 'x', 'x', null]], 2, null];

// // (lambda () (* 90 3))
// var lambda_2 = ['lambda', null, ['*', 90, 3, null], null]; // lambda passed an empty list
// var lambda_3 = ['lambda', [null], ['*', 90, 3, null], null]; // lambda passed a list of null 

// // (list 2 4 5)
// var list_1 = ['list', 2, 4, 5, null];

// TODO:
// (define m (let ((x 0)) (lambda () (set! x (+ x 1)))))
