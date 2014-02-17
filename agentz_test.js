var a = require('agentz/agentz.js')


exports['General'] = function(test) {
	c=new GeneralNode('Custer','Treasury',{one:1})
	d=new GeneralNode('Custer','RetailBank',{one:1,two:2,three:[1,2,3,4,5]})
	test.equal(c.name,'Treasury')
	test.notEqual(c.uuid,d.uuid)
	console.log('c='+c.toNeo4j())
	console.log('d='+d.toNeo4j())
	console.log(c.ExtractNeo4jData())
	console.log(d.ExtractNeo4jData())
	test.done()
}
exports['General Save'] = function(test) {
	d=new GeneralNode('Cluster','RetailBank',{one:1,two:2,three:[1,2,3,4,5]})
	test.equal(d.name,'RetailBank')
	console.log(d.ExtractNeo4jData())
	d.save(d)
	test.done()
}
exports['cypherSave'] = function(test) {
	stateMachine = function(state,response) {
//		stateSwitch = {"start": {"200":"deleteAll"}}
		console.log("In state machine")
		if ((state=="start") & (response=="go")) {
			deleteAll()
			console.log("start:go")
		}
		if ((state=="testCypher") & (response=="go")) {
			testCypher()
		}
		test.equal(1,1,"they are the same")
	}
	deleteAll = function () {
		var DBROUTE="http://localhost:7474/db/data/cypher/"
		cypher={
			"query":"match (m) optional match (m)-[r]->() delete m,r",
			"params": {
			}
		}
		console.log(JSON.stringify(cypher))
		options={
			url:DBROUTE,
			method:"POST",
			headers:{'content-type':'application/json'},
			body:JSON.stringify(cypher)
			}
		console.log("Calling Neo4j broker with:"+options)
		var request = require('request');
		var afterPosting = function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log("OK  "+response.statusCode+":"+options.url+":Neo4j results="+body)
				stateMachine("testCypher","go")
		  	}
		  	else {
				console.log("!OK "+response.statusCode+":"+options.url+":Neo4j results="+body)
		  	}
	//			callBack(response.statusCode,body)
		}
		request(options,afterPosting)
	}
	
	testCypher = function () {
		d=new GeneralNode('Cluster','Retail Bank',{name:'Retail Bank'})
		test.equal(d.name,'Retail Bank')
		d.cypherSave(d)
		d=new GeneralNode('Cluster','WEurope',{name:'WEurope'})
		d.cypherSave(d)
		d=new GeneralNode('Cluster','Investment Bank',{name:'Investment Bank'})
		d.cypherSave(d)
		d=new GeneralNode('Cluster','Card',{name:'Card'})
		d.cypherSave(d)
		d=new GeneralNode('Cluster','Treasury',{name:'Treasury'})
		d.cypherSave(d)
		d=new GeneralNode('Types','Cluster',{name:"Cluster",template:"{'description':'string','objectives':'string'}"})
		d.cypherSave(d)
	}	

//	deleteAll()
	stateMachine("start","go")
	test.done()
}
