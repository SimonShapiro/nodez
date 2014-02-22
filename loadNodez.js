var n=require("nodez/nodezv3.js")

//  These are stateless & async adds.  You will need to look in the console.log to see if any were rejected
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
