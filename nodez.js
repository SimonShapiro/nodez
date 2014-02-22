function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
}
function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}
function Factory(o,options) {
    var newO=Object.create(o)
    o.__init__(options)
    return newO
}

var GeneralNodePattern = {
    name:"",
    label:"",
    __init__:function (options) {
        console.log("Initializing with "+JSON.stringify(options))
        if (options) {
            for (opt in options) {
                this[opt]=options[opt]
            }
        }
        this.uuid = guid()
        this.revision = 1
        this.creationDate = new Date().toISOString()
        this.lastModifiedDate = new Date().toISOString()
    },
    toNeo4j:function () {
        var str=""
        for (i in this) {
            switch (Object.prototype.toString.call(this[i])) {
                case "[object String]": {
                    str=str+" "+i+" "+this[i]+" "+" "+Object.prototype.toString.call(this[i])+"\n"
                    break
                }
                case "[object Number]": {
                    str=str+" "+i+" "+this[i]+" "+" "+Object.prototype.toString.call(this[i])+"\n"
                    break
                }
            }
        }
        return str
    },
    ExtractNeo4jData:function () {
        var data = {}
        for (i in this) {
            switch (Object.prototype.toString.call(this[i])) {
                case "[object String]": {
                    data[i]=this[i]
                    break
                }
                case "[object Number]": {
                    data[i]=this[i]
                    break
                }
                case "[object Array]": {
                    data[i]=this[i]
                    break
                }
            }
        }
        return data
    },
    save:function(d,_CB_) {
        var DBROUTE="http://localhost:7474/db/data/"
        options={ 
            url:DBROUTE+'node',
            method:"POST",
            headers:{'content-type':'application/json'},
            body:JSON.stringify(d.ExtractNeo4jData())
            }
        console.log("Calling Neo4j broker with:"+JSON.stringify(options))
        var request = require('request');
        request(options,afterPosting)
    },
    cypherSave:function(d,_CB_) {
        var DBROUTE="http://localhost:7474/db/data/cypher/"
//      cypher=""
//      cypher=cypher+'{ 'query' : 'create (n:"+d.ExtractNeo4jData().label+" { props } ) return n ',"
//      cypher=cypher+"'params': { 'props' :  "+JSON.stringify(d.ExtractNeo4jData())+" } }"
        cypher={
            "query":"create (n:"+d.ExtractNeo4jData().label+" { props } ) return n",
            "params": {
                "props": d.ExtractNeo4jData()
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
        request(options,_CB_)
    }   
}



exports["GeneralNode"] = function (label,nm,data) {
    g=Factory(GeneralNodePattern,{"label":label,"name":nm})
        if (data) {
            for (d in data) {
        	g[d]=data[d]
        }
    }
    return g
}

exports["newTypeNode"] = function (nm,data) {
    g=Factory(GeneralNodePattern,{"label":"Types","name":nm})
    if (data) {
        for (d in data) {
        g[d]=data[d]
        }
    }
    saveNode(d,_CB_nodeSaved)
}

saveNode = function(d) {
    var DBROUTE="http://localhost:7474/db/data/cypher/"
    cypher={
        "query":"create (n:"+d.ExtractNeo4jData().label+" { props } ) return id(n),n",
        "params": {
            "props": d.ExtractNeo4jData()
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
    request(options,function(error,response,body) {
        if (!error) { 
            switch (response.statusCode) {
                case 200: {
                    console.log("OK  "+response.statusCode+":"+options.url+":Neo4j results="+body)
                    return body
                }  // end HTTP 200
                default: {
                    console.log("!OK  "+response.statusCode+":"+options.url+":Neo4j results="+body)
//                    res.status(404)
//                    res.render('error.jade',data={title:"Not found",msg:body})
                    break
                }
            }
        }
        else {
            console.log("!OK "+response.statusCode+":"+options.url+":Neo4j results="+body)
        }
        
    })
}   


getTypeNode = function(type,_CB_) {
    var DBROUTE="http://localhost:7474/db/data/cypher/"
    cypher={
        "query":"match (n) where n.name={nm} return n",
        "params": {
            nm:type
        }
    }
    console.log(JSON.stringify(cypher))
    options={
        url:DBROUTE,
        method:"POST",
        headers:{'content-type':'application/json'},
        body:JSON.stringify(cypher)
        }
    console.log("Calling Neo4j broker with:"+JSON.stringify(options.body))
    var request = require('request');
    request(options,function(error,response,body) {
        if (!error) { 
            switch (response.statusCode) {
                case 200: {
                    console.log("OK  "+response.statusCode+":"+options.url+":Neo4j results="+body)
                    _CB_(body)
                    break
                }  // end HTTP 200
                default: {
                    console.log("!OK  "+response.statusCode+":"+options.url+":Neo4j results="+body)
//                    res.status(404)
//                    res.render('error.jade',data={title:"Not found",msg:body})
                    break
                }
            }
        }
        else {
            console.log("!OK "+response.statusCode+":"+options.url+":Neo4j results="+body)
        }
        
    })
}

exports["newNodeOfType"] =  function(type,nm,data) {

    _CB_saved = function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("OK  "+response.statusCode+":"+options.url+":Neo4j results="+body)
        }
        else {
            console.log("!OK "+response.statusCode+":"+options.url+":Neo4j results="+body)
        }
    }
    _CB_getTypeNode=function(body){
        b=JSON.parse(body)
        console.log("Working with...")
        console.log(b.data[0][0].data.template)
        t=b.data[0][0].data.template
        n=Factory(GeneralNodePattern,{"label":type,"name":nm,"template":t})
        console.log("manufactured "+JSON.stringify(n))
        n.cypherSave(n,_CB_saved)
    }

// ensure that type node exists
    getTypeNode(type,_CB_getTypeNode)
// get template from type node
// manufacture general node of type node
// add template
// add data
}
