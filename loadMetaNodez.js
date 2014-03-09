var n=require("nodez/nodezv3.js")
var async=require("async")

/*
metaModel =[
    {"addMetaNode":{name:"Cluster",template:'{"description":"string"}'}}
    ,{"addMetaNode":{name:"BusinessProcess",template:'{"description":"string"}'}}
    ,{"addMetaNode":{name:"Application",template:'{"description":"string","version":"string"}'}}
    ,{"addLegalRelationship":{from:"BusinessProcess",rel:"HAS_PARTS",to:"BusinessProcess",template:"{}"}}    
    ,{"addLegalRelationship":{from:"Cluster",rel:"HAS_PARTS",to:"Cluster",template:"{}"}}
    ,{"addLegalRelationship":{from:"BusinessProcess",rel:"RELIES_ON",to:"Application",template:"{}"}}    
    ,{"addLegalRelationship":{from:"BusinessProcess",rel:"NEXT",to:"BusinessProcess",template:"{}"}}    
    ,{"addLegalRelationship":{from:"Cluster",rel:"IS_ACCOUNTABLE_FOR",to:"BusinessProcess",template:"{}"}}    
    ,{"addLegalRelationship":{from:"Cluster",rel:"USES",to:"Application",template:"{}"}}    
]

n.series(metaModel)
*/
cases=[]
/*
function recordCases(err,caseFile){
    console.log("Recording case",caseFile)
    cases.push(caseFile)    
}
*/
function addMetaNodes(callback) {
//    var bsync=require("async")
    async.parallel(
        [
        function(_CB_) {
            n.addMetaNode({name:"BusinessInformationObject",template:'{"description":"string"}'},_CB_)
        },
        function(_CB_) {
            n.addMetaNode({name:"Cluster",template:'{"description":"string"}'},_CB_)
        },
        function(_CB_) {
            n.addMetaNode({name:"BusinessProcess",template:'{"description":"string"}'},_CB_)
        },
        function(_CB_) {
            n.addMetaNode({name:"Application",template:'{"description":"string","version":"string"}'},_CB_)
        }
        ],
        function (err,results){
            console.log("Finished metanodes")
            console.log(results)
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
        }
/*        
        function(callback) {
            n.addMetaNode({name:"BusinessInformationObject",template:'{"description":"string"}'},callback)
        },
        function(callback) {
            n.addMetaNode({name:"Cluster",template:'{"description":"string"}'},callback)
        },
        function(callback) {
            n.addMetaNode({name:"BusinessProcess",template:'{"description":"string"}'},callback)
        },
        function(callback) {
            n.addMetaNode({name:"Application",template:'{"description":"string","version":"string"}'},callback)
        }
*/
    ],
    function (err,results){
        console.log("End of series")
        console.log(results)
    }
)
