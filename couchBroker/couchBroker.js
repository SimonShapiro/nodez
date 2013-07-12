/*
* @author Simon Shapiro
var Client = require('request-json').JsonClient;
var client = new Client('http://localhost:8888/');

var data = {
  title: 'my title',
  content: 'my content'
};
client.post('posts/', data, function(err, res, body) {
  return console.log(response.statusCode);
});

client.get('posts/', function(err, res, body) {
  return console.log(body.rows[0].title);
});

data = {
  title: 'my new title'
};
client.put('posts/123/', function(err, res, body) {
  return console.log(response.statusCode);
});

client.del('posts/123/', function(err, res, body) {
  return console.log(response.statusCode);
});* 
* 
* */
function passToBrowser(res,docbase,json) {
		console.log("passing data back to browser")
		res.render('couch.jade',data={header:"passToBrowser",docbase:docbase,json:json})
		return true	
}

exports.getDoc= function(docbase, doc){
	options={
		url:DBROUTE+docbase+"/"+doc,
		method:"GET"
		}
	console.log("Calling couch broker with:"+JSON.stringify(options))
	var request = require('request');
//	request(options, function (error, response, body) {
//		if (!error && response.statusCode == 200) {
//			passToBrowser(res,req.params.docbase,body)
//	  }
//	}
	)
}

exports.putDoc= function(req, res){
	options={
		url:DBROUTE+req.params.docbase+"/"+req.params.doc,
		method:"PUT",
		headers:{'content-type':'application/json'},
		body:req.body.json
		}
	console.log(JSON.stringify(options))
	var request = require('request');
	request(options, function (error, response, body) {
		if (!error && response.statusCode == 201) {
//			res.statusCode=response.statusCode
			res.setHeader('content-type','application/json')
			res.write(body)
			res.end()
			console.log("OK"+body)
		}
	  	else {
			res.setHeader('content-type','application/json')
			res.write(body)
			res.end()
	  		console.log("FAIL:"+response.statusCode+JSON.stringify(body))
	  	}
	})
};


exports.postDoc= function(req, res){
	options={
		url:DBROUTE+req.params.docbase+"/",
		method:"POST",
		headers:{'content-type':'application/json'},
		body:req.body.json
		}
	console.log(JSON.stringify(options))
	var request = require('request');
	request(options, function (error, response, body) {
		if (!error && response.statusCode == 201) {
//			res.statusCode=response.statusCode
			res.setHeader('content-type','application/json')
			res.write(body)
			res.end()
			console.log("OK"+body)
		}
	  	else {
			res.setHeader('content-type','application/json')
			res.write(body)
			res.end()
	  		console.log("FAIL:"+response.statusCode+JSON.stringify(body))
	  	}
	})
};

exports.deleteDoc=function(req, res){
	rev=JSON.parse(req.body.json)._rev
	console.log("in delete with:"+rev)
	options={
		url:DBROUTE+req.params.docbase+"/"+req.params.doc+"?rev="+rev,
		method:"DELETE",
		headers:{'content-type':'application/json'}
		}
	console.log(JSON.stringify(options))
	var request = require('request');
	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
//			res.statusCode=response.statusCode
			res.setHeader('content-type','application/json')
			res.write(body)
			res.end()
			console.log("OK"+body)
		}
	  	else {
			res.setHeader('content-type','application/json')
			res.write(body)
			res.end()
	  		console.log("FAIL:"+response.statusCode+JSON.stringify(body))
	  	}
	})
};