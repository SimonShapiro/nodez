
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , couch = require('./routes/couch')
  , hier = require('./routes/hierarchy')
  , rules = require('./routes/rules')
  , test = require('./routes/test')
  , schema = require('./routes/schema')
  , neo=require('./routes/neo')
  , http = require('http')
  , path = require('path');
  
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));

/*
app.use(function(req,res,next){
	res.locals.scrpts=function(req,res) {return '<script src="javascripts/JSEditor/js2tree.js></script>"'}
  console.log(res.locals.scr)
  next()
})

app.use(function(req,res,next){
	return '<script src="javascripts/JSEditor/js2tree.js></script>"'
	next()
})
*/

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

console.log(app.stack)

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

DBROUTE='http://localhost:5984/'
//DBROUTE='http://simons.iriscouch.com/'

app.get('/', routes.index);

app.get('/users', user.list);

app.get('/couch/:docbase/:doc', couch.getDoc) // R
app.put('/couch/:docbase/:doc', couch.putDoc) // U
app.post('/couch/:docbase', couch.postDoc)    // C
app.del('/couch/:docbase/:doc', couch.deleteDoc)   // D

app.get('/hier/:docbase/:doc', hier.getDoc) // R
app.put('/hier/:docbase/:doc', hier.putDoc) // U
app.post('/hier/:docbase', hier.postDoc)    // C
app.del('/hier/:docbase/:doc', hier.deleteDoc)   // D

app.get('/rule/:id', rules.displayRule)
app.put('/rule/:id', rules.putRule)
app.post('/rule/:id', rules.postRule)
app.del('/rule/:id', rules.deleteRule)
app.get('/rule/:id/Edit', rules.editRule)
app.get('/rules', rules.listAll)
app.get('/rule/analyse/:id', rules.analyseRule)
app.get('/rule/newBasedOnWhenItem/:item/:operator/:value', rules.newRuleBasedOnWhenItem)

app.post('/schema/example', schema.generateExample);

app.del('/neo4j/node/:id', neo.deleteNodeById);
app.post('/neo4j/node', neo.postNodeWithLabel );
app.get( '/neo4j/node/:id/verbose', neo.getNodeById );
app.put( '/neo4j/node/:id', neo.putNodeById );
app.get( '/neo4j/node/:id/navigate', neo.getNodeByIdWithNavigation );
app.get( '/neo4j', neo.serviceRoot );
app.get( '/neo4j/nodes/label/:label', neo.getNodesByLabel );

app.post( '/neo4j/node/:id/relationship', neo.saveRelationship );
app.del( '/neo4j/relationship/:id', neo.deleteRelationship );
app.get( '/neo4j/relationship/:id', neo.getRelationship );

//app.get('/test', test.index)
//app.get('/rules/:matchingTarget', rules.listAll)

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
