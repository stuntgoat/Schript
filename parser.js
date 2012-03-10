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
        return '(function () { if (' + ast_to_js(node.cond) + ') { return ' + ast_to_js(node.texp) + '; } else { return ' + ast_to_js(node.fexp) + '; } })()';
    
    },
    identity: function (node) {
        return node.ival;
    },
    define: function (node) {
        return "var " + node.symb + " = " + ast_to_js(node.expr) + ";";
    }
    
};
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

console.log("~input: (if (< 2 5) 0 1)");
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