// parser.js
// Functions to create an abstract syntax tree from an array of Scheme tokens.
// exports: parse
var predicates = require('./predicates.js');

function generate_math_operator(op) {
  return function(args) {
    var res = args[0], i, tmp;
    for (i=1; i<args.length; i++) {
      tmp = predicates.is_object(args[i]) ? ast_to_js(args[i]) : args[i];
      res += " " + op + " " + tmp;
    }
    return '(' + res + ')';
  };
}

function generate_compare(op) {  
    return function (args) {
        var res = '';
        var i = 0; 
        if (args.length < 2) {
            throw 'too few args';
        }
        do {
            res += '(' + args[i] + ' ' + op + ' ' + args[i+1] + ')';
            i++;
            if (i < args.length - 1) {
                res += ' && ';
            }
        } while (i < args.length - 1)
        return res;
    };
}

var bindings = {
    '+': generate_math_operator("+"),
    '-': generate_math_operator("-"),
    '*': generate_math_operator("*"),
    '/': generate_math_operator("/"),
    'list': function (args) {
        return '[' + args.toString() + ']';
    },
    '<': generate_compare('<'),
    '>': generate_compare('>'),
    '>=': generate_compare('>='),
    '<=': generate_compare('<=')

};

// (2 (6))
var conslist = [2, [6, null], null];
var m_ast = {
    form: 'normal',
    proc: {
        form: 'symbol',
        symb: '+'
    },
    args: ['5', '6', {
               form: 'normal',
               proc: {
                   form: 'symbol',
                   symb: '-'
               },
               args: ['8', '3']
           }]
};

// example of lambda:n
// ((lambda (x) (* x x)) 2)
var lambda = {
    form: "normal",
    proc: {
        form: "lambda",
        args: ["x"],
        expr: {
            form: "normal",
            proc: {
                form: "symbol",
                symb: "*"
            },
            args: ['x', 'x']
        }
    },
    args: ['2']
};

// var our_if = {
//     form: 'if',
//     cond: {
//         form:

// }

function ast_to_js(node) {
    return form_handlers[node.form](node);
}

//    return form_handlers[node.form](node);

var form_handlers = {
    normal: function (node) {
        if (node.proc.symb) {
        return bindings[node.proc.symb](node.args);
        } else {
            return '(' + ast_to_js(node.proc) + ')(' + node.args.toString() + ')';
        }
    },
    lambda: function (node) {
        return 'function (' + node.args.toString() + ') { return ' + ast_to_js(node.expr) + ';}';
    },
    'if': function (node) {
        return '(function ('
    
    }
};

var lam = {
        form: "lambda",
        args: [],
        expr: {
            form: "normal",
            proc: {
                form: "symbol",
                symb: "*"
            },
            args: ['90', '3']
        }
};

console.log(ast_to_js(lam));
var m = "(+ 5 6 (- 8 3))";

var list_ast = {
    form: 'normal',
    proc: {
        form: 'symbol',
        symb: 'list'
    },
    args: ['2', '4', '6']
};






// var predicates = require('./predicates.js');

// function pre_parse(tokenized) {
//     // Accepts: an array of Scheme tokens. Returns: a JavaScript array of Scheme
//     //  functions and arguments; arguments that are other s-expressions will be
//     // nested JavaScript arrays.
//     var depth = 0;
//     var stack = {};
//     for (var i in tokenized) {
// 	if (predicates.is_lparen(tokenized[i])) {
// 	    depth += 1;
// 	    stack[depth] = [];
// 	} else if (predicates.is_rparen(tokenized[i])) {
// 	    if (depth !== 1) {
// 		stack[depth-1].push(stack[depth]);
// 		delete stack[depth];
// 		depth -=1;		
// 	    }
// 	} else {
// 	    stack[depth].push(tokenized[i]);
// 	}
//     }
//     return stack[depth];
// }

// // TODO: rename to parse?
// function ast(parsed) {
//     // Accepts: a JavaScript array of Scheme functions and values. Arguements
//     //  that were Scheme s-expressions will be nested JavaScript arrays. Scheme
//     // functions and vars are strings; if float(var) is true, return float.
//     // Returns: an abstract syntax tree as a JavaScript object; with
//     //  {'func': <scheme function>, 'args': <scheme arguments>}, where <scheme
//     //  arguments> can be another JavaScript object with the same format.
//     var stack = {};
//     for (var i in parsed) {
// 	if(i === '0') {
// 	    stack['func'] = parsed[i];
// 	    stack['args'] = [];
// 	} else if (predicates.is_array(parsed[i])) {
// 	    stack['args'].push(ast(parsed[i]));
// 	} else {
// 	    stack['args'].push(parsed[i]);
// 	}
//     }
//     return stack;
// }


// function parse(tokenized) {
//     // export parse    
//     // accept a tokenized JavaScript Array and call pre_parse and ast on it
//     var parsed = pre_parse(tokenized);
//     return ast(parsed);
// }
// exports.parse = parse;
// exports.ast = ast;
