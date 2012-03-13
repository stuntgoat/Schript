// lexer.js
// functions to tokenize a Scheme expression

// TODO: - check for orphan paren, throw error
//       - check for illegal characters
//       - chech for misc. syntax errors

// Tuesday - lexer lookup table: finish


var match_table = [
    {
        regex_str: "(\\'?\\d*[\\w_-][\\d\\w_-]+)", // quoted symbol
        handler_f:  function(token) { return {'token': 'symbol', attribute: 'quoted'};}
    },
    {
        regex_str: "(\\,?\\d*[\\w_-][\\d\\w_-]+)", // symbol
        handler_f:  function(token) { return {'token': 'symbol', attribute: 'unquoted'};} 
    },  
    {
        regex_str:"(\\d+[\\.]?\\d*)", // numbers
        handler_f: function(token) { return {'token': 'NUMBER', value: token };}
    },
    {
        regex_str: "(\\+)", // addition
        handler_f: function(token) { return {'token': 'ADD'};}
    },
    {
        regex_str: "(\\-)", // subtraction
        handler_f: function(token) { return {'token': 'SUB'};}
    },
    {
        regex_str: "(\\*)", // multiplication
        handler_f: function(token) { return {'token': 'MUL'};}
    },
    {
        regex_str: "(\\/)", // division
        handler_f: function(token) { return {'token': 'DIV'};}
    },
    {
        regex_str: "(`\\()", // backquoted left paren
        handler_f: function(token) { return {'token': 'L_PAREN', attribute: 'backquoted'};}
    },
    {
        regex_str: "(,\\()", // comma un-escaping left paren
        handler_f: function(token) { return {'token': 'L_PAREN', attribute: 'escaped'};}
    },
    {
        regex_str: "(\\()", // left paren unquoted
        handler_f: function(token) { return {'token': 'L_PAREN', attribute: 'unquoted'};}
    },
    {
        regex_str: "(\\))", // right paren unquoted
        handler_f: function(token) { return {'token': 'R_PAREN', attribute: 'unquoted'};}
    },
    {
        regex_str: "(\\'\\()", // quoted left paren
        handler_f: function(token) { return {'token': 'L_PAREN', attribute: 'quoted'};}
    }
];


// TODO: better way to push tokens
// 
var match_indexer = match_table.length; // first and last two elements are not needed
var match_index_regex = /\d+/;

function tokenize(expression) {
    var tokens = [];    
    var regex_string = [].join.apply(match_table.map(function (elem, index, array) { return elem.regex_str;}, ''), ['|']); 
    console.log(regex_string);    
    var regex = new RegExp(regex_string, 'g');
    
    expression.replace(regex, function() {
                           var match  = arguments[0];
			   delete arguments[0];
                           delete arguments[13];
                           delete arguments[12];
                           var index = parseInt(JSON.stringify(arguments).match( /\d+/));
                           tokens.push(match_table[index - 1].handler_f(match));

                           // for (var i=1; i<arguments.length-2; i++) {
                           //     if (arguments[i] !== undefined) {
                           //         tokens.push(match_table[i-1].handler_f(match));
                           //     }
                           // }
                           return '';
                       });
    return tokens;
}                             


var input = "('foo + 2.90 3 )"; //(`(html (head (body (p ,(+ 2 2))
console.log('input: ', input);
console.log('output: ', tokenize(input));
exports.tokenize = tokenize;


// function tokenize(expression) {
//     var regex_list = ["(,?\\d+[\\w_-][\\d\\w_-]+)", // symbol
//                       "(\\d+\\.\\d+)", // numbers
//                       "(\\+)", // math operatorsAA
//                       "(\\-)", // math operators
//                       "(\\*)", // math operators
//                       "(\\/)", // math operators

//                       "(`\\()", // backquoted left paren
//                       "(,\\()", // comma un-escaping left paren
//                       "(\\()", // left paren unquoted
//                       "(\\))", // right paren unquoted
//                       "(\\'\\()" // quoted left paren
//                      ];
//     var match_handlers = { 
//         1: function(token) { return {'token': 'symbol', attribute: 'unquoted'};},
//         2: function(token) { return {'token': 'NUMBER', attribute: };},
//         3: function(token) { return {'token': 'ADD'};},
//         4: function(token) { return {'token': 'SUB'};},
//         5: function(token) { return {'token': 'MUL'};},
//         6: function(token) { return {'token': 'DIV'};},

//         7: function(token) { return {'token': 'L_PAREN', attribute: 'backquoted'};},
//         8: function(token) { return {'token': 'L_PAREN', attribute: 'escaped'};},
//         9: function(token) { return {'token': 'L_PAREN', attribute: 'unquoted'};},
//         10: function(token) { return {'token': 'R_PAREN', attribute: 'unquoted'};},
//         11: function(token) { return {'token': 'L_PAREN', attribute: 'quoted'};}

//         // 2: function(token) { return {'token': 'ADD'};},
//         // // 0: function(token) { return {'token': 'SUB'};},
//         // // 1: function(token) { return {'token': 'MUL'};},
//         // 7:function(token) { return {'token': 'DIV'};},
//         // 1: function(token) { return {'token': "NUMBER", value: token}}
//     };
//     var tokens = [];    
//     var regex = new RegExp(regex_list.join('|'), 'g');
    
//     expression.replace(regex, function(match) {
//                            console.log(arguments);
//                            for (var i=1; i<arguments.length-2; i++) {
//                                if (arguments[i] !== undefined) {
//                                    tokens.push(match_handlers[i](match));
//                                }
//                            }
//                            return '';
//                        });
//     return tokens;
// }                             

// var a =  { '0': '3',   '1': undefined,   '2': '3',   '3': undefined,   '4': undefined,   '5': undefined,   '6': undefined,   '7': undefined,   '8': undefined,   '9': undefined,   '10': undefined,   '11': undefined,   '12': 8,   '13': '(+ 2.90 3)' }  ;
// function include(result) {
//     var match = result['0'];
//     delete result['0'];
//     return (result.indexOf(match) != -1);
// }
// console.log(include(a));
    
    
  
