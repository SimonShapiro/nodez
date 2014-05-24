var async=require("async") 
mock=function(callback) {
    setTimeout(function() {
        results='hello'
        console.log("why are you doing this to me")
        callback(null,results)
        },3000)
} 
processOutLinks=function(callback) {
    console.log('hello')
    results=[]
    mock(callback)
}
processInLinks=function(callback) {
    console.log('there')
    callback(null,2)
}
sendResults=function(res) {
    console.log("Finally",res)
}
       async.parallel([
            function(callback) {
                processOutLinks(callback)
            },
            function(callback) {
                processInLinks(callback)
            }
            ],
            function(err,results) {  //finished parallel
                console.log("Results--->",JSON.stringify(results))
                sendResults(results)
            })
