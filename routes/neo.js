exports.getNodesByLabel = function(req,res) {
    console.log('get type by id')
    neo4jGetNodesByLabel(req,res)
// async boundary
    function neo4jGetNodesByLabel(req,res) {
        var DBROUTE="http://localhost:7474/db/data/label/"+req.params.label+"/nodes"
        options={
            url:DBROUTE,
            method:"GET",
            headers:{'content-type':'application/json'},
            }
        console.log("Calling Neo4j broker with:"+JSON.stringify(options))
        var request = require('request');
        request(options,_CB_after)
    }

    function _CB_after(error, response, body) {
        console.log("switching...")
        if (!error) { 
            switch (response.statusCode) {
                case 200: {
                    console.log("OK  "+response.statusCode+":"+options.url+":Neo4j results="+body)
                    neo4jExtractDataRows(req,body)
                    break
                }  // end HTTP 200
                default: {
                    console.log("!OK  "+response.statusCode+":"+options.url+":Neo4j results="+body)
                    res.status(404)
                    res.render('error.jade',data={title:"Not found",msg:body})
                    break
                }
            }
        }
        else {
            console.log("!OK "+response.statusCode+":"+options.url+":Neo4j results="+body)
        }
    }
    function neo4jExtractDataRows(req,body) {
        var d=JSON.parse(body)
        console.log("----------")
        nodes=[]
        for (n in d) {
            id=d[n].self.split("/").slice(-1)
            verbose='http://'+req.get('host')+'/neo4j/node/'+id+'/verbose'
            nodes.push({data:d[n].data,self:d[n].self,id:id,verbose:verbose})
            console.log(id,verbose)
        }
        console.log(JSON.stringify(nodes))
//          console.log("found "+b.data.length+" row(s) of type "+Object.prototype.toString.call(b.data))
        switch (req.headers.accept) {
        case 'application/json':
            res.setHeader('content-type','application/json')
            res.write(JSON.stringify(nodes))
            res.end()
            break
        default:                
//                res.render('nodeDisplay.jade',data={header:"Neo4j complete node details:",json:JSON.stringify(d)})
//            res.render('displayNodesByLabel.jade',data={header:"Neo4j complete node details:",json:d})
            res.render('displayNodesByLabel.jade',data={header:"Nodes by label:",label:req.params.label,json:nodes})
//              passToBrowser(res,req.params.docbase,results)
        }
    }
}


exports.getNodeById = function(req,res) {
	function neo4jExtractDataRows(req,res,body) {
		var b=JSON.parse(body)
		console.log("----------")
		console.log(res.statusCode)
		if (res.statusCode == 200) {
    		var d=b
    		console.log(JSON.stringify(d))
//    		console.log("found "+b.data.length+" row(s) of type "+Object.prototype.toString.call(b.data))
	    	switch (req.headers.accept) {
			case 'application/json':
				res.setHeader('content-type','application/json')
				res.write(JSON.stringify(b.data))
				res.end()
				break
			default:				
//                res.render('nodeDisplay.jade',data={header:"Neo4j complete node details:",json:JSON.stringify(d)})
                res.render('displayNode.jade',data={header:"Neo4j complete node details:",json:d})
//				passToBrowser(res,req.params.docbase,results)
            }
    	}
    	else {
            switch (req.headers.accept) {
            case 'application/json':
                res.setHeader('content-type','application/json')
                res.status(404)
                res.write("{'msg':'Not found'}")
                res.end()
                break
            default:                
                res.status(404)
                res.render('error.jade',data={title:"Not found",msg:""})
//              passToBrowser(res,req.params.docbase,results)
            }
    	}	
    }
	function neo4jGetNodeById(req,res) {
		var DBROUTE="http://localhost:7474/db/data/node/"+req.params.id
		options={
			url:DBROUTE,
			method:"GET",
			headers:{'content-type':'application/json'},
			}
		console.log("Calling Neo4j broker with:"+JSON.stringify(options))
		var request = require('request');
		request(options,_CB_afterCypher)
	}

	console.log('get type by id')
	neo4jGetNodeById(req,res)

    function _CB_afterCypher(error, response, body) {
        console.log("switching...")
        if (!error) { 
            switch (response.statusCode) {
                case 200: {
                    console.log("OK  "+response.statusCode+":"+options.url+":Neo4j results="+body)
                    neo4jExtractDataRows(req,res,body)
                    break
                }  // end HTTP 200
                default: {
                    console.log("!OK  "+response.statusCode+":"+options.url+":Neo4j results="+body)
                    res.status(404)
                    res.render('error.jade',data={title:"Not found",msg:body})
                    break
                }
            }
        }
        else {
            console.log("!OK "+response.statusCode+":"+options.url+":Neo4j results="+body)
        }
    }
}


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
