var G = require('nodez/nodez.js')

var mac=[]
mac["start"]=[]
mac["start"]["go"]=function () {deleteAll()}
mac["addType"]=[]
mac["addType"]["go"]=function () {
    d=new G.GeneralNode('Types','Cluster',{name:"Cluster",template:"{'description':'string','objectives':'string'}"})
    d.cypherSave(d,_CB_nodeSave)
}

var _CB_nodeSave = function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log("OK  "+response.statusCode+":"+options.url+":Neo4j results="+body)
    }
    else {
        console.log("!OK "+response.statusCode+":"+options.url+":Neo4j results="+body)
    }
}


var _CB_deleteAll = function (error, response, body) {
    console.log("back...")
    if (!error && response.statusCode == 200) {
        console.log("OK  "+response.statusCode+":"+options.url+":Neo4j results="+body)
        mac["addType"]["go"]()
    }
    else {
        console.log("!OK "+response.statusCode+":"+options.url+":Neo4j results="+body)
    }
//          callBack(response.statusCode,body)
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
    console.log("Calling Neo4j broker with:"+JSON.stringify(options))
    var request = require('request');
    console.log('Http async')
    request(options,_CB_deleteAll)
}

startTestSequence=function() {
//    deleteAll()
    mac["start"]["go"]()
}

exports["Save a type"]=function(test) {
    //    statemac(mac,"start","go")
    startTestSequence()
    test.done()
}
