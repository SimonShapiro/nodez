var n=require("nodez/nodezv3.js")

//  These are stateless & async adds.  You will need to look in the console.log to see if any were rejected
n.addAnyNode({type:"Types",name:"Cluster",template:"{description:'string'}"})  //should become addTypeNode.
n.addAnyNode({type:"Types",name:"Business Process",template:"{description:'string'}"})
n.addAnyNode({type:"Types",name:"Application",template:"{description:'string'}"})

n.addLegalRelationship("Cluster","HAS_PARTS","Cluster",{template:"{}"})
n.addLegalRelationship("Business Process","RELIES_ON","Application")
n.addLegalRelationship("Business Process","NEXT","Business Process")
n.addLegalRelationship("Business Process","HAS_PARTS","Business Process")
n.addLegalRelationship("Cluster","IS_ACCOUNTABLE_FOR","Business Process")

