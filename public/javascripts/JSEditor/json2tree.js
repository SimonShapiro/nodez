TEXTWIDTH=80
MAXLINES=8

function jsNode(nm,o) {
	this.name=nm;
	this.parent={}
	this.type='leaf';
	this.visible=true  // are you visible
//why should this structure hold visibility and not the page?	
	this.datatype=Object.prototype.toString.call(o)
	if ((this.datatype!="[object Object]") && (this.datatype!="[object Array]")) {
		this.value=o
	}
	this.child=[]
}
jsNode.prototype = {
	constructor: jsNode,
	addChild:function (n) {
		this.type="node"
		this.child.push(n)
		n.setParent(this)
		return n
	},
	setParent:function (n) {
		this.parent=n
	},
	setVisibility:function(vis,propogate) {
		this.visible=vis
		if (propogate) {
			for (var i in this.child) {
				this.child[i].setVisibility(vis,propogate)
			}			 	
		}	
	},
	showChildren:function() {
		var children=[]
//		alert(children)
		for (var i in this.child){
//			alert(this.child[i].name)
			children.push(this.child[i].name)
		}
		alert(children)
	},
	toString: function() {
		return "Tree Object:"+this.name
	}

}

function treeWalker(t,func,trail,mode) {
//	msg("trail="+trail)
		var trl=trail
		for (var i in t.child) {
//			trail=trl+"_"+String(i)
			trail=trl+"_"+String(i)
//			alert(trail)
			if (t.child[i].type!="leaf") {
//the function paramters will have to be refined eventually				
				func(t.child[i],trail,mode)
				if(t.child[i].datatype=="[object Array]") {
//					j[t.child[i].name]=[]
				}
				else {
//					j[t.child[i].name]={}
				}
// if any child is invisible don't carry on??
				if (t.child[i].visible) {
//	msg("trail2="+trail)
					treeWalker(t.child[i],func,trail,mode)
				}
			}
			else {
				func(t.child[i],trail,mode)
//				j[t.child[i].name]=t.child[i].value
			}
		}
	}

function tree2JS(t,j) {
		for (var i in t.child) {
			if (t.child[i].type!="leaf") {
//				alert("processing: "+t.child[i].name)
	//			if (typeof(t.child[i].type!='leaf')) {
				if(t.child[i].datatype=="[object Array]") {
					j[t.child[i].name]=[]
				}
				else {
					j[t.child[i].name]={}
				}
				tree2JS(t.child[i],j[t.child[i].name])
//				alert(JSON.stringify(j))
			}
			else {
//				alert(t.name)
				j[t.child[i].name]=t.child[i].value
//				alert(JSON.stringify(j))
			}
		}
	}

function tree2Tree(ts,tt) {
//		msg("Cloning children of:"+ts.name)
		for (var i in ts.child) {
			if ((ts.child[i].datatype!="[object Object]") && (ts.child[i].datatype!="[object Array]")) {
				last=tt.addChild(new jsNode(ts.child[i].name,""))  //clone to empty
			}
			else {
				last=tt.addChild(new jsNode(ts.child[i].name,new Object()))
			}
			last.datatype=ts.child[i].datatype
			if (ts.child[i].type!="leaf") {
				tree2Tree(ts.child[i],last)
			}
//			else {
//				msg("Cloning node with name:"+ts.child[i].name)
//			}
		}
	}


function isArray(o) {
  return Object.prototype.toString.call(o) === '[object Array]';
}

function js2Tree(t,o) {
//	alert("so far "+JSON.stringify(t))
//	alert("building tree from js "+JSON.stringify(o))
    for (var i in o) {
//    	alert(Object.prototype.toString.call(o[i]))
        var last=t.addChild(new jsNode(i,o[i]));
        if (typeof(o[i])=="object") {
//        	alert("down the rabbit hole")
            //going one step down in the object tree!!
            js2Tree(last,o[i]);
        }
    }
}

function showNode(n) {
	alert(n.name)
}

function traverse(o,func) {
    func.apply(this,o);  
    for (var i in o) {
        if (typeof(o[i])=="object") {
            //going one step down in the object tree!!
            traverse(o[i],func);
        }
    }
}

