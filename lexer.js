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
exports.match_table = match_table;

// TODO: better way to push tokens
// 
var match_indexer = match_table.length; // first and last two elements are not needed
var match_index_regex = /\d+/;

function tokenize(expression) {
    var tokens = [];    
    // map creates a new array, by calling the callback with each element in the map_table
    // apply calls join on the array created by match_table.map; the arguments to join are in an array- in this case '|'
    var re_str_array = match_table.map(function () { return arguments[0].regex_str;});
    var regex_string = re_str_array.join('|');
    console.log(regex_string);    
    var regex = new RegExp(regex_string, 'g');
    
    expression.replace(regex, function() {
                           var match  = arguments[0];
			   delete arguments[0];
                           delete arguments[13];
                           delete arguments[12];
                           var index = parseInt(JSON.stringify(arguments).match( /\d+/));
                           tokens.push(match_table[index - 1].handler_f(match));
                           return '';
                       });
    return tokens;
}                             


var input = "('foo + 2.90 3 )"; //(`(html (head (body (p ,(+ 2 2))
console.log('input: ', input);
console.log('output: ', tokenize(input));
exports.tokenize = tokenize;
 
    
     
  
