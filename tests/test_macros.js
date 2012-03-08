



Suite('Test Macros', function() {

    test('expression_token_list', function () {
        var macro_expand = require("../macro_expand.js");
        var macro_args = ['"string_of_characters"', 'length'];
        var reverse_macro = { 
                args: ['a', 'b'], // this is the args list passed to reverse
                expression: [ '`', '(', ',', 'b', ' ', ',', 'a', ')' ] // this is the macro expression to expand
            };
        var expected_output = {
            'func': 'length',
            'args': ['"string_of_characters"']
        };
        var expanded = macro_expand.macro_expand(reverse_macro, macro_args);
        assert.deepEqual(expanded, expected_output2);
    });
});











