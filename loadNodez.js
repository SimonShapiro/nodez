var n=require("nodez/nodezv3.js")

nodes=[
    {"addTypedNode":{type:"Application",data:{name:"QRM",description:"Quantitative Risk Manangement system uised for structural risk management",owned:"15 years"}}}
    ,{"addTypedNode":{type:"Cluster",data:{name:"Treasury",description:"",notes:"notes&comments"}}}
    ,{"addTypedNode":{type:"Cluster",data:{name:"ALM",description:"Asset and Liablility Management",notes:"notes&comments"}}}
    ,{"addTypedNode":{type:"Cluster",data:{name:"UK Retail Bank",description:"",notes:"notes&comments"}}}
    ,{"addTypedNode":{type:"Cluster",data:{name:"Investment Bank",description:"",notes:"notes&comments"}}}
    ,{"addTypedNode":{type:"Cluster",data:{name:"Western Europe",description:"",notes:"notes&comments"}}}
    ,{"addTypedNode":{type:"Cluster",data:{name:"Wealth",description:"",notes:"notes&comments"}}}
    ,{"addTypedNode":{type:"Cluster",data:{name:"Africa",description:"",notes:"notes&comments"}}}
    ,{"addTypedRelationship":{fromType:"Cluster",fromName:"Treasury",rel:"HAS_PARTS",toType:"Cluster",toName:"ALM",rdata:""}}
    ,{"addTypedNode":{type:"Cluster",data:{name:"FTP",description:"Funds Transfer Pricing",notes:"notes&comments"}}}
    ,{"addTypedRelationship":{fromType:"Cluster",fromName:"Treasury",rel:"HAS_PARTS",toType:"Cluster",toName:"FTP",rdata:""}}
    ,{"addTypedNode":{type:"Cluster",data:{name:"Liquidity",description:"Liquididity Management",notes:"notes&comments"}}}
    ,{"addTypedRelationship":{fromType:"Cluster",fromName:"Treasury",rel:"HAS_PARTS",toType:"Cluster",toName:"Liquidity",rdata:""}}
    ,{"addTypedNode":{type:"Cluster",data:{name:"Funding",description:"Funding",notes:"notes&comments"}}}
    ,{"addTypedRelationship":{fromType:"Cluster",fromName:"Treasury",rel:"HAS_PARTS",toType:"Cluster",toName:"Funding",rdata:""}}
    ,{"addTypedNode":{type:"Cluster",data:{name:"Capital",description:"Capital Management",notes:"notes&comments"}}}
    ,{"addTypedRelationship":{fromType:"Cluster",fromName:"Treasury",rel:"HAS_PARTS",toType:"Cluster",toName:"Capital",rdata:""}}
    ,{"addTypedNode":{type:"Application",data:{name:"LDB",description:""}}}
    ,{"addTypedNode":{type:"Application",data:{name:"LCR",description:""}}}
    ,{"addTypedNode":{type:"Application",data:{name:"Poseidon",description:""}}}
    ,{"addTypedNode":{type:"Application",data:{name:"UKBA",description:""}}}
    ,{"addTypedNode":{type:"BusinessProcess",data:{name:"Hedge the structural IRR",description:""}}}
    ,{"addTypedRelationship":{fromType:"BusinessProcess",fromName:"Hedge the structural IRR",rel:"RELIES_ON",toType:"Application",toName:"QRM",rdata:""}}
    ,{"addTypedRelationship":{fromType:"Cluster",fromName:"ALM",rel:"IS_ACCOUNTABLE_FOR",toType:"BusinessProcess",toName:"Hedge the structural IRR",rdata:""}}
    ,{"addTypedRelationship":{fromType:"Cluster",fromName:"UK Retail Bank",rel:"USES",toType:"Application",toName:"UKBA",rdata:""}}
    ,{"addTypedRelationship":{fromType:"Cluster",fromName:"Wealth",rel:"USES",toType:"Application",toName:"UKBA",rdata:""}}
]
/*
n.addTypedRelationship("Cluster","Treasury","HAS_PARTS","Cluster","ALM")
n.addTypedRelationship("Cluster","ALM","IS_ACCOUNTABLE_FOR","Business Process","Hedge the strucutral IRR")
n.addTypedRelationship("Business Process","Hedge the strucutral IRR","RELIES_ON","Application","QRM")


n.addTypedNode("Cluster",{name:"Treasury",description:"",notes:"notes&comments"})
n.addTypedNode("Cluster",{name:"ALM",description:"Asset and Liablility Management",notes:"notes&comments"})
n.addTypedNode("Cluster",{name:"FLM",description:"Funding and Liquiditiy Management",notes:"notes&comments"})
n.addTypedNode("Cluster",{name:"UK Retail Bank",description:"",notes:"notes&comments"})
n.addTypedNode("Cluster",{name:"Investment Bank",description:"",notes:"notes&comments"})
n.addTypedNode("Cluster",{name:"Western Europe",description:"",notes:"notes&comments"})
n.addTypedNode("Cluster",{name:"Africa",description:"",notes:"notes&comments"})

n.addTypedNode("Application",{name:"LDB"})
n.addTypedNode("Application",{name:"LCR"})
n.addTypedNode("Application",{name:"QRM"})
n.addTypedNode("Application",{name:"Poseidon"})

n.addTypedNode("Business Process",{name:"Hedge the strucutral IRR"})
*/

n.series(nodes)
