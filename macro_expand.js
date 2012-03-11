// macro_expand.js

// translate the macro found within define_syntax.macro_table to valid Scheme, given the arguments

var define_syntax = require("./define_syntax.js");
var predicates = require("./predicates.js");
var macro_table = define_syntax.macro_table;
var tools = require("./tools.js");
// from Tuesday
// function macro_expand(macro_name, passed_args, ast) { 

// instead of passing the ast we will return a section of ast used to insert into the enclosing ast
// macro here will be taken from  macro_table[macro_name] in the calling module's function
// a macro object looks like this:     
// reverse: 
// { 
//     args: ["a", "b"], 
//     expression: [ '`(', ',b', ',a', ')' ]
//     }

1
// input: macro_name = 'reverse', passed_args = ["'foo'", 'length']
// ouput: {func: 'length' , args: ['"foo"']}
function macro_expand(macro_name, passed_args) { 
    var macro = macro_table[macro_name];
    var ast_chunk = {};
    var arg_pairs = pair_args(macro.args, passed_args);
    var expanded_macro = "";
    var replace_next_token = false;
    var stack = [];    
    var arg_bindings = tools.zip(macro.args, passed_args).reduce(
        function (bindings, pair) {
            bindings[pair[0]] = pair[1];
            return bindings;
        }, 
        {});

    if (macro.args.length !== passed_args.length) {
        throw "Macro: Wrong number of arguments at " + macro_name + " (Expected " +
            macro.args.length + " received " + passed_args.length + ')';
    }

    // return an expanded macro and evaluate to create an abstract syntax tree
    for (var token in macro.expression) {
        if (predicates.is_backquote(token)) {
            replace_next_token = false;
        } else if (predicates.is_comma(token)) {
            // do not add token to stack
            replace_next_token = true;
        } else if (replace_next_token) {
            
            stack.push(token);
        }
    }
    return ast_chunk;
}

// function substitute(token_table, token) {
//     // need to take &optional and &rest tokens if listed in the 
//     if (token_table[token]) {
//         return token_table[token];



// TODO: need to take &optional and &rest tokens if listed in the 
// function pair_args(macro_args, passed_args) { // each arg is a list of args

//         var pairs = {};
//     for (var i in passed_args) {
//         if (macro_args[i]) {
//             var macro_arg = macro_args[i];
//             pair[i] = { macro_arg: passed_args[i]};
//         } else {
//             pair[i] = { i: passed_args[i]};
//         }
//     }
//     return pair;
// }




function tokenize_macro_expression(expression) {
    // tokenize the Lisp style macro expression
}

exports.macro_expand = macro_expand;