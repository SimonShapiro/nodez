var n=require("nodez/nodezv3.js")

nodes=[
    {"addTypedNode":{type:"Cluster",data:{name:"Treasury",decription:"",notes:"notes&comments"}}}
    ,{"addTypedNode":{type:"Cluster",data:{name:"UK Retail Bank",decription:"",notes:"notes&comments"}}}
    ,{"addTypedNode":{type:"Cluster",data:{name:"Investment Bank",decription:"",notes:"notes&comments"}}}
    ,{"addTypedNode":{type:"Cluster",data:{name:"Western Europe",decription:"",notes:"notes&comments"}}}
    ,{"addTypedNode":{type:"Cluster",data:{name:"Wealth",decription:"",notes:"notes&comments"}}}
    ,{"addTypedNode":{type:"Cluster",data:{name:"Africa",decription:"",notes:"notes&comments"}}}
    ,{"addTypedNode":{type:"Cluster",data:{name:"ALM",decription:"Asset and Liablility Management",notes:"notes&comments"}}}
    ,{"addTypedRelationship":{fromType:"Cluster",fromName:"Treasury",rel:"HAS_PARTS",toType:"Cluster",toName:"ALM",rdata:""}}
    ,{"addTypedNode":{type:"Cluster",data:{name:"FTP",decription:"Funds Transfer Pricing",notes:"notes&comments"}}}
    ,{"addTypedRelationship":{fromType:"Cluster",fromName:"Treasury",rel:"HAS_PARTS",toType:"Cluster",toName:"FTP",rdata:""}}
    ,{"addTypedNode":{type:"Cluster",data:{name:"Liquidity",decription:"Liquididity Management",notes:"notes&comments"}}}
    ,{"addTypedRelationship":{fromType:"Cluster",fromName:"Treasury",rel:"HAS_PARTS",toType:"Cluster",toName:"Liquidity",rdata:""}}
    ,{"addTypedNode":{type:"Cluster",data:{name:"Funding",decription:"Funding",notes:"notes&comments"}}}
    ,{"addTypedRelationship":{fromType:"Cluster",fromName:"Treasury",rel:"HAS_PARTS",toType:"Cluster",toName:"Funding",rdata:""}}
    ,{"addTypedNode":{type:"Application",data:{name:"LDB",decription:""}}}
    ,{"addTypedNode":{type:"Application",data:{name:"LCR",decription:""}}}
    ,{"addTypedNode":{type:"Application",data:{name:"QRM",decription:""}}}
    ,{"addTypedNode":{type:"Application",data:{name:"Poseidon",decription:""}}}
    ,{"addTypedNode":{type:"Application",data:{name:"UKBA",decription:""}}}
    ,{"addTypedNode":{type:"Business Process",data:{name:"Hedge the structural IRR",decription:""}}}
    ,{"addTypedRelationship":{fromType:"Business Process",fromName:"Hedge the structural IRR",rel:"RELIES_ON",toType:"Application",toName:"QRM",rdata:""}}
    ,{"addTypedRelationship":{fromType:"Cluster",fromName:"ALM",rel:"IS_ACCOUNTABLE_FOR",toType:"Business Process",toName:"Hedge the structural IRR",rdata:""}}
    ,{"addTypedRelationship":{fromType:"Cluster",fromName:"UK Retail Bank",rel:"USES",toType:"Application",toName:"UKBA",rdata:""}}
    ,{"addTypedRelationship":{fromType:"Cluster",fromName:"Wealth",rel:"USES",toType:"Application",toName:"UKBA",rdata:""}}
]
/*
n.addTypedRelationship("Cluster","Treasury","HAS_PARTS","Cluster","ALM")
n.addTypedRelationship("Cluster","ALM","IS_ACCOUNTABLE_FOR","Business Process","Hedge the strucutral IRR")
n.addTypedRelationship("Business Process","Hedge the strucutral IRR","RELIES_ON","Application","QRM")


n.addTypedNode("Cluster",{name:"Treasury",decription:"",notes:"notes&comments"})
n.addTypedNode("Cluster",{name:"ALM",decription:"Asset and Liablility Management",notes:"notes&comments"})
n.addTypedNode("Cluster",{name:"FLM",decription:"Funding and Liquiditiy Management",notes:"notes&comments"})
n.addTypedNode("Cluster",{name:"UK Retail Bank",decription:"",notes:"notes&comments"})
n.addTypedNode("Cluster",{name:"Investment Bank",decription:"",notes:"notes&comments"})
n.addTypedNode("Cluster",{name:"Western Europe",decription:"",notes:"notes&comments"})
n.addTypedNode("Cluster",{name:"Africa",decription:"",notes:"notes&comments"})

n.addTypedNode("Application",{name:"LDB"})
n.addTypedNode("Application",{name:"LCR"})
n.addTypedNode("Application",{name:"QRM"})
n.addTypedNode("Application",{name:"Poseidon"})

n.addTypedNode("Business Process",{name:"Hedge the strucutral IRR"})
*/

n.series(nodes)
