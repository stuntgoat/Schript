// define_syntax.js

// parse Scheme's define-syntax; upon finding defmacro, create a global
// object using the macro name, the argument list and an expression list

var macro_table = {};

function defmacro(var_name, args, expression) {
    // store var_name
    if (var_name in macro_table) {
        throw var_name + " is currently in macro_table";
    }
    macro_table[var_name] = {
        args: args,
        expression: expression
    };
}

exports.macro_table = macro_table;
exports.defmacro = defmacro;
