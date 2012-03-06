
var lexer = require('../lexer.js');


sexp = "(define (topcard rank hand)(cond ((eq? rank (car (car hand))) (topstack (car hand))    ) (else (topcard rank (cdr hand))) ))";

sexp2 = "(define (nextrank rank)  (cond ((eq? rank 'K) 'Q)        ((eq? rank 'Q) 'J)        ((eq? rank 'J) 'T)        ((eq? rank 'T) '9)        ((eq? rank '9) '8)        ((eq? rank '8) '7)        ((eq? rank '7) '6)        ((eq? rank '6) '5)        ((eq? rank '5) '4)        ((eq? rank '4) '3)        ((eq? rank '3) '2)        ((eq? rank '2) 'A)        ((eq? rank 'A) 'K)  ))";

sexp2 = "(define (nextrank rank)  (cond ((eq? rank 'K) 'Q)        ((eq? rank 'Q) 'J)        ((eq? rank 'J) 'T)        ((eq? rank 'T) '9)        ((eq? rank '9) '8)        ((eq? rank '8) '7)        ((eq? rank '7) '6)        ((eq? rank '6) '5)        ((eq? rank '5) '4)        ((eq? rank '4) '3)        ((eq? rank '3) '2)        ((eq? rank '2) 'A)        ((eq? rank 'A) 'K)  ))";
var expression111 = "(- 2(*(- 4 6 -6)-3 7 56)99)";

console.log(sexp2);
console.log(lexer.tokenize(sexp2));
//console.log(lexer.tokenize(sexp2));