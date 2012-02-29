// procedures.js
// Abstract the lookup table away from translate.js. Procedures
// from muliple modules are imported here and exported as a single object.

var tools = require('./tools.js');

// each of the following imports contains an object with one or more
// functions defined. procedures.js
var operators = require('./math_operators.js');
var lambda = require('./lambda.js');

procedures = tools.tools.merge_objects([operators.operators, lambda.lambda]);


exports.procedures = procedures;