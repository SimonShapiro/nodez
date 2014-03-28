var n=require("nodez/nodezv3.js")
var async=require("async")


//use of meta meta here is simply to give the browser a handle - remove in production
meta=[
    {name:"Meta"},
    {name:"BusinessProcess",
      schema:{
        name:{type:"string"},
        description:{type:"string", format:"textarea"}
      }},
    {name:"BusinessInformationObject",
      schema:{
        name:{type:"string"},
        description:{type:"string", format:"textarea"}
      }},
    {name:"Cluster",
      schema:{
        name:{type:"string"},
        description:{type:"string", format:"textarea"}
      }},
    {name:"Application",
      schema:{
        name:{type:"string"},
        version:{type:"string"},
        description:{type:"string", format:"textarea"}
      }}
];
legalRels=[
    {from:"BusinessProcess",rel:"HAS_PARTS",to:"BusinessProcess",template:"{}"},
    {from:"Cluster",rel:"HAS_PARTS",to:"Cluster",template:"{}"},
    {from:"BusinessProcess",rel:"RELIES_ON",to:"Application",template:"{}"},
    {from:"BusinessProcess",rel:"NEXT",to:"BusinessProcess",template:"{}"},
    {from:"Cluster",rel:"IS_ACCOUNTABLE_FOR",to:"BusinessProcess",template:"{}"},
    {from:"BusinessProcess",rel:"PRODUCES",to:"BusinessInformationObject",template:"{}"},
    {from:"Cluster",rel:"USES",to:"Application",template:"{}"},
    {from:"BusinessProcess",rel:"NEEDS",to:"BusinessInformationObject",template:"{}"}
]
/*
 * * Bank Treasury
   * Produce capital plans
     * Forecast capital needs
       * Based on book run-off and new business
     * Review regulatory headroom
     * Perform stress testing
     * Establish capital plan
   * Manage the balance sheet
     * Calculate the sensitivity of income to interest rate shifts (ALM)
     * Establish possible funding and capital raising alternatives
and initiatives
   * Fund the bank
     * Execute funding plan
       * Unsecured
         * Execute and monitor deals and funding flows from branches
       * Secured
         * Develop portfolios of appropriate transactions
         * Obtain ratings for portfolios
         * SPV activities
           * Establish SPV
           * Perform ALM process for SPV incl behavioural modelling
           * Establish hedging strategy
           * Produce cash-flow forecasts
           * Perform cash management
           * Produce reports
           * Perform SPV accounting cycles
   * Manage non-trading risk
     * Interest rate risk
       * Calculate interest repricing ladder
       * Perform interest rate sensitivity analysis
       * Develop hedging and funding strategy
       * Calculate exposure after hadging
       * Produce reports
     * Liquidity Risk
       * Manage the liquidity
         * Apply behavioural assumptions
         * Generate balances
         * Perform scenario modelling and analysis and conduct stress testing
         * Produce results and reports
           * Basel 3
     * Foreign currency risk
       * Produce FX position reports
       * Analyse economic fundamentals
       * Produce hedging and trading strategy
     * Hedging and resulting risks
       * Execute hedging strategy
       * Produce IFRS documentation
       * Perform effectiveness testing
       * Perform hadge accounting
   * Provide transfer prices to the business
     * Establish FTP policy
       * Interest rate component
       * Liquidity component
     * Calculate FTP according to the policy
     * Publish FTP prices to the business
     * Use FTP to calculate product level profits
     * Generate MI/journal entries for product level profits
   * Perform governance activities
     * Monitor limits
     * Produce reports
     * Set policy and monitor adherance
 * 
 */
