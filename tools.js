// tools.js
// convenience functions are here to save space in other modules

//var predicates = require('./predicates.js');

function merge_objects(objs) {
    // Accepts an array of objects; Returns: a single object
    // with keys in the previous objects overwritten by the 
    // next objects in the Array.
    var obj_stack = {};
    for (i in objs) {
	for (o in objs[i]) {
	    if (objs[i].hasOwnProperty(o)) {
		obj_stack[o] = objs[o];
	    }	
	}
    }
    return obj_stack;
}
exports.tools = merge_objects;
