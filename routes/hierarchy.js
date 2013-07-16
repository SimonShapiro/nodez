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
		res.render('test.jade',data={header:"passToBrowser",docbase:docbase,json:json})
		return true	
}

exports.getDoc= function(req, res){
	var handleDb = function(status,results) {
		console.log("CallBack knows that status="+status)
		passToBrowser(res,req.params.docbase,results)
	}
	var cB=require('couchBroker.js')
	var db=new cB.couchBroker(DBROUTE)  //eventually call a a factory based on access method
	db.getDoc(req.params.docbase,req.params.doc,handleDb)
}

exports.putDoc= function(req, res){
	var handleDb = function(status,results) {
		console.log("CallBack knows that status="+status+":"+results)
		res.setHeader('content-type','application/json')
		res.write(results)
		res.end()
		console.log("OK"+results)
	}
	var cB=require('couchBroker.js')
	var db=new cB.couchBroker(DBROUTE)  //eventually call a a factory based on access method
	console.log("Asked to put "+req.body.json)
	db.putDoc(req.params.docbase,req.params.doc,req.body.json,handleDb)
};


exports.postDoc= function(req, res){
	var handleDb = function(status,results) {
		console.log("CallBack knows that status="+status+":"+results)
		res.setHeader('content-type','application/json')
		res.write(results)
		res.end()
		console.log("OK"+results)
	}
	var cB=require('couchBroker.js')
	var db=new cB.couchBroker(DBROUTE)  //eventually call a a factory based on access method
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
	var rev=JSON.parse(req.body.json)._rev
	console.log("in delete with:"+rev)
	var cB=require('couchBroker.js')
	var db=new cB.couchBroker(DBROUTE)  //eventually call a a factory based on access method
	console.log("Asked to delete "+req.body.json)
	db.deleteDoc(req.params.docbase,req.params.doc,rev,handleDb)  //eventuall .doc and rev will form the oid object
x};