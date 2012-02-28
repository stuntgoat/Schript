


function evaluate_procedure(args, procedure) {
    // evaluate a prodcedure    
    stack = [];
    


}

function print_lambda(args, body) {
    // translate a lambda expression
    var stack = [];
    var tmp_stack = [];
    if (!args.length) {
	stack.push('() ');
    } else if (args.length === 1) {
	stack.push('(' + args[0] + ') ');
    } else {
	stack.push('(')
	for (var i in args) {
	    if (i === args.length -1){
		tmp_stack.push(args[i]);
	    } else {
		tmp_stack.push(args[i] + ',');
	    }
	}
	stack.push(')');
    }
    return stack.join('') + evaluate_procedure(args, body);
}

procedures = {
    lambda: print_lambda
};


exports.procedures = procedures;