// http://127.0.0.1:5984/rules/_design/rules/_view/rulesByConclusion?startkey=[%22a%22,%22b%22]&endkey=[%22a%22,%22b%22]

// need to route couch requests via a persistance module to facilitate db change
/*
 * CRUD - create, read, update, delete  in REST post, get, put, delete
 *readJsonFromPersistance(persistanceInstanceIdentifier,persistanceQuery)
 * 	return persistanceResult
 * 
 * 
 * FOR couch DB
 * 
 * persistanceInstanceIdentifier
 * 	{
 * 	url:"string"
 * }
 * 
 * persistanceQuery
 * 	{
 * 	xpath:"string"    // to complete URL together with :fields and startkey endkeys
 * }
 * 
 * persistanceResult  // should coding follow HTTP?  or -'ve = fail various and +'ve = success various 
 * 	{
 * 	statusCode: {code:999,description:""},
 * jsonResult:{
 * 		resObject:{},
 * 		resString:{}
 * 		}
 * }
 * 
 * 
 * Example from below:
 * 
 * persistanceInstanceIdentifier
 * 	{
 * 	url:DBROUTE
 * }
 * 
 * persistanceQuery
 * 	{
 * 	xpath:"rules/_design/rules/_view/rulesByConclusion"    // to complete URL together with :fields and startkey endkeys
 * }
 * 
 * ret=readJsonReadFromPersistance(persistanceInstanceIdentifer,persistanceQuery)
 * if (ret.status.code<0) {
 * 		set-up error message
 * }
 * else {
 * 		set up and use returned data structure ret.jsonResult.resObjec or ret.jsonResult.resString
 * }
 * ...
 * res.render(jade,data)
 * 
 */

function persistenceObject() {
}
persistenceObject.prototype= {
	constructor:persistenceObject,
	onSave: function() {
		var jsBefore=JSON.stringify(js)  //A trick for getting a deep copy?
		tree2JS(tr,js)
		j=JSON.stringify(js)
		request=$.ajax({
			url:"/rule/"+js["_id"],
			type:"put",
			data:{json:j},
			success:function(data) {
	//			alert('page content: ' + JSON.stringify(data))
	//    		msg("Updated "+JSON.stringify(data))
	    		alert("Updated "+JSON.stringify(data))
	    		js["_rev"]=data["rev"]
				tr=new jsNode("root",{})
				js2Tree(tr,js)
				//need to reset all features
	//			tr.setVisibility(false,true)
				if (features.length>0) {
					jsFeatureInstall(tr,features,[])
				}
				$(".jsForm").empty()
				treeWalker(tr,buildForm,"0","normal")
			},
			error:function(data) {
				s=JSON.parse(data["responseText"])
				alert("Failure "+JSON.stringify(s.reason))
	    		js=JSON.parse(jsBefore)
				resetForm()  //consiider setting a paramter on reetForm to be resetForm with ...
			}
		});
	},
	onSaveAs:function () {
		var jsBefore=JSON.stringify(js)  //A trick for getting a deep copy?
	//	alert(jsBefore)
		var _id=prompt("Enter _id for document","Automatically assigned")
		if (_id) {
			tree2JS(tr,js)
			if (_id=="Automatically assigned") {
				delete js["_id"]
			}
			else {
				js["_id"]=_id
			}
			delete(js["_rev"])
			j=JSON.stringify(js)
			request=$.ajax({
				url:"/rule/"+js["_id"],
				type:"post",
				data:{json:j},
				success:function(data) {
		//			alert('page content: ' + JSON.stringify(data))
					if(data.error) {
						alert(JSON.stringify(data))
			    		js=JSON.parse(jsBefore)
						resetForm()  //consiider setting a paramter on reetForm to be resetForm with ...
					}
					else {
						alert("Created "+JSON.stringify(data["id"]))
						window.location.href="/rule/"+data["id"];
					}
				},
				error:function(data) {
					s=JSON.parse(data["responseText"])
					alert("Failure "+JSON.stringify(s.reason))
		    		js=JSON.parse(jsBefore)
					resetForm()  //consiider setting a paramter on reetForm to be resetForm with ...
				}
			});
		}
	},  //end onSaveAs
	onDelete:function deleteForm() {
		tree2JS(tr,js)
		j=JSON.stringify(js)
		alert("Ready to delete:"+JSON.stringify(j))
		request=$.ajax({
			url:"/rule/"+js["_id"],
			type:"delete",
			data:{json:j},
			success:function(data) {
	//			alert('page content: ' + JSON.stringify(data))
	    		alert("Deleted "+JSON.stringify(data))
				window.location.assign("/rules")
			},
			error:function(data) {
				s=JSON.parse(data["responseText"])
				alert("Failure "+JSON.stringify(s.reason))
	    		js=JSON.parse(jsBefore)
				resetForm()  //consiider setting a paramter on reetForm to be resetForm with ...
			}
		});
	//	alert("back")
	}
}

