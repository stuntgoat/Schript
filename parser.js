// parser.js
// Functions to create an abstract syntax tree from an array of Scheme tokens.
// exports: parse
var predicates = require('./predicates.js');




var lexemes = {
    
    '(': 'l_paren',
    ')': 'r_paren',
    '+': 'plus_op',
    '-': 'minus_op',
    '*': 'mult_op',
    '/': 'div_op',
    
};

var symbol_table = {
    'if': {},
    'lambda': {},
    'define': {},
    'defmacro': {}
};

function lexer(input_string) {
    var tokens = [];
    var i;
    for (i=0; i < input_string.length; i++) {
                



    }



    return tokens;
}









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

function ast_to_js(node) {
    return form_handlers[node.form](node);
}

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
        return '(function () { if (' + ast_to_js(node.cond) + ') { return ' + ast_to_js(node.texp) + '; } else { return ' + ast_to_js(node.fexp) + '; } })()';},
    identity: function (node) {
        return node.ival;
    },
    define: function (node) {
        return "var " + node.symb + " = " + ast_to_js(node.expr) + ";";
    }
};

// (defmacro ham (a b c) `(+ ,a (- ,b ,c)))
var dm_ast = {
    form: 'defmacro',
    symb: 'ham',
    args: ['a', 'b', 'c'],
    mexp: ['`(', '+', ',a', '(', '-', ',b', ',c', ')', ')', ')']
};

var defmacro = function (node) {
    // create a function that will accept variables and apply them to a copy of mexp
    var macro = function (args) {
        var mexp = node.mexp; // a copy of the unexpanded macro form
        // an object matching defmacro's declared args to passed-in args at macro call
        var arg_pairs = tools.zip(node.args, args).reduce(function (acc, val) { acc[val[0]] = val[1]; return acc}, {});

        // expand macro expression by substituting all args with passed-in vals;
        // reduce unquoted expressions         
        
        // create AST from expanded generated Scheme string

        // call ast_to_js on AST
        
    };
    // place macro function inside local copy of form_handlers
    // TODO: check that macro name is not in form_handlers; if it is, throw error
    form_handlers[node.symb] = macro;
};

// write function that parses a macro expression and reduces unquoted expressions- s-expressions unquoted by ',(' 

// ex. input: ['`(', '+', '5', '3', ',(', '*', 'a', 'b', ')', ',a', '99', ')']
// ex. passed-in args {a:'22', b:'88'} output: '(+ 5 3 1936 22 99)'

function parse_macro_expression(mexp) {
    // substitute all unquoted passed-in args with args that were actually passed in
    // if any s-exp is unquoted, evaluate this expression 
    var expanded = '';
    

}


console.log("\n\n");
// (define foo 2)
var def_ast = {
  form: "define",
  symb: "foo",
  expr: {
    form: "identity",
    ival: "2"
  }
};
console.log("~input: (define foo 2)");
console.log("output: ", ast_to_js(def_ast));
console.log("\n\n");

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
console.log("~input: (lambda () (* 90 3)");
console.log("output: ", ast_to_js(lam));
console.log("\n\n");

// var m = "(+ 5 6 (- 8 3))";

var list_ast = {
    form: 'normal',
    proc: {
        form: 'symbol',
        symb: 'list'
    },
    args: ['2', '4', '6']
};

console.log("~input: (list 2 4 5)");
console.log("output: ", ast_to_js(list_ast));
console.log("\n\n");

// (if (< 2 5 8) 0 1)
var if_ast = {
  form: "if",
  cond: {
    form: "normal",
    proc: {
      form: "symbol",
      symb: "<"
    },
    args: ["2", "5", "8"]
  },
  texp: {
    form: "identity",
    ival: "0"
  },
  fexp: {
    form: "identity",
    ival: "1"
  }
};

console.log("~input: (if (< 2 5 8) 0 1)");
console.log("output: ", ast_to_js(if_ast));
console.log("\n\n");

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
console.log("~input: (+ 5 6 (- 8 3))");
console.log("output: ", ast_to_js(m_ast));
console.log("\n\n");

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
console.log("~input:((lambda (x) (* x x)) 2) ");
console.log("output: ", ast_to_js(lambda));
console.log("\n\n");
