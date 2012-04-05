// parser.js
// Functions to create an abstract syntax tree from an array of Scheme tokens.

var predicates = require('./predicates.js');
var assert = require('assert');
var lexer = require('./lexer.js');
var tokenize = lexer.tokenize;


function separate_sexps(tokens) {
    // parse a token array that contains several, non-nested s-expressions.
    // return individual s-expressions in an Array

    var i;
    var tmp_stack = [];
    var stack_stack = [];
    var stack_depth = 0;

    for (i=0; i<tokens.length; i++) {
        if (predicates.is_lparen(tokens[i]) && (stack_depth === 0)) { // entering new depth
            tmp_stack.push(tokens[i]);
            stack_depth += 1;
        } else if (predicates.is_rparen(tokens[i])) { // leaving depth
            tmp_stack.push(tokens[i]);
            if (stack_depth === 1) {
                stack_stack.push(tmp_stack);
                tmp_stack = [];
                stack_depth -= 1;
                continue;
            }
        } else {
            tmp_stack.push(tokens[i]);
        }
    }
    return stack_stack;
}

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
exports.parse = parse; 
exports.separate_sexps = separate_sexps;
////////////////////////////////////////////////////////////////////////////////

var input = "(define x 27)(define y 9)(+ x y)";
var tokenized_all = tokenize(input);
var separated_sexps = separate_sexps(tokenized_all);



console.log(tokenized_all);
console.log(separated_sexps);