// ============================================== Browser objects aobve this line ==============================

exports.listAll = function (req,res) {
	if (req.params.matchingTarget) {
		console.log("Goal search"+req.params.matchingTarget)
	}
	else {
		options={
		url:DBROUTE+"rules/_design/rules/_view/rulesByConclusion",
		method:"GET",
		headers:{'content-type':'application/json'},
		body:req.body.json
		}
		console.log(JSON.stringify(options))
		var request = require('request');
		request(options, function (error, response, body) {
			if (!error && response.statusCode == 200) {
	//			res.statusCode=response.statusCode
				res.render('allRules.jade',{data:JSON.parse(body)})
				console.log("OK"+body)
			}
		  	else {
				res.setHeader('content-type','application/json')
				res.write(body)
				res.end()
		  		console.log("FAIL:"+response.statusCode+JSON.stringify(body))
		  	}
		})
	}
};

exports.analyseRule = function (req,res) {

	function emitRule(r) {
		console.log(r)
//		collector.concat(r)
	}

	function collectLeafNodes(lhs,rules) {

		function matchingLHS(pattern,rules) {	//paatern consists of item,operator,value found at positions 1,2,3
	/*
	 * Also need to be able to match on inverts for 
	 * 	is		|	is not,
	 * 	is not	|	is,
	 * 	==		|	!=,
	 * 	!=		|	==,
	 * 	<		|	>=,
	 * 	<= 		|	>,
	 * 	>		|	<=,
	 * 	>=		|	<
	 * 
	 */
			var inverts=[]
			
			inverts["is"]="is not"
			inverts["is not"]="is"
			inverts["=="]="!="
			inverts["!="]="=="
			inverts["<"]=">="
			inverts["<="]=">"
			inverts[">"]="<="
			inverts[">="]="<"			
	
			var ret=[]
			for (r in rules) {
//				console.log("testing "+JSON.stringify(rules[r].lhs)+":"+JSON.stringify(lhs))
				if ((rules[r].lhs.kItem==lhs.kItem)&&(rules[r].lhs.kOperator==lhs.kOperator)&&(rules[r].lhs.kValue==lhs.kValue)) {
					console.log("found match "+r)
					ret.push(rules[r])
				}
				else {
					if ((rules[r].lhs.kItem==lhs.kItem)&&(rules[r].lhs.kOperator==inverts[lhs.kOperator])&&(rules[r].lhs.kValue==lhs.kValue)) {
						console.log("found match "+r)
						ret.push(rules[r])
					}
				}
			}
//			console.log("returning "+JSON.stringify(ret))
			return ret
		}
		
//		var col=collector
		console.log('going after leaf collection '+JSON.stringify(lhs))
		var ret=matchingLHS(lhs,rules)
//		console.log("receiving "+JSON.stringify(ret.length)+"based on"+JSON.stringify(lhs))
		if (ret.length>0) {
			for (var lhs in ret) {
//				console.log(ret[lhs].lhs)
				for (var r in ret[lhs].rhs) {
					var next={lhs:{kItem:ret[lhs].rhs[r].kItem,kOperator:ret[lhs].rhs[r].kOperator,kValue:ret[lhs].rhs[r].kValue}}
//					console.log('planning for '+JSON.stringify(next))
					collectLeafNodes(next.lhs,rules,collector)
//					console.log("concats"+JSON.stringify(collector))
				}
			}
		}
		else {
//			console.log('collecting '+JSON.stringify(lhs))
			emitRule(lhs)
			collector=collector.concat(lhs)
//			console.log(ret[r])
		}
/*
		if (rules[id]==undefined) {
			console.log(id+" is a leaf")
		}
		else {
			for (r in rules[id]) {
				var dep=rules[id][r]
				console.log('trying for '+dep.slice(3,5)+":"+rules[id])
				collectLeafNodes(r,rules,collector)
			}
		}
*/
	}
	/*
	 *   Find terminal nodes recursivly (over the db interface!!!).

	function findDataNeeded (id,collector) {
		console.log("Collecting for "+id+":"+collector)
	}
	 */

	var collector=[]
	var rulebase_options={
		url:DBROUTE+"rules/_design/rules/_view/rulebase",  // consider being specific here or pass all lhs to the render
		method:"GET",
		headers:{'content-type':'application/json'},
		body:req.body.json
	}
	console.log('going for data:'+JSON.stringify(rulebase_options))
	var rulebase_request=require('request')
	rulebase_request(rulebase_options, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			rulebase_details=JSON.parse(body).rows
//			console.log("here "+req.params.id)
			var rulebase=[]				
			for (r in rulebase_details) {	// consider selecting a smaller set of returned values here
//				console.log(rhs_details[r].id)
				rulebase[rulebase_details[r].id]=rulebase_details[r].value
//				console.log(JSON.stringify(rulebase[rhs_details[r].id]))
			}
//			console.log(rulebase)				
//			console.log("there")
			collector=[]
			sum_col={}
			collectLeafNodes(rulebase[req.params.id].lhs,rulebase,collector)
			console.log("==============Going after duplicates=============")
			for (r in collector) {
				console.log('collector '+JSON.stringify(collector[r]))
				if (sum_col[collector[r].kItem]) {  //test for duplicates
					var found=false
					for (var i=0;i<sum_col[collector[r].kItem].kDetails.length;i++) {
						console.log("comparing: "+sum_col[collector[r].kItem].kDetails[i].kValue+" with "+collector[r].kValue+"==========>")
						if (collector[r].kValue==sum_col[collector[r].kItem].kDetails[i].kValue) {
							found=true
							break //no need to continue looping
						}
					}
					if(found) {
						console.log("duplicate found")
					}
					else {
						sum_col[collector[r].kItem].kDetails.push({kOperator:collector[r].kOperator,kValue:collector[r].kValue})
					}
				}
				else {
					sum_col[collector[r].kItem]={kItem:collector[r].kItem,kDetails:[{kOperator:collector[r].kOperator,kValue:collector[r].kValue}]}
				}
			}
			console.log("++++++++++++++before render++++++++++++++")
			for (r in sum_col) {
				console.log(sum_col[r])
			}
			console.log("summary: "+JSON.stringify(sum_col))
			res.render('analysis.jade',{data:sum_col})
		}
		else {
			console.log("FAIL")	
		}
	})
}