function msg(txt){
//	var m=$(".Message").html()		
//	if (m) {
//		$(".message").append(txt+"<br>"+m)
//	}
//	else {
		$(".message").append(txt+"<br>")
//	}
}

function addElement(){
	document.getElementById("jsBuild").innerHTML="<input id='elName'></input><button onclick='saveElement()'>add</button>"
}
function moveEl(el,dir){
	readForm()
	var i=js[el]
	alert(i)
	alert("moving "+el+" "+dir)
}
function moveElement(el,dir) {
	ndx=eval("["+el+"]")
	pndx=ndx.slice(0,(ndx.length-1))
	var p=tr
	for (i=1;i<pndx.length;i++) {
		p=p.child[pndx[i]]
	}
//				p.showChildren()
//				alert(String(pndx))
	trgt=new Number(ndx.slice(-1))
//				alert(typeof(trgt))
//				alert(trgt)
//				alert('p is')
//				alert(JSON.stringify(p))
	if ((trgt>0) && (dir==-1)) {
//					alert("up")
		tmp=p.child[trgt-1]
//					alert(tmp.name)
		p.child[trgt-1]=p.child[trgt]
		p.child[trgt]=tmp
//					alert("up and out")
	}
//				alert(trgt<p.child.length-1)
	if ((trgt<p.child.length-1) && (dir==1)) {
//					alert("down")
//					alert(p.child.length)
//					alert(trgt+1)
//					alert(typeof(trgt+1))
//					alert(JSON.stringify(p.child[trgt+1]))
		tmp=p.child[trgt+1]
//					alert(tmp.name)
		p.child[trgt+1]=p.child[trgt]
		p.child[trgt]=tmp
//					alert("down and out")
	}
//				alert(JSON.stringify(p))
	if (features) {
		jsFeatureInstall(tr,features,[])
//		installFeatures(features,tr)
	}
	$(".jsForm").empty()
	treeWalker(tr,buildForm,"0","edit")
}
function expandOrContractElement(id,dir,prop) {
	ndx=eval("["+id.replace(/_/g,",")+"]")
	var p=tr
	for (i=1;i<ndx.length;i++) {
		p=p.child[ndx[i]]
	}
	if (features) {
		jsFeatureInstall(tr,features,[])
//		installFeatures(features,tr)
	}
	p.setVisibility((dir==1),prop)
	$(".jsForm").empty()
	treeWalker(tr,buildForm,"0","normal")
//	$("jsForm").html("</table>")
}
function extractTemplate() {
	alert("in extract template")
	j=JSON.stringify(tr)
	msg(j)
	request=$.ajax({
		url:"couch",
		type:"post",
		data:{
			docbase:"dictionary",
			"_id":"template",
			json:j
		},
		success:function(data) {
//			alert('page content: ' + JSON.stringify(data))
    		alert("Template extracted")
			tr=new jsNode("root",{})
			js2Tree(tr,js)
			if (features) {
				jsFeatureInstall(tr,features,[])
//				installFeatures(features,tr)
			}
			tr.setVisibility(false,true)
			$(".jsForm").empty()
			treeWalker(tr,buildForm,"0","normal")
		},
		error:function(data) {
			s=JSON.parse(data["responseText"])
			alert("Failure "+JSON.stringify(s.reason))
    		js=JSON.parse(jsBefore)
			resetForm()  //consiider setting a paramter on reetForm to be resetForm with ...
		}
	})
}

function deepCopy(source) {
	alert("attempting deep copy of:"+JSON.stringify(source))
	target=JSON.parse(JSON.stringify(source))
	/*
	for (s in source) {
		alert(s+":"+JSON.stringify(source[s]))
		target[s]=JSON.stringify(source[s])
	}
*/
//	alert(JSON.stringify(target))
	return target
}