typedNodes=[
    {type:"Application",data:{name:"QRM",description:"Quantitative Risk Manangement system uised for structural risk management",owned:"15 years"}}
    ,{type:"BusinessProcess",data:{name:"Set Policy and Monitor Adherance",description:""}}
    ,{type:"BusinessProcess",data:{name:"BP01",description:""}}
    ,{type:"BusinessProcess",data:{name:"BP01.01",description:""}}
    ,{type:"BusinessProcess",data:{name:"BP01.02",description:""}}
    ,{type:"BusinessProcess",data:{name:"BP01.02.01",description:""}}
    ,{type:"BusinessProcess",data:{name:"BP05",description:""}}
    ,{type:"BusinessProcess",data:{name:"BP04",description:""}}
    ,{type:"BusinessProcess",data:{name:"BP03",description:""}}
    ,{type:"BusinessProcess",data:{name:"BP02",description:""}}
    ,{type:"BusinessProcess",data:{name:"Hedge the structural IRR",description:""}}
    ,{type:"Cluster",data:{name:"Treasury",description:"",notes:"notes&comments"}}
    ,{type:"Cluster",data:{name:"ALM",description:"Asset and Liablility Management",notes:"notes&comments"}}
    ,{type:"Cluster",data:{name:"UK Retail Bank",description:"",notes:"notes&comments"}}
    ,{type:"Cluster",data:{name:"Investment Bank",description:"",notes:"notes&comments"}}
    ,{type:"Cluster",data:{name:"Western Europe",description:"",notes:"notes&comments"}}
    ,{type:"Cluster",data:{name:"Wealth",description:"",notes:"notes&comments"}}
    ,{type:"Cluster",data:{name:"Africa",description:"",notes:"notes&comments"}}
    ,{type:"Cluster",data:{name:"FTP",description:"Funds Transfer Pricing",notes:"notes&comments"}}
    ,{type:"Cluster",data:{name:"Liquidity",description:"Liquididity Management",notes:"notes&comments"}}
    ,{type:"Cluster",data:{name:"Funding",description:"Funding",notes:"notes&comments"}}
    ,{type:"Cluster",data:{name:"Capital",description:"Capital Management",notes:"notes&comments"}}
    ,{type:"Application",data:{name:"LDB",description:""}}
    ,{type:"Application",data:{name:"LCR",description:""}}
    ,{type:"Application",data:{name:"Poseidon",description:"Poseidon accumulates submissions from all clusters and prepres the FSA 47/48 reports"}}
    ,{type:"Application",data:{name:"UKBA",description:""}}
]
typedRelationships=[
    {fromType:"Cluster",fromName:"Treasury",rel:"HAS_PARTS",toType:"Cluster",toName:"ALM",rdata:""}
    ,{fromType:"Cluster",fromName:"Treasury",rel:"HAS_PARTS",toType:"Cluster",toName:"FTP",rdata:""}
    ,{fromType:"Cluster",fromName:"Treasury",rel:"HAS_PARTS",toType:"Cluster",toName:"Liquidity",rdata:""}
    ,{fromType:"Cluster",fromName:"Treasury",rel:"HAS_PARTS",toType:"Cluster",toName:"Funding",rdata:""}
    ,{fromType:"Cluster",fromName:"Treasury",rel:"HAS_PARTS",toType:"Cluster",toName:"Capital",rdata:""}
    ,{fromType:"BusinessProcess",fromName:"Hedge the structural IRR",rel:"RELIES_ON",toType:"Application",toName:"QRM",rdata:""}
    ,{fromType:"BusinessProcess",fromName:"BP01",rel:"HAS_PARTS",toType:"BusinessProcess",toName:"BP01.01",rdata:""}
    ,{fromType:"BusinessProcess",fromName:"BP01",rel:"HAS_PARTS",toType:"BusinessProcess",toName:"BP01.02",rdata:""}
    ,{fromType:"BusinessProcess",fromName:"BP01.02",rel:"HAS_PARTS",toType:"BusinessProcess",toName:"BP01.02.01",rdata:""}
//    ,{fromType:"BusinessProcess",fromName:"Hedge the structural IRR",rel:"HAS_PARTS",toType:"BusinessProcess",toName:"Hedge the wholesale structural IRR",rdata:""}
//    ,{fromType:"BusinessProcess",fromName:"Hedge the structural IRR",rel:"HAS_PARTS",toType:"BusinessProcess",toName:"Hedge the retail structural IRR",rdata:""}
    ,{fromType:"Cluster",fromName:"ALM",rel:"IS_ACCOUNTABLE_FOR",toType:"BusinessProcess",toName:"Hedge the structural IRR",rdata:""}
    ,{fromType:"Cluster",fromName:"UK Retail Bank",rel:"USES",toType:"Application",toName:"UKBA",rdata:""}
    ,{fromType:"Cluster",fromName:"Wealth",rel:"USES",toType:"Application",toName:"UKBA",rdata:""}
]

function addMetaNodes(callback) {
    async.map(meta,n.addMetaNode,
        function (err,results){
            console.log("Finished metanodes")
//            console.log(results)
            callback(err,results)
        }
    )
}
function addLegalRels(callback) {
    async.map(legalRels,n.addLegalRelationship,
        function (err,results){
            console.log("Finished legal relationships")
//            console.log(results)
            callback(err,results)
        }
    )
}
function addTypedNodes(callback) {
    async.map(typedNodes,n.addTypedNode,
        function (err,results){
            console.log("Finished typed nodes")
//            console.log(results)
            callback(err,results)
        }
    )
}
function addTypedRelationships(callback) {
    async.map(typedRelationships,n.addTypedRelationship,
        function (err,results){
            console.log("Finished typed nodes")
//            console.log(results)
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
        },
        function(callback) {
            addLegalRels(callback)
        },
        function(callback) {
            addTypedNodes(callback)
        },
        function(callback) {
            addTypedRelationships(callback)
        }
    ],
    function (err,results){
        console.log("End of series")
        console.log(results)
    }
)
