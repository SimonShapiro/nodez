
function showEscaped(txt) {
	console.log('escaping:'+escape(txt))
}

tokens = [
//	{regex: /\n/g,token:'_RB_'},
//	{regex: /\n/g, token:'_NL'},
	{regex: /=/g,token:'_EQ_'},
	{regex: /\t</g, token: 'TABWHEN_'},
	{regex: /\t\|/g,token:'TABOR_'},
	{regex: /\t-/g,token:'TABAND_'},
	{regex: /\t/g,token:'TAB_'},
	{regex: /&/g,token:'_AND_'}
]

function lex(txt) {
	txt=txt.split("\n")
	for (l in txt) {
		for (t in tokens) {
			txt[l]=txt[l].replace(tokens[t].regex,tokens[t].token)
			// detect empty line to indicate end of rule
			if(!txt[l]) {
				txt[l]="NRule"
			}
		}
		txt[l]=txt[l].replace(/_[ ]+/,"_")
		console.log(l+":"+txt[l])
		txt[l]=txt[l].split("_")
	}
	console.log(txt)
	return txt
}

function rulez(txt) {
	console.log(txt)
	console.log(txt.split("_"))
	txt=txt.split("_")
	for (i in txt) {
		console.log(i+":"+txt[i])
	}
}

function stringz(str,TOKEN) {
	
	this.stateSwitch={
			RULEID: {token:/.*\n/,replacement:'',wrap:["_RB['","']="],next:"TAB_EQ",fn:null},  // only alllowed to conclude true or false!!
			TAB_EQ: {token:/\t= /,replacement:'_',wrap:["(",")"],next:'WHEN_LINE',fn:null},
			FIN: {token:new RegExp(/./),replacement:'',wrap:[],next:'FIN',fn:null},
			TAB_1: {token:new RegExp(/\t/),replacement:"",wrap:["(",")"],next:"EQ",fn:null},
			WHEN_LINE: {token:/.*\n/,replacement:"",wrap:["",""],next:"FIN",fn:function (txt) {txt="_V("+txt.replace("=","==")+")"; return txt}}   // or other alternatives
	}
		
	this.option=this.stateSwitch[TOKEN]
	console.log("Inside with:"+TOKEN+">"+str+str.search(this.option.token))
	if ((str.search(this.option.token)==0)&&(str!="")) {
		console.log("found")
		this.s=str.match(this.option.token)[0]
		this.s_=str.slice(this.s.length,str.length)
		console.log(this.s)
//  process s
		if (this.option.fn) {
			this.s=this.option.fn(this.s)		
		}
//	wrap s		
		if (this.option.wrap.length==2) {
			console.log('wrapping')  // if TAB go down a level
			if (TOKEN=="TAB_EQ") {
				console.log("going down with"+this.s)
				x=this.option
				rememberedRightWrap=this.option.wrap[1].concat("")
				this.s=this.option.wrap[0]+stringz(this.s_,x.next)+rememberedRightWrap			
				console.log("back from down under"+this.s)
			}
			else {
				this.s=this.option.wrap[0]+this.s+this.option.wrap[1]
			}
		}
// replace s
		if (this.option.replacement) {
			console.log("Replacing")
			this.s=this.s.replace(this.option.token,this.option.replacement)
		}
//		else {
//			this.s=this.s+
//		}
	return this.s+stringz(this.s_,this.option.next)
 	}
 	else {
 		if (str!="") {
 			console.log("Incomplete load")
 			return ""
 		}
 		else {
		 	return ""  //test for bad stop 
 		}
 	}
}

function conditionFile(txt) {
	txt=txt.replace(/\r/g,"")  //  remove CR
	txt=txt.replace(/\/\/.*\n/g,"\n")  // remove inline comments leaving only \n
	txt=txt.replace(/[\s]*\n/,"\n")   // remove trailing spaces
	txt=txt.trim()
	return txt
}


fs = require('fs')
fs.readFile("rulebase/rulebase_v1.txt",'utf8',function (err,strng) {
	if (err) {
		console.log("File read error")
		console.log(err)		
	}
	else {
//		console.log(strng)
		strng=conditionFile(strng)
		strng=lex(strng)
//		rulez(lex(strng))
/*
		console.log("Processing rulebase")
		target=stringz(strng,"RULEID")
		target=target.replace(/\n/g,"")
		target=target.replace("\t","")
		console.log(target)
*/
	}
})