function duplicateAChild(id) {
//	alert("in the child factory")
	ndx=eval("["+id.replace(/_/g,",")+"]")
	var p=tr
	for (i=1;i<ndx.length;i++) {
		p=p.child[ndx[i]]
	}
//	msg("testing for child length "+p.child[0].child.length)
	if (p.child[0].child.length>0) {
		jstub={}
		tree2JS(p.child[0],jstub)
		jj=new jsNode(String(p.child.length),{})
		tree2Tree(p.child[0],jj)
//		msg(JSON.stringify(p.child[0]))
//		msg(JSON.stringify(jj))
		p.child.push(jj)
		jj.setParent(p)
	}
	else {
//		msg("Attempting to clone simple array member as"+JSON.stringify(p.child[0]))		
		jj=new jsNode(String(p.child.length),{})
		jj.value=""
		jj.datatype=p.child[0].datatype
//		tree2Tree(p.child[0],jj)
//		msg(JSON.stringify(p.child[0]))
//		msg(JSON.stringify(jj))
		p.child.push(jj)
		jj.setParent(p)
	}
//	alert(JSON.stringify(p.child[0]))
//  need deep copy at node level here
/*
	p.child.push(deepCopy(p.child[0]))
	p.child[p.child.length-1].name=String(p.child.length-1)
	p.child[p.child.length-1].value=""
	p.visible=true
	tree2JS(tr,js)
	alert(JSON.stringify(js))
	tr=new Node("root",{})
	js2Tree(tr,js)
//	alert(JSON.stringify(p.child[p.child.length-1]))
*/
	if (features) {
		jsFeatureInstall(tr,features,[])
//		installFeatures(features,tr)
	}
	$(".jsForm").empty()
	treeWalker(tr,buildForm,"0","normal")
//	$("jsForm").html("</table>")
//	alert(JSON.stringify(p.child[p.child.length-1]))
}

function deleteItem(id) {
//	msg("In delete item: "+id)
	ndx=eval("["+id.replace(/_/g,",")+"]")
	var p=tr
	for (i=1;i<ndx.length;i++) {
		p=p.child[ndx[i]]
	}
//	msg("...with name:"+p.name+" and parent:"+p.parent.name+p.parent.datatype)
//	msg(Number(p.name)+"of"+p.parent.child.length)
	p.parent.child.splice(Number(p.name),1)
//	resetForm()
//	readForm()
//	msg(p.parent.child.length)
//	msg(JSON.stringify(tr))
//	tree2JS(tr,k)
//	msg(JSON.stringify(k))
	if (features) {
		jsFeatureInstall(tr,features,[])
//		installFeatures(features,tr)
	}
	$(".jsForm").empty()
	treeWalker(tr,buildForm,"0","normal")
//	msg("out")
}

