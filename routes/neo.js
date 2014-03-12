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
            navigate='http://'+req.get('host')+'/neo4j/node/'+id+'/navigate'
            nodes.push({data:d[n].data,self:d[n].self,id:id,verbose:verbose,navigate:navigate})
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
            console.log(JSON.stringify(b))
            console.log(req.headers.accept)
//          console.log("found "+b.data.length+" row(s) of type "+Object.prototype.toString.call(b.data))
            switch (req.headers.accept) {
            case 'application/json':
                res.setHeader('content-type','application/json')
                res.write(JSON.stringify(b))
                res.end()
                break
            default:                
//                res.render('nodeDisplay.jade',data={header:"Neo4j complete node details:",json:JSON.stringify(d)})
                res.render('displayNode.jade',data={header:"Neo4j complete node details:",json:b})
//              passToBrowser(res,req.params.docbase,results)
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

// !!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!
exports.getNodeByIdWithNavigation = function(req,res) {
    returning={}
    console.log('get type by id')
    neo4jGetNodeById(req,res)

    function abend(statusCode,errMsg) {
        switch (req.headers.accept) {
        case 'application/json':
            res.setHeader('content-type','application/json')
            res.status(statusCode)
            res.write("{'msg':'"+errMsg+"'}")
            res.end()
            break
        default:                
            res.status(statusCode)
            res.render('error.jade',data={title:"Error: ",msg:errMsg})
//              passToBrowser(res,req.params.docbase,results)
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
                    abend(response.statusCode,"node not found")
                }
            }
        }
        else {
            console.log("!OK "+response.statusCode+":"+options.url+":Neo4j results="+body)
            abend(500,"server error retrieving node")
        }
    }
    function neo4jExtractDataRows(req,res,body) {
        var b=JSON.parse(body)
        console.log("----------")
        console.log(res.statusCode)
        returning["data"]=b.data
//        returning["outLinks"]=b.outgoing_relationships
//        returning["inLinks"]=b.incoming_relationships
        console.log(JSON.stringify(b))
        console.log(req.headers.accept)
        processOutLinks(req)
    }
    function processOutLinks(req) {  //process out links
        var DBROUTE="http://localhost:7474/db/data/cypher"
        cypher={
            "query":"match (m)-[rr]->(n) where id(m)={id} return type(rr),labels(n),n.name,id(n)",
            "params":{
                "id":eval(req.params.id)  //must be a number to be a valid neo4j id
            }
        }
        var results={}
        var options={
            url:DBROUTE,
            method:"POST",
            headers:{'content-type':'application/json'},
            body:JSON.stringify(cypher)
            }
        console.log("Calling Neo4j broker with:"+JSON.stringify(options))
        var request = require('request');
        request(options,function(error,response,body) {
            if (error) {
                abend(500,"server error retrieving node")
            }
            else {
                console.log(body,typeof body)
                var links=JSON.parse(body).data
                console.log(links,typeof links,(links==[]))
//                if (links) {
                    console.log("I have inlinks",body,JSON.parse(body).length)
                    for (var n in links) {
                        console.log(links[n][0])
                        if (results[links[n][0]]==undefined) {
                            results[links[n][0]]=[]
                        }
                        console.log(links[n][3])
                        results[links[n][0]].push({
                            "endType":links[n][1][0],  //type is represented by a label which in neo4j is an array
                            "endName":links[n][2],
                            "endId":links[n][3],
                            "endNavigator":'http://'+req.get('host')+'/neo4j/node/'+links[n][3]+'/navigate'
                        });
                    }
                    console.log(results);
                    returning["outLinkDetails"]=results;
                    processInLinks(returning);
//                }
//               else {
//                    console.log("no out links")
//                    processInLinks(returning);
//                }
            }
        })
    }
    function processInLinks(returning) {  //process in links
        var DBROUTE="http://localhost:7474/db/data/cypher"
        cypher={
            "query":"match (m)<-[rr]-(n) where id(m)={id} return type(rr),labels(n),n.name,id(n)",
            "params":{
                "id":eval(req.params.id)  //must be a number to be a valid neo4j id
            }
        }
        var results={}
        var options={
            url:DBROUTE,
            method:"POST",
            headers:{'content-type':'application/json'},
            body:JSON.stringify(cypher)
            }
        console.log("Calling Neo4j broker with:"+JSON.stringify(options))
        var request = require('request');
        request(options,function(error,response,body) {
            if (error) {
                abend(500,"server error retrieving node")
            }
            else {
                console.log(body,typeof body)
                var links=JSON.parse(body).data
                console.log(links,typeof links,(links==[]))
//                if (links) {
                    console.log("I have inlinks",body,JSON.parse(body).length)
                    for (var n in links) {
                        console.log(links[n][0])
                        if (results[links[n][0]]==undefined) {
                            results[links[n][0]]=[]
                        }
                        console.log(links[n][3])
                        results[links[n][0]].push({
                            "endType":links[n][1][0],  //type is represented by a label which in neo4j is an array
                            "endName":links[n][2],
                            "endId":links[n][3],
                            "endNavigator":'http://'+req.get('host')+'/neo4j/node/'+links[n][3]+'/navigate'
                        })
                    }
                    console.log(results);
                    returning["inLinkDetails"]=results;
                    sendResults(returning);
//                }
//                else {
//                    console.log("no in links")
//                    sendResults(returning);
//                }
            }
        })
    }
    function sendResults(returning) {
        switch (req.headers.accept) {
        case 'application/json':
                console.log(returning)
            res.setHeader('content-type','application/json')
            res.write(JSON.stringify(returning))
            res.end()
            break
        default:                
//                res.render('nodeDisplay.jade',data={header:"Neo4j complete node details:",json:JSON.stringify(d)})
            res.render('navigateNode.jade',data={header:"Neo4j node details with navigation:",json:returning})
//              passToBrowser(res,req.params.docbase,results)
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
