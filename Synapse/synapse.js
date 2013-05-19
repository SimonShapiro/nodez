console.log("Synapse v1.0")

_R=[]
_RB=[]
_KB=[]

function _C (nm,str) {
	this.name=nm
	this.str=str
	_R[nm]=this
	this.V=function () {
		r=eval(str)
		console.log('...conclude that '+nm+' is '+r)
		return r
	}
}

function _V(nm) {  // really this is a helper function - it should form part of the _C object, but it cleans up the javascript rule base
	console.log("Testing "+nm)
	if (nm in _KB) {
		console.log( ' = '+_KB[nm])
		return _KB[nm]
	}
	if (nm in _R) {
		return _R[nm].V()
	}
	else {
		console.log('... Need value for '+nm)
		return undefined
	}
}
// Static Rule base load follows below

_RB["35946"]= " \
	_V('complies section 404-1c') 							\
	&&_V('EBA liquid assets') 								\
	&&(_V('counterparty sector')=='central government') 	\
	&&(_V('main category')=='debt securities') 				\
	&&_V('EBA liquid asset')								\
	"
_RB["complies with section 404"]=" 							\
	_V('complies with section 404-1') 						\
	&& !(_V('complies with section 404-2')) 				\
	"
_RB["complies with section 404-1"]=" 						\
	_V('complies with section 404-1a')						\
	|| _V('complies with section 404-1b')					\
	|| _V('complies with section 404-1c')					\
	|| _V('complies with section 404-1d')					\
	"
_RB["complies with section 404-1a"]=" 						\
	(_V('product type')=='cash')							\
	||	((_V('product type')=='deposits held') 				\
		&& (_V('counterparty type')=='central bank'))	 	\
	"
_RB["complies with section 404-1b"]=" 						\
	(_V('transferable assets') 								\
	&&(_V('instrument liquidity assesment')=='extremely high')			\
	&&(_V('instrument credit quality')=='extremely high'))	\
	"
_RB["complies with section 404-1d"]=" 						\
	(_V('transferable assets') 								\
	&&(_V('instrument liquidity assesment')=='high')		\
	&&(_V('instrument credit quality')=='high'))			\
	"
_RB['complies with section 404-1c']="						\
	(_V('transferable assets') 								\
	&&(														\
		((_V('issuer sector')=='central government') 		\
			&&(_V('issuer region')=='EU'))					\
		||((_V('guarantor sector')=='central government')	\
			&&(_V('guarantor issuer')=='EU'))))				\
	"
/*
 * 
 complies with section 404-1d
 	[transfereable assets]
 	&[instrument liquidity assesment]='high'
 	&[instrument credit quality]='high' 
 */

for (r in _RB) {  //only build decent js rules
	new _C(r,_RB[r])
	console.log("Loading "+r+":"+eval(_RB[r]))
}
	

/*
new _C("EBA liquid asset","true")


new _C("complies section 404-1",
	"(_V('complies section 404-1a') \
	||_V('complies section 404-1b')) \
	||_V('complies section 404-1c')"
)
new _C("complies section 404-1a",
	"_V('product type')=='cash and deposits held with central banks' \
	&& _V('available balance') > 0"
)
new _C('complies section 404-1b',
	"_V('transferable assets?') \
	&&( _V('instrument liquidity')=='extremely high') \
	&&(_V('instrument credit quality')=='extremely high')"
)
*/

// Dynamic Knowledge base - needs a methodology, direct lookup or more rules.

///////// Test data set 1
function testDataset1 () {
	console.log("==============Performing tests on dataset1==================\n")
	_KB=[]
	_KB['product type']='cash'
	// tests performed on dataset
	_V("complies with section 404")
	
	console.log("===========================================================\n")
}

//////// Test data set 2
function testDataset2 () {
	console.log("==============Performing tests on dataset2==================\n")
	_KB=[]
	_KB['product type']='deposits held'
	_KB['counterparty type']='central bank'
	// tests performed on data
	_V("complies with section 404")

	console.log("===========================================================\n")
}


/////////// Test data set 3 - true is a very weak place to be
function testDataset3 () {
	console.log("==============Performing tests on dataset3==================\n")
	_KB=[]
	_KB['transferable assets']=true
	_KB['instrument liquidity assesment']='extremely high'
	_KB['instrument credit quality']='extremely high'
	// tests performed on data
	_V("complies with section 404")

	console.log("===========================================================\n")
}

/////////// Test data set 4
function testDataset4 () {
	console.log("==============Performing tests on dataset4==================\n")
	_KB=[]
	_KB['transferable assets']=true
	_KB['issuer sector']='central government'
	_KB['issuer region']='EU'
//	_KB['extremely high liquidity']=true
//	_KB['extremely high credit quality']=true
	// tests performed on data
	_V("complies with section 404")

	console.log("===========================================================\n")
}

/////////// Test data set 6
function testDataset6 () {
	console.log("==============Performing tests on dataset6==================\n")
	_KB=[]
	_KB['transferable assets']=true
	_KB['issuer sector']='pse'
	_KB['issuer region']='EU'
//	_KB['extremely high liquidity']=true
//	_KB['extremely high credit quality']=true
	// tests performed on data
	_V("complies with section 404")

	console.log("===========================================================\n")
}


/////////// Test data set 5 - true is a very weak place to be
function testDataset5 () {
	console.log("==============Performing tests on dataset5==================\n")
	_KB=[]
	_KB['transferable assets']=true
	_KB['instrument liquidity assesment']='high'
	_KB['instrument credit quality']='high'
	// tests performed on data
	_V("complies with section 404")

	console.log("===========================================================\n")
}

// Classification tests
testDataset1()
testDataset2()
testDataset3()
testDataset4()
testDataset5() 
testDataset6() 
