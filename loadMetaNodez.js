var n=require("nodez/nodezv3.js")
var async=require("async")

meta=[
    {name:"BusinessProcess",template:'{"description":"string"}'},
    {name:"BusinessInformationObject",template:'{"description":"string"}'},
    {name:"Cluster",template:'{"description":"string"}'},
    {name:"Application",template:'{"description":"string","version":"string"}'}
]
legalRels=[
    {from:"BusinessProcess",rel:"HAS_PARTS",to:"BusinessProcess",template:"{}"},
    {from:"Cluster",rel:"HAS_PARTS",to:"Cluster",template:"{}"},
    {from:"BusinessProcess",rel:"RELIES_ON",to:"Application",template:"{}"},
    {from:"BusinessProcess",rel:"NEXT",to:"BusinessProcess",template:"{}"},
    {from:"Cluster",rel:"IS_ACCOUNTABLE_FOR",to:"BusinessProcess",template:"{}"},
    {from:"BusinessProcess",rel:"PRODUCES",to:"BusinessInformationObject",template:"{}"},
    {from:"Cluster",rel:"USES",to:"Application",template:"{}"},
    {from:"BusinessProcess",rel:"NEEDS",to:"BusinessInformationObject",template:"{}"}
]
typedNodes=[
    {type:"Application",data:{name:"QRM",description:"Quantitative Risk Manangement system uised for structural risk management",owned:"15 years"}}
    ,{type:"BusinessProcess",data:{name:"Hedge the structural IRR",description:""}}
    ,{type:"BusinessProcess",data:{name:"Hedge the wholesale structural IRR",description:""}}
    ,{type:"BusinessProcess",data:{name:"Hedge the retail structural IRR",description:""}}
    ,{type:"Cluster",data:{name:"Treasury",description:"",notes:"notes&comments"}}
    ,{type:"Cluster",data:{name:"ALM",description:"Asset and Liablility Management",notes:"notes&comments"}}
    ,{type:"Cluster",data:{name:"UK Retail Bank",description:"",notes:"notes&comments"}}
    ,{type:"Cluster",data:{name:"Investment Bank",description:"",notes:"notes&comments"}}
    ,{type:"Cluster",data:{name:"Western Europe",description:"",notes:"notes&comments"}}
    ,{type:"Cluster",data:{name:"Wealth",description:"",notes:"notes&comments"}}
    ,{type:"Cluster",data:{name:"Africa",description:"",notes:"notes&comments"}}
    ,{type:"Cluster",data:{name:"FTP",description:"Funds Transfer Pricing",notes:"notes&comments"}}
    ,{type:"Cluster",data:{name:"Liquidity",description:"Liquididity Management",notes:"notes&comments"}}
    ,{type:"Cluster",data:{name:"Funding",description:"Funding",notes:"notes&comments"}}
    ,{type:"Cluster",data:{name:"Capital",description:"Capital Management",notes:"notes&comments"}}
    ,{type:"Application",data:{name:"LDB",description:""}}
    ,{type:"Application",data:{name:"LCR",description:""}}
    ,{type:"Application",data:{name:"Poseidon",description:"Poseidon accumulates submissions from all clusters and prepres the FSA 47/48 reports"}}
    ,{type:"Application",data:{name:"UKBA",description:""}}
]
typedRelationships=[
    {fromType:"Cluster",fromName:"Treasury",rel:"HAS_PARTS",toType:"Cluster",toName:"ALM",rdata:""}
    ,{fromType:"Cluster",fromName:"Treasury",rel:"HAS_PARTS",toType:"Cluster",toName:"FTP",rdata:""}
    ,{fromType:"Cluster",fromName:"Treasury",rel:"HAS_PARTS",toType:"Cluster",toName:"Liquidity",rdata:""}
    ,{fromType:"Cluster",fromName:"Treasury",rel:"HAS_PARTS",toType:"Cluster",toName:"Funding",rdata:""}
    ,{fromType:"Cluster",fromName:"Treasury",rel:"HAS_PARTS",toType:"Cluster",toName:"Capital",rdata:""}
    ,{fromType:"BusinessProcess",fromName:"Hedge the structural IRR",rel:"RELIES_ON",toType:"Application",toName:"QRM",rdata:""}
    ,{fromType:"BusinessProcess",fromName:"Hedge the structural IRR",rel:"HAS_PARTS",toType:"BusinessProcess",toName:"Hedge the wholesale structural IRR",rdata:""}
    ,{fromType:"BusinessProcess",fromName:"Hedge the structural IRR",rel:"HAS_PARTS",toType:"BusinessProcess",toName:"Hedge the retail structural IRR",rdata:""}
    ,{fromType:"Cluster",fromName:"ALM",rel:"IS_ACCOUNTABLE_FOR",toType:"BusinessProcess",toName:"Hedge the structural IRR",rdata:""}
    ,{fromType:"Cluster",fromName:"UK Retail Bank",rel:"USES",toType:"Application",toName:"UKBA",rdata:""}
    ,{fromType:"Cluster",fromName:"Wealth",rel:"USES",toType:"Application",toName:"UKBA",rdata:""}
]

function addMetaNodes(callback) {
    async.map(meta,n.addMetaNode,
        function (err,results){
            console.log("Finished metanodes")
//            console.log(results)
            callback(err,results)
        }
    )
}
function addLegalRels(callback) {
    async.map(legalRels,n.addLegalRelationship,
        function (err,results){
            console.log("Finished legal relationships")
//            console.log(results)
            callback(err,results)
        }
    )
}
function addTypedNodes(callback) {
    async.map(typedNodes,n.addTypedNode,
        function (err,results){
            console.log("Finished typed nodes")
//            console.log(results)
            callback(err,results)
        }
    )
}
function addTypedRelationships(callback) {
    async.map(typedRelationships,n.addTypedRelationship,
        function (err,results){
            console.log("Finished typed nodes")
//            console.log(results)
            callback(err,results)
        }
    )
}

async.series(
    [
        function (callback) {
            n.deleteAll(callback)
        },
        function(callback) {
            addMetaNodes(callback)
        },
        function(callback) {
            addLegalRels(callback)
        },
        function(callback) {
            addTypedNodes(callback)
        },
        function(callback) {
            addTypedRelationships(callback)
        }
    ],
    function (err,results){
        console.log("End of series")
        console.log(results)
    }
)
