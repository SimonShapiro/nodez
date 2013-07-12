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
		console.log("passing data back to browser:"+json)
		res.render('couch.jade',data={header:"passToBrowser",docbase:docbase,json:json})
		return true	
}

function couchBroker(route) {
	var route=route
}
couchBroker.prototype={
	constructor: couchBroker,
	getDoc: function(docbase,oid,fn) {
		var callBack=fn
		options={
			url:DBROUTE+docbase+"/"+oid,
			method:"GET"
			}
		console.log("Calling couch broker with:"+JSON.stringify(options))
		var request = require('request');
		var handShake = function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log("OK  "+response.statusCode+":"+options.url+":Couch results="+body)
		  	}
		  	else {
				console.log("!OK "+response.statusCode+":"+options.url+":Couch results="+body)
		  	}
			callBack(response.statusCode,body)
		}
		request(options,handShake)
	},
	putDoc: function(docbase,oid,json,fn) {
		var callBack=fn
		options={
			url:DBROUTE+docbase+"/"+oid,
			method:"PUT",
			headers:{'content-type':'application/json'},
			body:json
		}
		console.log("Calling couch broker with:"+JSON.stringify(options))
		var request = require('request');
		var handShake = function (error, response, body) {
			if (!error && response.statusCode == 201) {
				console.log("OK  "+response.statusCode+":"+options.url+":Couch results="+body)
		  	}
		  	else {
				console.log("!OK "+response.statusCode+":"+options.url+":Couch results="+body)
		  	}
			callBack(response.statusCode,body)
		}
		request(options,handShake)
	},
	postDoc: function(docbase,oid,json,fn) {
		var callBack=fn
		options={
			url:DBROUTE+docbase+"/",
			method:"POST",
			headers:{'content-type':'application/json'},
			body:json
		}
		console.log("Calling couch broker with:"+JSON.stringify(options))
		var request = require('request');
		var handShake = function (error, response, body) {
			if (!error && response.statusCode == 201) {
				console.log("OK  "+response.statusCode+":"+options.url+":Couch results="+body)
		  	}
		  	else {
				console.log("!OK "+response.statusCode+":"+options.url+":Couch results="+body)
		  	}
			callBack(response.statusCode,body)
		}
		request(options,handShake)
	},
	deleteDoc: function(docbase,oid,rev,fn) {
		var callBack=fn
		console.log("Delete details"+oid+":"+rev)
		options={
			url:DBROUTE+docbase+"/"+oid+"?rev="+rev,
			method:"DELETE",
			headers:{'content-type':'application/json'}
		}
		console.log("Calling couch broker with:"+JSON.stringify(options))
		var request = require('request');
		var handShake = function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log("OK  "+response.statusCode+":"+options.url+":Couch results="+body)
		  	}
		  	else {
				console.log("!OK "+response.statusCode+":"+options.url+":Couch results="+body)
		  	}
			callBack(response.statusCode,body)
		}
		request(options,handShake)
	}
}

exports.getDoc= function(req, res){
	var handleDb = function(status,results) {
		console.log("CallBack knows that status="+status)
		passToBrowser(res,req.params.docbase,results)
	}
//	var db=require('/couchBroker')//
//	db.getDoc(req.params.docbase,req.params.doc)
	var db=new couchBroker(DBROUTE)  //eventually call a a factory based on access method
	db.getDoc(req.params.docbase,req.params.doc,handleDb)
//	console.log("db.="+db.status)
//	passToBrowser(res,req.params.docbase,body)
}

exports.putDoc= function(req, res){
	var handleDb = function(status,results) {
		console.log("CallBack knows that status="+status+":"+results)
//		passToBrowser(res,req.params.docbase,results)
		res.setHeader('content-type','application/json')
		res.write(results)
		res.end()
		console.log("OK"+results)
	}
//	var db=require('/couchBroker')//
//	db.getDoc(req.params.docbase,req.params.doc)
	var db=new couchBroker(DBROUTE)  //eventually call a a factory based on access method
	console.log("Asked to put "+req.body.json)
	db.putDoc(req.params.docbase,req.params.doc,req.body.json,handleDb)
};


exports.postDoc= function(req, res){
	var handleDb = function(status,results) {
		console.log("CallBack knows that status="+status+":"+results)
//		passToBrowser(res,req.params.docbase,results)
		res.setHeader('content-type','application/json')
		res.write(results)
		res.end()
		console.log("OK"+results)
	}
//	var db=require('/couchBroker')//
//	db.getDoc(req.params.docbase,req.params.doc)
	var db=new couchBroker(DBROUTE)  //eventually call a a factory based on access method
	console.log("Asked to put "+req.body.json)
	db.postDoc(req.params.docbase,req.params.doc,req.body.json,handleDb)
};

exports.deleteDoc=function(req, res){
	var handleDb = function(status,results) {
		console.log("CallBack knows that status="+status+":"+results)
//		passToBrowser(res,req.params.docbase,results)
		res.setHeader('content-type','application/json')
		res.write(results)
		res.end()
		console.log("OK"+results)
	}
//	var db=require('/couchBroker')//
//	db.getDoc(req.params.docbase,req.params.doc)
	rev=JSON.parse(req.body.json)._rev
	console.log("in delete with:"+rev)
	var db=new couchBroker(DBROUTE)  //eventually call a a factory based on access method
	console.log("Asked to delete "+req.body.json)
	db.deleteDoc(req.params.docbase,req.params.doc,rev,handleDb)  //eventuall .doc and rev will form the oid object
};