exports.index = function(req,res) {
	dat={"hello":"world"}
	res.render('test.jade',data={one:"hello world",json:JSON.stringify(dat)})
}