exports.newRuleBasedOnWhenItem = function(req,res) {
	console.log(req.params.item+":"+req.params.operator+":"+req.params.value)
	var id=req.params.item+" "+req.params.operator+" "+req.params.value
	var json = {
		_id: id,
		_rev: "",
		description:"New rule setting out the conclusion "+id,
		conclude: {
			kItem:req.params.item,
			kOperator:req.params.operator,
			kValue:req.params.value
		},
		when: [
			{
				kLogic:"WHEN",
				kItem:"x",
				kOperator:"is",
				kValue:"true"
			}
		]
	}
	res.render('editNewRuleBasedOnWhen.jade',data={header:"New rule for "+id,json:JSON.stringify(json)})
}

exports.putRule = function(req,res) {
	var handleDb = function(status,results) {
		console.log("CallBack knows that status="+status+":"+results)
//		passToBrowser(res,req.params.docbase,results)
		res.setHeader('content-type','application/json')
		res.write(results)
		res.end()
		console.log("OK"+results)
	}
	console.log("Asked to save rule.......")
//	var db=require('/couchBroker')//
//	db.getDoc(req.params.docbase,req.params.doc)
	var cB=require('couchBroker.js')
	var db=new cB.couchBroker(DBROUTE)  //eventually call a a factory based on access method
	console.log("Asked to put "+req.body.json)
	db.putDoc("rules",req.params.id,req.body.json,handleDb)
}

exports.postRule = function(req,res) {
	var handleDb = function(status,results) {
		console.log("CallBack knows that status="+status+":"+results)
//		passToBrowser(res,req.params.docbase,results)
		res.setHeader('content-type','application/json')
		res.write(results)
		res.end()
		console.log("OK"+results)
	}
	console.log("Asked to save rule.......")
//	var db=require('/couchBroker')//
//	db.getDoc(req.params.docbase,req.params.doc)
	var cB=require('couchBroker.js')
	var db=new cB.couchBroker(DBROUTE)  //eventually call a a factory based on access method
	console.log("Asked to post "+req.body.json)
	db.postDoc("rules",req.params.id,req.body.json,handleDb)
}

