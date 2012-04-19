// parser.js
// Functions to create an abstract syntax tree from an array of Scheme tokens.

var predicates = require('./predicates.js');
var assert = require('assert');
var lexer = require('./lexer.js');
var tokenize = lexer.tokenize;
var print = console.log;

function separate_sexps(tokens) {
    // parse a token array that contains several, non-nested s-expressions.
    // return all top-level s-expressions, each in an Array, in a single Array. 
    var i;
    var tmp_stack = [];
    var stack_stack = [];
    var stack_depth = 0;

    for (i=0; i<tokens.length; i++) {
        if (predicates.is_lparen(tokens[i])) { // entering new depth
            stack_depth += 1;
            tmp_stack.push(tokens[i]);
            continue;
        } else if (predicates.is_rparen(tokens[i])) { 
            tmp_stack.push(tokens[i]);
            stack_depth -= 1; 

            if (stack_depth === 0) { // leaving top-level s-exp
                stack_stack.push(tmp_stack);
                tmp_stack = [];
                continue;
            }
            continue;
        }
        tmp_stack.push(tokens[i]);
    }
    return stack_stack;
}

var parse_statement = function (tokens) {
    // given a list of tokens representing a single top-level expression, create an AST    
    // TODO: - handle null terminated lists and dotted pairs
    //       - Quoting
    //       - backquotes and escaping
    //       - strings 
    var ast_stack = {};
    var stack_depth = 0;
    var i;
    
    var inside_backquote_sexp = false; // true when in a backquoted s-expression
    var backquoted_depth = 0;
    
    var inside_escaped_sexp = false;
    var escaped_depth = 0;
    
    var backquoted_var = false;
    var escaped_var = false;

    for (i=0; i<tokens.length; i++) {
	if (predicates.is_backquote(tokens[i])) {
	    // backquoted expression capture
	    if (predicates.is_lparen(tokens[i+1])) {
		inside_backquote_sexp = true;
	    } else {
		backquoted_var = true;
	    }
	    stack_depth += 1;
	    backquoted_depth += 1;
            ast_stack[stack_depth] = ['BACKQUOTE'];
	    
	} else if (predicates.is_lparen(tokens[i])) { // entering new depth
            if (stack_depth < 0) {
                throw new Error('unbalanced paren within: ' + tokens);
            }
	    if (inside_backquote_sexp) {
		backquoted_depth += 1;
	    }
	    stack_depth += 1;
	    ast_stack[stack_depth] = [];
	
	} else if (predicates.is_rparen(tokens[i])) { // leaving depth
	    if (stack_depth > 1) {
		if (inside_backquote_sexp) {
		    // final depth within backquoted expression
		    if (backquoted_depth === 2) {
			// end of backquoted s-expression
			ast_stack[stack_depth].push(null); 
			ast_stack[stack_depth - 1].push(ast_stack[stack_depth]);
			delete ast_stack[stack_depth];
			stack_depth -=1;
			inside_backquote_sexp = false;
			backquoted_depth = 0;
			// add backquoted Array to the stack
			ast_stack[stack_depth - 1].push(ast_stack[stack_depth]);
			delete ast_stack[stack_depth];
			stack_depth -=1;
		    } else {
			ast_stack[stack_depth - 1].push(ast_stack[stack_depth]);
			delete ast_stack[stack_depth];
			backquoted_depth -= 1;
			stack_depth -= 1;
		    }
		} else if (predicates.is_dotted_pair(ast_stack[stack_depth])) { 
                    // push dotted pair to stack
                    ast_stack[stack_depth - 1].push(ast_stack[stack_depth]); 
                    delete ast_stack[stack_depth];
                    stack_depth -= 1;
		} else {
                    ast_stack[stack_depth].push(null);
		    ast_stack[stack_depth - 1].push(ast_stack[stack_depth]);      
		    delete ast_stack[stack_depth];
		    stack_depth -= 1;
		}
		
	    } else { // end of a s-expression
                ast_stack[stack_depth].push(null);
            }
        } else {
	    // check for comma escaped expressions inside a backquote
	    if (inside_backquote_sexp) {
		if (predicates.is_comma(tokens[i])) {
		    stack_depth += 1;
		    backquoted_depth += 1;
		    ast_stack[stack_depth] = ['COMMA'];
		    if (predicates.is_lparen(tokens[i+1])) {
			inside_escaped_sexp = true;
		    } else {
			escaped_var = true;
		    }
		} else if (escaped_var) { 
		    ast_stack[stack_depth].push(tokens[i]); 
		    ast_stack[stack_depth - 1].push(ast_stack[stack_depth]);
		    delete ast_stack[stack_depth];
                    stack_depth -= 1; 
		    backquoted_depth -= 1; 
		    escaped_var = false; 
		} else { // inside backquote with a symbol
		    ast_stack[stack_depth].push(tokens[i]);
		} 
	    } else {
		ast_stack[stack_depth].push(tokens[i]);
	    }
        }
    }
    return ast_stack[stack_depth];
};

function parse(tokens) {
    // return an array of ast objects from any scheme tokens
    var ast_list = []; 
    var i; // counter 
    var separate_statements = separate_sexps(tokens); // separate statements in Arrays
    for (i=0; i<separate_statements.length; i++) {
        ast_list.push(parse_statement(separate_statements[i]));
    }
    return ast_list;
};

exports.separate_sexps = separate_sexps;
exports.parse = parse;

////////////////////////////////////////////////////////////////////////////////


