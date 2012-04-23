// translate.js
// Functions to create an abstract syntax tree from an array of Scheme tokens.

var predicates = require('./predicates.js');
var assert = require('assert');
var lexer = require('./lexer');
var tokenize = lexer.tokenize;
var parser = require('./parser');

// debugging
var print = console.log;

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
// 
function ast_to_js(sexp, env) {
    // TODO: - use is_within_env instead of a series of ifs
    //       - lowercase the car(sexp)
    //       - if an atom or a sexp is quoted ['QUOTE', 9] <= '9 and ['QUOTE', [9, 4, null]] <= '(9 4)
    var i; // for loop counter
    var tmp_js = []; // placeholder for evaluated JS

//    debugger;
    if (predicates.is_array(sexp)) {
	if (bindings[car(sexp)]) {

	    return bindings[car(sexp)](cdr(sexp), env); // Added env to bindings in generate math_operator
	} else if (((sexp.length === 2)) && (sexp[1] === null)) { // a list of one value, not in bindings
	    return ast_to_js(car(sexp), env);
	} else if (env.hasOwnProperty(car(sexp))) {

            // if this is an expression and car(sexp) is in env, pass as a procedure
            if (env[car(sexp)] === "tmp") { // function calling itself
                // multiple arguments to function calling itself recursively
                if (cdr(sexp).length > 2) {
                    for (i=0; i<cdr(sexp).length; i++) {
                        if (cdr(sexp)[i] === null) {
                            continue;
                        } else {
                            tmp_js.push(ast_to_js(cdr(sexp)[i], env));
                        }
                    }
                    return car(sexp) + "(" + tmp_js.join(",") + ")";
                }
                // a single argument
                return car(sexp) + "(" + ast_to_js(car(cdr(sexp)), env) + ")";

            } else {

                return env[car(sexp)](cdr(sexp), env); // NEEDS TESTS!!!
            }
        } else if (bindings.hasOwnProperty(car(car(sexp)))) { // probably a lambda with arguments
            return bindings[car(car(sexp))](car(sexp), env, cdr(sexp));
        } else {
	    throw new Error('in ' + sexp + ' ' + car(sexp) + ' not supported');
        }
    } else if (env.hasOwnProperty(sexp)) {
        return sexp; // return the variable name; value is in env
    } else if (predicates.is_number(sexp)) {
        return sexp;
    } else if (predicates.is_quoted_twice(sexp)) {
        return sexp; // a string???
    } else if (sexp === null) {
        return '';
    } else {
        //        return "TYPE NOT FOUND";
        return sexp;  
    }
}

function translate_let(lexp, env) {
    // has to return last value
    var local_bindings = car(lexp);
    var expression_list = cdr(lexp);
    var i; // index for each elem in local_bindings and expression_list
    var let_expression = 'function() {';
    var vinit;
    for (vinit in local_bindings) {
        if (local_bindings[vinit] !== null) {
            local_bindings[vinit].unshift('define');
            let_expression += ast_to_js(local_bindings[vinit], env);
        }
    }
    // evaluate expression
    for (i=0; i<expression_list.length - 1; i++) {
        if (i === (expression_list.length - 2)) {
            let_expression += "return " + ast_to_js(expression_list[i], env) + ";";
        } else {
            let_expression += ast_to_js(expression_list[i], env) + ";";
        }
    }
    return let_expression;
}

function lambda(lexp, env, lambda_args) { 
    // lambda in bindings
    var lambda_statement = ''; // the JavaScript translation
    var lambda_expression; // the lambda expression 
    var lambda_var_args; // the variable arguments passed to lambda statement
    var i; // lambda variable argument counter
    lambda_statement += 'function';
    lambda_expression = car(cdr(cdr(lexp)));
    debugger;
    if (lambda_args === undefined) { // passed lexp w/o passed in values per arg
        lambda_expression = car(cdr(lexp));
        lambda_var_args = car(lexp);
        if ((car(lambda_var_args) === null) && (lambda_var_args.length === 1)) {
            lambda_statement += "()";            
        } else {
              lambda_statement += "(" + list_arguments(lambda_var_args) + ")";
        }
        lambda_statement += "{ return " + ast_to_js(lambda_expression, env) + '};';	
        return lambda_statement;
    } else { // lambda is passed in arguments
        lambda_expression = car(cdr(cdr(lexp)));
        lambda_var_args = car(cdr(lexp));
        lambda_statement += "(" + list_arguments(lambda_var_args) + ")";
        lambda_statement += "{ return " + ast_to_js(lambda_expression, env) + "}(" + list_arguments(lambda_args) + ");";
        return lambda_statement;
    }
}

function is_within_env(arg, env) { // WARNING, MAY FAIL; needs refactor where called
    return (bindings[arg] || env[arg]);
}

