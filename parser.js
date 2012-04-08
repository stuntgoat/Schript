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
//    print(tokens);
    var i;
    var tmp_stack = [];
    var stack_stack = [];
    var stack_depth = 0;

    for (i=0; i<tokens.length; i++) {
        if (predicates.is_lparen(tokens[i])) { // entering new depth
            stack_depth += 1;
            tmp_stack.push(tokens[i]);
//            print("left paren: ", tokens[i]);
//            print(stack_depth);
            continue;

        } else if (predicates.is_rparen(tokens[i])) { 
            tmp_stack.push(tokens[i]); // push token to tmp_stack


//            print("right paren: ", tokens[i]); 
//            print(stack_depth);
            stack_depth -= 1; // decrement depth

            if (stack_depth === 0) { // leaving top-level s-exp
                stack_stack.push(tmp_stack); // add tmp_stack to stack_stack
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
    //       - Quoting and escaping
    var ast_stack = {};
    var stack_depth = 0;
    var i;
    for (i=0; i<tokens.length; i++) {
        if (predicates.is_lparen(tokens[i])) { // entering new depth
            if (stack_depth < 0) {
                throw new Error('unbalanced paren within: ' + tokens);
            }
            stack_depth += 1;
            ast_stack[stack_depth] = [];
        } else if (predicates.is_rparen(tokens[i])) { // leaving depth
            if (predicates.is_dotted_pair(ast_stack[stack_depth])) { // dotted pair check 
                // push dotted pair to stack
                ast_stack[stack_depth - 1].push(ast_stack[stack_depth]); 
                delete ast_stack[stack_depth];
                stack_depth -= 1;
            } else { // not a dotted pair 
                if (stack_depth > 1) {
                    ast_stack[stack_depth].push(null); // append null and push to previous stack                    
                    ast_stack[stack_depth - 1].push(ast_stack[stack_depth]);                
                    delete ast_stack[stack_depth];
                    stack_depth -= 1;
                } else { // this is the first depth and not a dotted pair
                    ast_stack[stack_depth].push(null); // append null and push to previous stack                    
                }
            } 
        } else {
            ast_stack[stack_depth].push(tokens[i]);
        }
    }
    return ast_stack[stack_depth];
};

// if number of statements is > 1, return AST from separate_sexps, else return ast from parse

function parse(tokens) {
    // return an array of ast objects from any scheme tokens
    var ast_list = []; 
    var i; // counter 
    var separate_statements = separate_sexps(tokens); // separate statements in Arrays
   // print(separate_statements);
    for (i=0; i<separate_statements.length; i++) {
        ast_list.push(parse_statement(separate_statements[i]));
    }
    return ast_list;
};

exports.parse_statement = parse; 
exports.separate_sexps = separate_sexps;
exports.parse = parse;

////////////////////////////////////////////////////////////////////////////////
// var input = "(define (recurs x) (if (= x 0) x (+ x (recurs (- x 1)))))";
// // var input = "(define (recurs x) (if (= x 0) x (+ x (recurs (- x 1)))))";
// // // var input = "(define x 27)(define y 9)(+ x y)";

// var input = "(define Y(lambda (f)((lambda (recur) (f (lambda arg (apply (recur recur) arg)))) (lambda (recur) (f (lambda arg (apply (recur recur) arg)))))))";
// // var input = "((lambda (x) (* x x)) 2))";
// // var input = "(lambda () (* 90 3))";
// // var input = "(let ((x 2) (y 3))(* x y))";
// var tokenized_all = tokenize(input);
// var ast = parse(tokenized_all);


//console.log(tokenized_all);
//console.log(JSON.stringify(ast[0]));
