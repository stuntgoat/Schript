// lexer.js
// functions to tokenize a Scheme expression

// TODO: - check for orphan paren, throw error
//       - check for illegal characters
//       - chech for misc. syntax errors

// Tuesday - lexer lookup table: finish

function token_identity(token) {
    return token;
}

var match_table = [
    {
        regex_str: "([a-zA-Z_]+)", // symbol
        handler_f: token_identity
    },
    {
        regex_str:"(-?\\d+)", // number
        handler_f: function(token) { return parseInt(token);}
    },
    {
        regex_str: "(\\+)", // addition
        handler_f: token_identity
    },
    {
        regex_str: "(\\-)", // subtraction
        handler_f: token_identity
    },
    {
        regex_str: "(\\*)", // multiplication
        handler_f: token_identity
    },
    {
        regex_str: "(\\/)", // division
        handler_f: token_identity
    },
    {
        regex_str: "(\\>)", // greater than
        handler_f: token_identity
    },
    {
        regex_str: "(\\<)", // less than
        handler_f: token_identity
    },
    {
        regex_str: "(\\=)", // equal sign
        handler_f: token_identity
    },
    {
        regex_str: "(\\@)", // equal sign
        handler_f: token_identity
    },
    {
        regex_str: "(\\!)", // exclamation mark
        handler_f: token_identity
    },
    {
        regex_str: "(\\;)", // semi-colon
        handler_f: token_identity
    },
    {
        regex_str: "(\\|)", // pipe
        handler_f: token_identity
    },
    {
        regex_str: "(\\()", // left paren
        handler_f: token_identity
    },
    {
        regex_str: "(\\))", // right paren
        handler_f: token_identity
    },
    {
        regex_str: "(\\')", // single quote
        handler_f: token_identity
    },
    {
        regex_str: '(\\")', // double quote
        handler_f: token_identity
    },
    {
        regex_str: "(\\`)", // backquote
        handler_f: token_identity
    },
    {
        regex_str: "(\\,)", // comma
        handler_f: token_identity
    }
];


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


