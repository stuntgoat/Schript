// lexer.js
// functions to tokenize a Scheme expression

// TODO: - check for orphan paren, throw error
//       - check for illegal characters
//       - chech for misc. syntax errors

function tokenize(expression) {
    var regex_list = ["(,?\\d+[\\w_-][\\d\\w_-]+)", // symbol
                      "(\\d+\\.\\d+)", // numbers
                      "(\\+)", // math operators
                      "(\\-)", // math operators
                      "(\\*)", // math operators
                      "(\\/)", // math operators

                      "(`\\()", // backquoted left paren
                      "(,\\()", // comma un-escaping left paren
                      "(\\()", // left paren unquoted
                      "(\\))", // right paren unquoted
                      "(\\'\\()" // quoted left paren
                     ];
    var match_handlers = { 
        1: function(token) { return {'token': 'symbol', attribute: 'unquoted'};},
        2: function(token) { return {'token': 'NUMBER', attribute: };},
        3: function(token) { return {'token': 'ADD'};},
        4: function(token) { return {'token': 'SUB'};},
        5: function(token) { return {'token': 'MUL'};},
        6: function(token) { return {'token': 'DIV'};},

        7: function(token) { return {'token': 'L_PAREN', attribute: 'backquoted'};},
        8: function(token) { return {'token': 'L_PAREN', attribute: 'escaped'};},
        9: function(token) { return {'token': 'L_PAREN', attribute: 'unquoted'};},
        10: function(token) { return {'token': 'R_PAREN', attribute: 'unquoted'};},
        11: function(token) { return {'token': 'L_PAREN', attribute: 'quoted'};}

        // 2: function(token) { return {'token': 'ADD'};},
        // // 0: function(token) { return {'token': 'SUB'};},
        // // 1: function(token) { return {'token': 'MUL'};},
        // 7:function(token) { return {'token': 'DIV'};},
        // 1: function(token) { return {'token': "NUMBER", value: token}}
    };
    var tokens = [];    
    var regex = new RegExp(regex_list.join('|'), 'g');
    
    expression.replace(regex, function(match) {
                           console.log(arguments);
                           for (var i=1; i<arguments.length-2; i++) {
                               if (arguments[i] !== undefined) {
                                   tokens.push(match_handlers[i](match));
                               }
                           }
                           return '';
                       });
    return tokens;
}                             


console.log(tokenize('(+ 2 3)'));

exports.tokenize = tokenize;