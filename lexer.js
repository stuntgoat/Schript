// lexer.js
// functions to tokenize a Scheme expression

// TODO: - check for orphan paren, throw error
//       - check for illegal characters
//       - chech for misc. syntax errors

function tokenize(expression) {
    var regex_list = [",?[\\d\\w_-]+", // identifiers TODO: do not allow leading '-' or numbers
                      "[+*/-]", // math operators
                      "`\\(", // backquoted paren
                      ",\\(", // comma un-escaping open paren
                      "\\(|\\)" // parens
                     ];
    var regex = new RegExp(regex_list.join('|'), 'g');
    return expression.match(regex);
}

exports.tokenize = tokenize;