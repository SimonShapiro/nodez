var n=require("nodez/nodezv3.js")

//  These are stateless & async adds.  You will need to look in the console.log to see if any were rejected
n.addTypedRelationship("Cluster","Treasury","HAS_PARTS","Cluster","ALM")
n.addTypedRelationship("Cluster","ALM","IS_ACCOUNTABLE_FOR","Business Process","Hedge the strucutral IRR")
n.addTypedRelationship("Business Process","Hedge the strucutral IRR","RELIES_ON","Application","QRM")
