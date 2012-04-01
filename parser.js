// parser.js
// Functions to create an abstract syntax tree from an array of Scheme tokens.
// exports: parse
// TODO: 

var predicates = require('./predicates.js');
var assert = require('assert');
var lexer = require('./lexer.js');

var tokenize = lexer.tokenize;

// ['/', 5, 2, null];
var div1 = '(/ 5 2)';
var div1_tokens = tokenize(div1);

// ['+', 5, 2, ['-', 3, 6, 8, null], null];
var add1 = '(+ 5 2(- 3 6 8))';
var add1_tokens = tokenize(add1);
console.log(add1_tokens);

// ['>', 3, 2, 1, 0, null];
var gt1 = '(> 3 2 1 0)';
var gt1_tokens = tokenize(gt1);



var def1 = '(define a 8)';
var def1_tokens = tokenize(def1);
// console.log(def1_tokens);
// [ '(', 'define', 'a', 8, ')' ]
// ['define', 'a', 8, null]

var parse = function (tokens) {
    // given a list of tokens, create an AST    
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

// // var add1 = '(+ 5 2(- 3 6 8))';
// console.log(parse(add1_tokens));
// console.log(parse(gt1_tokens));
// console.log(parse(def1_tokens));


// // (if (< 4 99) 1 0)
// var if1_tokens = tokenize('(if (< 4 99) 1 0)');
// console.log(parse(if1_tokens));

// var if2_tokens = tokenize('(if (< 4 99) "ham" 0)');
// console.log(parse(if2_tokens));

expected_output = ['define', ['mult_us', 'x', 'y', 'z', null], ['*', 'x', 'y', 'z', null], null];
var f1_tokens = tokenize('(define (mult_us x y z) (* x y z))');

console.log("expected: ", expected_output);
console.log("parsed  : ", parse(f1_tokens));

assert.deepEqual(parse(f1_tokens), expected_output);

exports.parse = parse; 


