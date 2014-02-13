exports.serviceRoot = function(req,res) {
	
	_CB_afterPosting = function (error, response, body) {
		console.log("switching...")
		if (!error) { 
			switch (response.statusCode) {
				case 200: {
					console.log("OK  "+response.statusCode+":"+options.url+":Neo4j results="+body)
					switch (req.headers.accept) {
						case 'application/json':
							res.setHeader('content-type','application/json')
							res.write(body)
							res.end()
							break
						default:				
							res.render('couch.jade',data={header:"Neo4j service root found:",json:body})
			//				passToBrowser(res,req.params.docbase,results)
						}
						break
				}  // end HTTP 200
			}
		}
	  	else {
			console.log("!OK "+response.statusCode+":"+options.url+":Neo4j results="+body)
	  	}
	}
	
	getNeo4jServiceRoot = function (req,res) {
		var DBROUTE = "http://localhost:7474/db/data/"
		console.log("service root")
		options={
			url:DBROUTE,
			method:"GET",
			headers:{'content-type':'application/json'}
			}
		console.log("Calling Neo4j broker with:"+options)
		var request = require('request');
		request(options,_CB_afterPosting)
	//	request(options,stateMachine)
	}

	getNeo4jServiceRoot(req,res)  
//because of asynch calls nothing can be found below this line
}