function list_arguments() {
    // given an ast, output the values joined with ','. exluding null, which should be
    // the last element of the ast.
    var args_with_commas;
    var arg_list = arguments[0];
    if (arg_list[(arg_list.length - 1)] === null) {
	arg_list.pop();// remove null 
        if (arg_list.length === 1) {
            return arg_list[0];
        } else {
	    args_with_commas = arg_list.join(', ');
        }
    }
    return args_with_commas;
}

function translate_if(cdr_if, env) {
    var conditional = car(cdr_if);
    var expression = '';
    var fexp = car(cdr(cdr(cdr_if)));
    var texp = car(cdr(cdr_if));
    expression += 'function () { if (' + ast_to_js(conditional, env) + ') { return ' + ast_to_js(texp, env) + '; }'; 
    expression += ' else { return ' + ast_to_js(fexp, env) + '; }}()'; 
    return expression;
}
				   
function define(cdr_define, env) {
    // passed the cdr of the define s-expression and the environment
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
	env[procedure_name] = 'tmp';
	expression += 'return ' + ast_to_js(procedure_expr, env) + ';'; 
	expression += '}';
	add_binding_procedure(procedure_name, env); 
	return expression + ';';
    } else if (predicates.is_string(car(cdr_define))) {


	// we are defining something that accepts zero arguments

        
	procedure_name = car((cdr_define));
	procedure_expr = cdr(cdr_define);
	expression += 'var ' + procedure_name + ' = ';
	if (is_within_env(car(car(procedure_expr)), env)) { // if car expression is in env, pass procedure to ast_to_js

	    expression += ast_to_js(car(procedure_expr), env);
	} else { // otherwise a var

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

var bindings = {
    '+': generate_math_operator("+"),
    '-': generate_math_operator("-"),
    '*': generate_math_operator("*"),
    '/': generate_math_operator("/"),
    '<': generate_compare('<'),
    '>': generate_compare('>'),
    '>=': generate_compare('>='),
    '=': generate_compare('==='),
    '<=': generate_compare('<='),
    lambda: lambda,
    'BACKQUOTE': expand_vars,
    'let': translate_let,
    define: define,
    'if': translate_if,
    cons: translate_cons // cons scheme to Javascript. cons() works on the AST but translate_cons is for returning scheme data
};

function add_binding_procedure(name, binding) {
    // TODO: do not allow rebinding of builtins???
    binding[name] = local_procedure(name);
}

function add_binding_var(name, value, binding) {
    binding[name] = value;
}

function local_procedure(name) { 
    return function(args, env) {
        // TODO: ast_to_js over each args???
	var function_call = '';
	var i = 0;
	function_call += name;
	function_call += '(';

        function_call += list_arguments(args);

        function_call += ');';

	// function_call += '(';
	// for (i; i<arguments.length; i++) {
	//     args.push(arguments[i]);
	// }
	// function_call += args.join(', ');
	// function_call += ');';

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
    return function (args, env) {
        var first;
        var i = 0;
        var arg_length = args.length;
        var second;        
        var statement = '';
	assert.deepEqual(true, (args.length >= 2));
 	do {
            first = predicates.is_array(args[i]) ? ast_to_js(args[i], env) : args[i];
            second = predicates.is_array(args[i+1]) ? ast_to_js(args[i+1], env) : args[i+1];
            if (i === arg_length - 2) { 
                if (predicates.is_null(second)) {
		    break;
		} else if (predicates.is_array(first)) {
		    statement += (op + ast_to_js(first, env)); 
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
            if (predicates.is_array(car(cdr(node)))) { // is expression?
                return expand_vars(car(cdr(node)), env);
            } else if (env.hasOwnProperty(car(cdr(node)))) { // symbol in env?
                return env[car(cdr(node))];
            } else {
                expanded_node.push(car(cdr(node)));
            }
        } else { // not escaped, but still an array so iterate over and expand vars
            for (i=0; i<node.length; i++) { 
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

function schript(text) {
    // given Scheme, output JavaScript
    var i; // counter 
    var LOCAL_ENV = {}; // the local environment
    var tokens = tokenize(text); // all tokens
    var sexps = parser.parse(tokens); // Arrays s-exps as tokens

    var JS = '';
    for (i=0; i< sexps.length; i++) {
        JS += ast_to_js(sexps[i], LOCAL_ENV) + '\n';
    }
    
    return JS;
}

exports.schript = schript;
exports.expand_vars = expand_vars;
exports.ast_to_js = ast_to_js;

////////////////////////////////////////////////////////////////////////////////

var input = "(define (addall x y z) (+ x y z))(addall 1 2 3)";
// var input = "(define a (* 88 3))";
// var expected_ouput = "var a = (88*3);";
// print(expected_ouput);
print(schript(input));