function buildForm(o,id,mode) {
//	msg("Building form:"+id)
	if(o.jsForm) {
		o.jsForm()
	}
	if (o.parent.datatype=="[object Array]") {
		ka=eval("["+id.replace(/_/g,",")+"]")
		o.name=String(ka[ka.length-1])
	}
	key=o.name
	if (o.type=="leaf") {
		var value=o.value
		if (o.datatype=="[object Array]") {
			value="[object Array]"
		}
		if (o.datatype=="[object Object]") {
			value="[object Object]"
		}
	}
	else {
		var value="non leaf"
	}
//	var d=$("jsForm").html()
//	var d=$("jsForm").html()
	var level=eval("["+id.replace(/_/g,",")+"].length")
//	var level=eval("["+id+"].length")
	if(mode=="normal") {
//setup for introduction of mode='normal'
//		d=""
		d="<tr>"  
		if (value=="non leaf") {
			d=d+"<td>";
			d=d+"<div id='col1' style='margin-left:"+String(level*10)+"'>"
			if ((o.parent.datatype=="[object Array]")&&(o.parent.child.length>1)) {
				d=d+"<button id='"+id+"' onClick='deleteItem(id)'>x</button>"
			}
			if (o.datatype=="[object Array]") {
				d=d+"<button id='"+id+"' onClick='duplicateAChild(id)'>*</button>"
			}					
			if (o.visible) {
				d=d+"<button id='"+id+"' onClick='expandOrContractElement(id,-1,false)'>-</button>"
			}
			else {
				d=d+"<button id='"+id+"' onClick='expandOrContractElement(id,1,false)'>+</button>"
			}
			d=d+"<b>  "+key+"</b>"
			d=d+"</div>"
			d=d+"</td>";
		}
		else {
			d=d+"<td>";
//			d=""
			d=d+"<div id='col1' style='margin-left:"+String(level*10)+"'>"
			if ((o.parent.datatype=="[object Array]")&&(o.parent.child.length>1)) {
				d=d+"<button id='"+id+"' onClick='deleteItem(id)'>x</button>"
			}
			d=d+key;
			d=d+"</div>"
			d=d+"</td>";
//			d=d+"</td>";   //seemd unnecessary
			d=d+"<td>";
			d=d+"<div id='col2'>"
			l=Math.round(value.length*1.5)
//			alert(l)
			if(value.length>TEXTWIDTH) {
				r=Math.round(value.length/TEXTWIDTH)+2
//				msg(value.length+":"+r)
				d=d+"<textarea class='jsForm_input' onchange='readForm()' id='"+id+"' cols='"+TEXTWIDTH+"' rows='"+r+"'>"+value+"</textarea>"
			}
			else {
				if(o.feature) {
					switch(o.feature.type)
					{
						case "textarea": {
							d=d+"<textarea class='jsForm_input' onchange='readForm()' id='"+id+"' cols='"+TEXTWIDTH+"' rows='"+o.feature.parameters.rows+"'>"+value+"</textarea>"
							break
						}
						case "checkboxes": {
							for (i in o.feature.parameter.options) {
//								msg(o.feature.parameter.options[i])
								d=d+"<input type='checkbox' class='jsForm_input' onchange='readForm()' id='"+id+"' value='"+o.feature.parameter.options[i]+"'>"+o.feature.parameter.options[i]+"</input></br>"
							}
							break
						}
						case "select": {
								d=d+"<select class='jsForm_select' onChange='readForm()' id='"+id+"'>"
								for (i in o.feature.parameters.selection) {
									if (value==o.feature.parameters.selection[i]) {
										var selctd=" SELECTED"
									}
									else {
										var selctd=""
									}
									d=d+"<option value='"+o.feature.parameters.selection[i]+"'"+selctd+">"+o.feature.parameters.selection[i]+"</option>"
								}
								d=d+"</select>"
							break							
						}
					}
				}
				else {
					d=d+"<input class='jsForm_input' size="+l+" onchange='readForm()' id='"+id+"' value='"+value+"'>"+"</input>";
				}
			}
			d=d+"</div>"
			d=d+"</tr>"
		}	
//					document.getElementById("jsForm").innerHTML=document.getElementById("jsForm").innerHTML+id+"<button id='"+id+"' onClick='moveElement(id,-1)'>Up</button>"
//					document.getElementById("jsForm").innerHTML=document.getElementById("jsForm").innerHTML+id+"<button id='"+id+"' onClick='moveElement(id,1)'>Down</button>"
//					document.getElementById("jsForm").innerHTML=document.getElementById("jsForm").innerHTML+"<br/>"
//				alert("traversal "+key+":"+value)
	}
	else {
		document.getElementById("jsForm").innerHTML=d+key+":"+"<input id='"+id+"' value='"+value+"'>"+"</input>"
		document.getElementById("jsForm").innerHTML=document.getElementById("jsForm").innerHTML+"<button>Edit</button>"
		document.getElementById("jsForm").innerHTML=document.getElementById("jsForm").innerHTML+"<button id='"+id+"' onClick='moveElement(id,-1)'>Up</button>"
		document.getElementById("jsForm").innerHTML=document.getElementById("jsForm").innerHTML+"<button id='"+id+"' onClick='moveElement(id,1)'>Down</button>"
		document.getElementById("jsForm").innerHTML=document.getElementById("jsForm").innerHTML+"<button id='"+id+"' onClick='expandElement(id,1)'>Show</button>"
		document.getElementById("jsForm").innerHTML=document.getElementById("jsForm").innerHTML+"<button id='"+id+"' onClick='collapseElement(id,1)'>Hide</button>"
		document.getElementById("jsForm").innerHTML=document.getElementById("jsForm").innerHTML+id+"<br/>"
//				alert("traversal "+key+":"+value)
	}
	d=d+"</tr>";
//	alert(d);
	$(".jsForm").append(d);
//	msg(escape(d))
//	document.write(d)
//	console.log(d)
//	console.log("---")  //used to be .html
}
function saveElement(){
	$("jsForm").html("")
	eval("js['"+document.getElementById("elName").value+"']=''")
	traverse(js,buildForm,"root")
	document.getElementById("jsForm").innerHTML=document.getElementById("jsForm").innerHTML+"<button onclick=readForm()>submit</button>"
	document.getElementById("elName").value=""
//				alert(JSON.stringify(js))
}
function resetForm() {
	tr=new jsNode("root",{})
	js2Tree(tr,js)
	if (features) {
		jsFeatureInstall(tr,features,[])
//		installFeatures(features,tr)
	}
	tr.setVisibility(false,true)
	$(".jsForm").empty()
	treeWalker(tr,buildForm,"0","normal")
}
function saveForm() {
//	msg("save clicked")
	var jsBefore=JSON.stringify(js)  //A trick for getting a deep copy?
//	alert(jsBefore)
	tree2JS(tr,js)
	j=JSON.stringify(js)
//	msg("Saving:"+j)
/*
	tr=new jsNode("root",{})
	js2Tree(tr,js)
	tr.setVisibility(false,true)
	document.getElementById("jsForm").innerHTML=""
	treeWalker(tr,buildForm,"0","normal")
*/	
//	msg(document.URL.split('/').slice(3)[1])
	request=$.ajax({
		url:"/couch/"+document.URL.split('/').slice(3)[1]+"/"+js["_id"],
		type:"put",
		data:{json:j},
		success:function(data) {
//			alert('page content: ' + JSON.stringify(data))
    		alert("Updated "+JSON.stringify(data["rev"]))
    		js["_rev"]=data["rev"]
			tr=new jsNode("root",{})
			js2Tree(tr,js)
			//need to reset all features
			tr.setVisibility(false,true)
			if (features) {
				jsFeatureInstall(tr,features,[])
//				installFeatures(features,tr)
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
//	alert("back")

}

function saveFormAs() {
//	msg("save clicked")
	var jsBefore=JSON.stringify(js)  //A trick for getting a deep copy?
//	alert(jsBefore)
	tree2JS(tr,js)
	delete(js["_rev"])
	j=JSON.stringify(js)
	request=$.ajax({
		url:"/couch/"+document.URL.split('/').slice(3)[1],
		type:"post",
		data:{json:j},
		success:function(data) {
//			alert('page content: ' + JSON.stringify(data))
			alert("Updated "+JSON.stringify(data["rev"]))
			window.location.href=data["id"];
/*
 * 
     		js._rev=data["rev"]
			tr=new jsNode("root",{})
			js2Tree(tr,js)
			tr.setVisibility(false,true)
			document.getElementById("jsForm").innerHTML=""
			treeWalker(tr,buildForm,"0","normal")
*/
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

function saveNewRule(rb) {
//	msg("save clicked")
	var jsBefore=JSON.stringify(js)  //A trick for getting a deep copy?
//	alert(jsBefore)
	tree2JS(tr,js)
	delete(js["_rev"])
	j=JSON.stringify(js)
	request=$.ajax({
		url:"/couch/"+rb,
		type:"post",
		data:{json:j},
		success:function(data) {
//			alert('page content: ' + JSON.stringify(data))
			alert("Updated "+JSON.stringify(data["rev"]))
			window.location.href=data["id"];
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

function deleteForm() {
	tree2JS(tr,js)
	j=JSON.stringify(js)
	alert("Ready to delete:"+JSON.stringify(j))
	request=$.ajax({
		url:"/couch/"+document.URL.split('/').slice(3)[1]+"/"+js["_id"],
		type:"delete",
		data:{json:j},
		success:function(data) {
//			alert('page content: ' + JSON.stringify(data))
    		alert("Deleted "+JSON.stringify(data))
    		js["_rev"]=data["rev"]
			tr=new jsNode("root",{})
			js2Tree(tr,js)
			tr.setVisibility(false,true)
			if (features) {
				jsFeatureInstall(tr,features,[])
//				installFeatures(features,tr)
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
//	alert("back")

}


function readForm(){
//	msg("In readForm")
	var allIn = $('.jsForm_input');
	for(var k=0;k<allIn.length;k++){
		ndx=eval("["+allIn[k].id.replace(/_/g,",")+"]")
		var p=tr
//		msg(p.child[1].name)
		for (i=1;i<ndx.length;i++) {
//			msg("moving through readForm"+ndx.length)
			p=p.child[ndx[i]]
		}
//		msg(allIn[k].value)
		p.value=allIn[k].value
	}
// for each feature type - textarea works ok as a general input field
	var allIn = $('.jsForm_select');
	for(var k=0;k<allIn.length;k++){
//		msg("Going after select fields:"+k+":"+allIn[k].id)
		ndx=eval("["+allIn[k].id.replace(/_/g,",")+"]")
		var p=tr
//		msg(p.child[1].name)
		for (i=1;i<ndx.length;i++) {
//			msg("moving through readForm"+ndx.length)
			p=p.child[ndx[i]]
		}
//		msg(allIn[k].id)
		p.value=$("#"+allIn[k].id +" :selected").text()
//		msg("Assigned:"+p.value)
	}
//	msg("finished readForm")
//  test if save clicked !!!!!!!!!!!!!!!  Still to be done
}

function fact(i) {
	if (i==1) {return 1}
	else {
		v=i*fact(i-1)
		return v
	}
}

function switch2Edit() {
	if (features) {
		jsFeatureInstall(tr,features,[])
//		installFeatures(features,tr)
	}
	$(".jsForm").empty()
	treeWalker(tr,buildForm,"0","edit")
}
//alert("js2tree loaded")

function jsPathWalker(t,func,k) {
//	msg("jsPathWalker"+JSON.stringify(k))
//	msg("In jsPathWalker:"+t.name+k.length+k[0]+":")
	k=k.slice(1,k.length)
	if ((k.length==0)) {  //k is empty
//		msg("good finish:"+t.name)
		return t
	}
	else {
		for (i in t.child) {
			r=false
			found=false
			msg("attempting:"+k[0]+":"+t.child[i].name)
			if ((t.child[i].name==k[0]) || (k[0]=="*")) {
//				alert("i have found a match")
				found=true
//				msg(t.child[i].name+":"+k)
				r=jsPathWalker(t.child[i],func,k)
//				msg(found+"children"+r.name)
//				found=found&&r
//				return found
				return r 
			}
//			jsPathWalker(t.child[i],func,kk)
		}
	}
	if (k.length>0) {
//		msg("suspected fail")
		return false
	}
	else {
//		msg("out jsPathWalker"+":"+found+k)
		return found
	}
}

/*
	if ((t.name==k[0])&&(k.length>0)) {
		msg("In jsPathWalker starting @"+t.name+"?"+k[0]+":"+k.length)
		for (i in t.child) {  //look ahead to match child
			msg(t.child[i].name+":"+kk[0])
			else
			{
				return t.child[i].name
			}
		}
	}
	else {
		msg("FAIL"+k.length)
	}
	

	for (var i in t.child) {
		
//		msg(t.child[i].name+"="+k+"?"+(t.child[i].name in k))
//		msg(t.child[i].name+t.child[i].type)
		if (t.child[i].type!="leaf") {
			func(t.child[i].name)
			if(t.child[i].datatype=="[object Array]") {
//					j[t.child[i].name]=[]
			}
			else {
//					j[t.child[i].name]={}
			}
			jsPathWalker(t.child[i],func,kk)
		}
		else {
//			msg("calling func for leaf")
			func(t.child[i].name)
//				j[t.child[i].name]=t.child[i].value
		}
	}
*/
//	msg("End treeWalker")


function jsFromPath(jsPath,t) {
	k=jsPath.split(".")
//	msg("ready to walk")
	ans=jsPathWalker(t,function() {},k)
	return ans
}
