var n=require("nodez/nodezv3.js")

//  These are stateless & async adds.  You will need to look in the console.log to see if any were rejected
//n.deleteAll()
n.deleteAll(function(caseFile) {
    console.log(JSON.stringify(caseFile))
})
