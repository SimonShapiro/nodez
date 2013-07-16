
function installFeatures(featureset,t) {
	for (f in featureset) {
		var path=featureset[f].on
		var options=featureset[f].feature
//		msg("Installing feature on:"+path+":"+JSON.stringify(options))
		//jsFromPath sohuld return an iterator [nodes,...] when x.*.z is used.  Requires jsPathWalker to change :-(
		o=jsFromPath(path,t)  
		o.feature=options
//		alert(o.name)
	}
//	locateByName(path)
}

function readSelect(id) {
	var sel="#"+id +" :selected"
//	var sel="#"+"0.3.1 :selected"   // +" :selected"
	alert(sel)
	var ans=$(sel)
	alert(JSON.stringify(ans.text()))
}

function jsWalkerTest() {
	msg("testing feature walker======================")
	jsFeatureInstall(tr,features,[])
}

function jsFeatureInstall(t,feat,trl) {
//	msg("Installing Features")
//	msg("Maybe install global template for "+t.name)  //if a global exists set it as a template on the node?
	for (f in feat) {
		if((feat[f].on=="root") && (feat[f].feature.type=="globalTemplate") && (feat[f].feature.parameters.on)==t.name) {
//			msg("Instaling "+feat[f].on+":"+JSON.stringify(feat[f].feature.parameters.on)+":"+t.name)
			t.feature={type:'newFromTemplate',parameters:{template:feat[f].feature.parameters.template}}
		}
	}
	trl.push(t.name)
//	msg("jsWalker:"+JSON.stringify(trl))
	for (f in feat) {
		var splt=features[f].on.split(".")
//		msg("feature Index"+JSON.stringify(splt))
		if (trl.length==splt.length) {
			var match=true
//			msg("attempting match "+JSON.stringify(trl)+":"+JSON.stringify(splt)+":"+(trl==splt))
			for (var i=0;i<trl.length;i++) {
				match=match&&((trl[i]==splt[i])||(splt[i]=="*"))
			}
			if (match) {
//				msg("MATCH for feature "+JSON.stringify(feat[f])+" at location "+JSON.stringify(trl))
				t.feature=feat[f].feature
			}
			else {
//				msg("No match for feature "+JSON.stringify(feat[f])+" at location "+JSON.stringify(trl))
			}
		}
		else {
//			msg("No match for feature "+JSON.stringify(feat[f])+" at location "+JSON.stringify(trl))
		}
	}
	// match features[i].on with trl
//	msg("In jsPathWalker:"+t.name+k.length+k[0]+":")
	for (i in t.child) {
		jsFeatureInstall(t.child[i],feat,trl)
		}
	trl.pop()
}
