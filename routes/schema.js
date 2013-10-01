schema={
"title":"Data Dictionary Attribute",
"description":"This is the json schema of a core data attribute",
"type":"object",
"properties": {
                "name":{"type":"string"},
                "description":{"type":"string"},
                "relevant documentation links":{"type":"array", "items":{ "type":"object",
                                "properties":{
                                                "doc link name":{"type":"string"},
                                                "doc llnk description":{"type":"string"},
                                                "doc link":{"type":"string"}
                                }}
                }
//            "test array":{"type":"array","items":{"type":number}}
                },
"required":["name"]
}
 
function walkSchema(s,str) {
	for (o in s.properties) {
		console.log(o+": "+s.properties[o].type)
		str.addSnippet(o+": "+s.properties[o].type+": ")
		switch (s.properties[o].type) {
			case "object": {
				console.log(" processing an object")
				str.addSnippet(" processing an object\n")
				walkSchema(s.properties[o],str)
				break
			}
			case "array": {
				console.log(" processing an array")
				str.addSnippet(" processing an array\n")
				walkSchema(s.properties[o].items,str)
				break
			}
			default:
				console.log(" processing everything else")
				str.addSnippet(" processing everything else\n")
		}
	}
}

function stringAccumulator() {
	this.str=""
}
stringAccumulator.prototype = {
	constructor: stringAccumulator,
	addSnippet: function(s) {
		this.str=this.str+s
	}	
}
 
function jsonNodeProcessor() {
	this.str=[]
	this.jPaths=[]
	this.stack=[]
}
jsonNodeProcessor.prototype = {
	constructor: jsonNodeProcessor,
	addSnippet: function(n,stk,value) {
		console.log("received stk="+JSON.stringify(stk))
		this.str.push({"name":n,"path":eval(JSON.stringify(stk)),"value":value})  // a device because stk is a pointer
	}	
}
 
function jsonWalker(s,fn,call,stack) {
	this.stack=stack
	for (n in s) {
		console.log("in jsonwalker with "+n+":"+Object.prototype.toString.call(s[n]))
		this.stack.push(n)
		fn[call](n,this.stack,s[n])
		console.log("in jsonwalker stack contents "+JSON.stringify(this.stack))
		switch (Object.prototype.toString.call(s[n])) {
			case "[object Array]": {
				break
			}
			case "[object Object]": {
				jsonWalker(s[n],fn,call,this.stack)
			}
			default: {
				break
			}	
		}
		this.stack.pop()
	}
}

function jsonSchema(schema) {
	this.example=new Object()
	this.example.warnings=[]
	this.example.errors=[]
	this.schema=schema
	this.head={}
}	
jsonSchema.prototype={
	constructor:jsonSchema,
	schemaString:function(key) {
		if (key.name == '$schema') {
			console.log("going for $schema of "+key.value)
			this.example["$schema"]=key.value
			return true
		}
		else {
			return false
		}
	},
	titleString: function(key) {
		if (key.name == 'title') {
			console.log("going for title of "+key.value)
			this.example.title=key.value
			console.log(JSON.stringify(this.example))
			return true
		}
		else {
			return false
		}
	},
	descriptionString:function (key) {
		if (key.name == 'description') {
			console.log("going for description of "+key.value)
			this.example["description"]=key.value
			return true
		}
		else {
			return false
		}
	},
	objectType:function(key) {
		if ((key.name == 'type')) {
			console.log("going for type of "+key.value)
			this.example.type=key.value
			if (key.value=="object") {
				return true
			}
			else {
				this.example.warnings.push({description:"'object' expected",at:key.path})			
				return true
			}
		}
		else {
			return false
		}
	},
	stringPropertyType:function(key) {
		if ((key.name == 'type')) {
			console.log("going for type of "+key.value)
			this.example.type=key.value
			if (key.value=="string") {
				return true
			}
			else {
				this.example.warnings.push({description:"'object' expected",at:key.path})			
				return true
			}
		}
		else {
			return false
		}
	},
	propertyDefault:function (key) {
		if (key.name == 'default') {
			console.log("going for default "+key.value)
//			this.example["description"]=key.value
			return true
		}
		else {
			return false
		}
	},
	aProperty:function(key) {
		this.propertyNode={}
		console.log("aProperty:"+JSON.stringify(key.name))
		this.head=this.schema.shift()
		console.log("trying "+JSON.stringify(this.head))
		if (this.stringPropertyType(this.head)) {this.propertyNode.type=this.head.value; this.head=this.schema.shift()}
		if (this.propertyDefault(this.head)) {this.propertyNode.def=this.head.value; this.head=this.schema.shift()}
		console.log("recognized "+JSON.stringify(this.propertyNode))
	},
	propertyGroup:function (key) {
		if(key.name=='properties') {
			if (Object.prototype.toString.call(key.value)=='[object Object]') {
				console.log("I have properties")
				this.head=this.schema.shift()
				for (p in key.value) {
					console.log("looking for property"+p+":"+this.head)
					this.aProperty(this.head)
				}
				return true
			}
			else {
				this.example.errors.push({description:"Expecting an [Object]",at:key.path})
				return false
			}
		}
		else {
			return false
		}
	},
	parseSchema: function() {
		this.head=this.schema.shift()
		if (this.schemaString(this.head)) {this.head=this.schema.shift()}
		if (this.titleString(this.head)) {this.head=this.schema.shift()}
		if (this.descriptionString(this.head)) {this.head=this.schema.shift()}
		if (this.objectType(this.head)) {this.head=this.schema.shift()}
		if (this.propertyGroup(this.head)) {this.head=this.schema.shift()}
	}
}
 
exports.generateExample = function(req,res) {
	console.log(req.body)
//	sAcc = new stringAccumulator()
//   	walkSchema(req.body,sAcc)
	nProc=new jsonNodeProcessor()
	stack=new Array()
	jsonWalker(req.body,nProc,"addSnippet",stack)
	console.log("+++++++++++++")
	eg=new jsonSchema(nProc.str)
	eg.parseSchema()
	console.log("+++++++++++++")
	res.setHeader('content-type','application/json')
//	res.write(JSON.stringify(nProc.str))
	res.write(JSON.stringify(eg.example))
	res.end()
}
