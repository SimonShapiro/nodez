DBROUTE='http://localhost:5984/'
//DBROUTE='http://simons.iriscouch.com/'

function couchBroker(doc) {
	var docbase
	this.docbase=doc
}
couchBroker.prototype = {
	constructor: couchBroker,
	wr:  function() {
		console.log("Hello world "+this.docbase)
	},
	couchGET: function(guid,callBack) {
		options={
			url:DBROUTE+this.docbase+"/"+guid, //avoid hard coding the dbase
			method:"GET"
			}
		console.log(JSON.stringify(options))
		var request = require('request');
		request(options, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log("passing data back to browser"+JSON.stringify(body))
//				res.render('editRule.jade',{data:{header:req.params.id,json:body}})
		  }
		})
	}
}

c=new couchBroker("dictionary")
c.wr()
b=new couchBroker("B")
b.wr()
console.log(b.docbase+":"+c.docbase)
c.couchGET("AT001","")
