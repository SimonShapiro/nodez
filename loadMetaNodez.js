var n=require("nodez/nodezv3.js")

metaModel =[
    {"addMetaNode":{type:"Types",name:"Cluster",template:"{description:'string'}"}}
    ,{"addMetaNode":{type:"Types",name:"BusinessProcess",template:"{description:'string'}"}}
    ,{"addMetaNode":{type:"Types",name:"Application",template:"{description:'string'}"}}
    ,{"addLegalRelationship":{from:"BusinessProcess",rel:"HAS_PARTS",to:"BusinessProcess",template:"{}"}}    
    ,{"addLegalRelationship":{from:"Cluster",rel:"HAS_PARTS",to:"Cluster",template:"{}"}}
    ,{"addLegalRelationship":{from:"BusinessProcess",rel:"RELIES_ON",to:"Application",template:"{}"}}    
    ,{"addLegalRelationship":{from:"BusinessProcess",rel:"NEXT",to:"BusinessProcess",template:"{}"}}    
    ,{"addLegalRelationship":{from:"Cluster",rel:"IS_ACCOUNTABLE_FOR",to:"BusinessProcess",template:"{}"}}    
    ,{"addLegalRelationship":{from:"Cluster",rel:"USES",to:"Application",template:"{}"}}    
]

n.series(metaModel)
