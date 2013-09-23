var a = require('agentz/agentz.js')

exports['First test'] = function(test) {
//	test.expect(2)
	b=new a.orange()
	b.speak()
	console.log(b.c)
	b.c="K"
	delete b.c
	console.log(b.c)
	test.ok((b instanceof a.orange))
//	test.ok((b.prototype instanceof a.agent))
	test.done()
}
