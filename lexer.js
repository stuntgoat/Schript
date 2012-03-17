// lexer.js
// functions to tokenize a Scheme expression

// TODO: - check for orphan paren, throw error
//       - check for illegal characters
//       - chech for misc. syntax errors

// Tuesday - lexer lookup table: finish


var match_table = [
    {
        regex_str: "(\\d[\\w_-][\\d\\w_-]*)", // symbol
        handler_f:  function(token) { return {token: 'SYMBOL',
                                              value: token};}
    },
    {
        regex_str:"((?:-?\\d[.]?\\d*)(?!(?:[\\w_-])))", // number
        handler_f: function(token) { return {token: 'NUMBER', 
                                             value: parseInt(token)};}
    },
    {
        regex_str: "(\\+)", // addition
        handler_f: function(token) { return {token: 'ADD'};}
    },
    {
        regex_str: "(\\-)", // subtraction
        handler_f: function(token) { return {token: 'SUB'};}
    },
    {
        regex_str: "(\\*)", // multiplication
        handler_f: function(token) { return {token: 'MUL'};}
    },
    {
        regex_str: "(\\/)", // division
        handler_f: function(token) { return {token: 'DIV'};}
    },
    {
        regex_str: "(\\>)", // greater than
        handler_f: function(token) { return {token: 'GT'};}
    },
    {
        regex_str: "(\\<)", // less than
        handler_f: function(token) { return {token: 'LT'};}
    },
    {
        regex_str: "(\\=)", // equal sign
        handler_f: function(token) { return {token: 'EQ'};}
    },
    {
        regex_str: "(\\@)", // equal sign
        handler_f: function(token) { return {token: 'AT'};}
    },
    {
        regex_str: "(\\!)", // exclamation mark
        handler_f: function(token) { return {token: 'EXCLAMATION'};}
    },
    {
        regex_str: "(\\;)", // semi-colon
        handler_f: function(token) { return {token: 'SEMI_COLON'};}
    },
    {
        regex_str: "(\\|)", // pipe
        handler_f: function(token) { return {token: 'PIPE'};}
    },
    {
        regex_str: "(\\()", // left paren
        handler_f: function(token) { return {token: 'L_PAREN'};}
    },
    {
        regex_str: "(\\))", // right paren
        handler_f: function(token) { return {token: 'R_PAREN'};}
    },
    {
        regex_str: "(\\')", // single quote
        handler_f: function(token) { return {token: 'SINGLE_QUOTE'};}
    },
    {
        regex_str: '(\\")', // double quote
        handler_f: function(token) { return {token: 'DOUBLE_QUOTE'};}
    },
    {
        regex_str: "(\\`)", // backquote
        handler_f: function(token) { return {token: 'BACK_QUOTE'};}
    },
    {
        regex_str: "(\\,)", // comma
        handler_f: function(token) { return {token: 'COMMA'};}
    }
];
exports.match_table = match_table;

// TODO: better way to push tokens
// 
var match_indexer = match_table.length; // first and last two elements are not needed
var match_index_regex = /\d+/;


var tokenize = exports.tokenize = function tokenize(expression) {
    var tokens = [];    
    // map creates a new array, by calling the callback with each element in the map_table
    // apply calls join on the array created by match_table.map; the arguments to join are in an array- in this case '|'
    var re_str_array = match_table.map(function () { return arguments[0].regex_str;});
    var regex_string = re_str_array.join('|');
    //    console.log(regex_string);    
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

