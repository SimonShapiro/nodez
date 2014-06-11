/**
 * Created by simonshapiro on 28/05/2014.
 */
var n=require("nodez/nodezv3.js")
var async=require("async")


//use of meta meta here is simply to give the browser a handle - remove in production
meta=[
  {name:"Meta",
    schema: {
      name: { type: "string" },
      schema: { type: "textarea", format: "textarea" }
    }}]

function addMetaNodes(callback) {
  async.map(meta,n.addMetaNode,
    function (err,results){
      console.log("Finished metanodes")
//            console.log(results)
      callback(err,results)
    }
  )
}
async.series(
  [
    function(callback) {
      addMetaNodes(callback)
    }],
    function (err,results){
    console.log("End of series");
    console.log(results)
  }
);