exports.editRule = function(req,res) {
	var handleDb = function(status,results) {
		var pers=new persistenceObject()
		console.log("CallBack knows that status="+status)
		res.render('editRule.jade',data={
			header:"Rule editor:",
			docbase:'rules',
			json:results,
			persist: pers 
		})
	}
//	var db=require('/couchBroker')//
//	db.getDoc(req.params.docbase,req.params.doc)
	var cB=require('couchBroker.js')
	var db=new cB.couchBroker(DBROUTE)  //eventually call a a factory based on access method
	db.getDoc('rules',req.params.id,handleDb)
}

exports.deleteRule=function(req, res){
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
	db.deleteDoc('rules',req.params.id,rev,handleDb)  //eventuall .doc and rev will form the oid object
};

exports.displayRule = function (req,res) {
/*
 * Also need to be able to match on inverts for 
 * 	is		|	is not,
 * 	is not	|	is,
 * 	==		|	!=,
 * 	!=		|	==,
 * 	<		|	>=,
 * 	<= 		|	>,
 * 	>		|	<=,
 * 	>=		|	<
 * 
 */
	var inverts=[]
	
	inverts["is"]="is not"
	inverts["is not"]="is"
	inverts["=="]="!="
	inverts["!="]="=="
	inverts["<"]=">="
	inverts["<="]=">"
	inverts[">"]="<="
	inverts[">="]="<"
					
//	There is an async issue here	

	var data   // needs to come out

	var handleDb = function(status,results) {
		console.log("CallBack knows that status="+status)
//		res.render('displayRule.jade',data={
//			header:"Rule editor:",
//			docbase:'rules',
//			json:results
//		})
		if (status==200) {
			data=JSON.parse(results)
			console.log("Async 0 "+JSON.stringify(data))
// --- Matched {} in here
			var lhs_options={
				url:DBROUTE+"rules/_design/rules/_view/rule_lhs",  // consider being specific here or pass all lhs to the render
				method:"GET",
				headers:{'content-type':'application/json'},
				body:req.body.json
			}
			console.log('going for data:'+JSON.stringify(lhs_options))
			var lhs_request=require('request')
			lhs_request(lhs_options, function(error, response, body) {
				if (!error && response.statusCode == 200) {
					var lhs=JSON.parse(body).rows
					console.log(lhs.length)
					var lookup=[]
					for (var i in lhs) {  // this has got a 'landmine' when the same rhs appears twice in different context on the same rule
						lookup[lhs[i].key[0]]={lhs:[lhs[i].key[0],lhs[i].key[1],lhs[i].key[2]],id:lhs[i].id}					
					}
//					console.log(data.when)
//					console.log(lookup)
					for (w in data.when) {
						var link=lookup[data.when[w].kItem]
						if (link==undefined) {
							link="UNDEFINED"
							data.when[w].kLink={link:link,type:'UNDEFINED'}
						}
						else {
							var test=((data.when[w].kOperator==lookup[data.when[w].kItem].lhs[1])&&(data.when[w].kValue==lookup[data.when[w].kItem].lhs[2]))
//							console.log(test)
							if (test) {
								data.when[w].kLink={link:link.id,type:'exact'}
								// this would be the position of a recursive call
							}
							else {
								console.log("Trying for "+inverts[data.when[w].kOperator]+" over "+lhs.kOperator)
								test=((inverts[data.when[w].kOperator]==lookup[data.when[w].kItem].lhs[1])&&(data.when[w].kValue==lookup[data.when[w].kItem].lhs[2]))
								if (test) {
									data.when[w].kLink={link:link.id,type:'exact'}
								}
								else {
									data.when[w].kLink={link:link.id,type:'partial'}
								}
//							console.log(data.when[w].kItem,link)
							}
						}
					}
					console.log(JSON.stringify(data))
					res.render('displayRule.jade',{data:data})
				}
			  	else {
					res.setHeader('content-type','application/json')
					res.write(body)
					res.end()
			  		console.log("FAIL:"+response.statusCode+JSON.stringify(body))
			  	}
			  })}// ---
		else {
			res.setHeader('content-type','application/json')
			res.write(results)
			res.end()
	  		console.log("FAIL:"+res.statusCode+JSON.stringify(results))
		}
	}
//	var db=require('/couchBroker')//
//	db.getDoc(req.params.docbase,req.params.doc)
	var cB=require('couchBroker.js')
	var db=new cB.couchBroker(DBROUTE)  //eventually call a a factory based on access method
	db.getDoc('rules',req.params.id,handleDb)
	console.log("Async 1 "+JSON.stringify(data))
//				request.close()
};
