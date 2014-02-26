var n=require("nodez/nodezv3.js")

metaModel =[
    {"addMetaNode":{type:"Types",name:"Cluster",template:"{description:'string'}"}}
    ,{"addMetaNode":{type:"Types",name:"Business Process",template:"{description:'string'}"}}
    ,{"addMetaNode":{type:"Types",name:"Application",template:"{description:'string'}"}}
    ,{"addLegalRelationship":{from:"Business Process",rel:"HAS_PARTS",to:"Business Process",template:"{}"}}    
    ,{"addLegalRelationship":{from:"Cluster",rel:"HAS_PARTS",to:"Cluster",template:"{}"}}
    ,{"addLegalRelationship":{from:"Business Process",rel:"RELIES_ON",to:"Application",template:"{}"}}    
    ,{"addLegalRelationship":{from:"Business Process",rel:"NEXT",to:"Business Process",template:"{}"}}    
    ,{"addLegalRelationship":{from:"Cluster",rel:"IS_ACCOUNTABLE_FOR",to:"Business Process",template:"{}"}}    
    ,{"addLegalRelationship":{from:"Cluster",rel:"USES",to:"Application",template:"{}"}}    
]

n.series(metaModel)
