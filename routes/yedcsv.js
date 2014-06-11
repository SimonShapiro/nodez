/**
 * Created by simonshapiro on 03/06/2014.
 */


var
  async,      fs,       configMap;

async     = require('async');

fs = require('fs');
configMap = JSON.parse( fs.readFileSync( 'package.conf' ));
console.log(JSON.stringify(configMap));

exports.getCsvByPath = function(req, res){
  var
    i,          nodeTypes,    relTypes,     splitPathIntoSentences,     sentences,
    pathList,   nodeDsv,      edgeDsv,      nodes,                      allNodeProperties,
    edges,      allEdgeProperties,          nouns,                      getDataForSentence,
    getDataForNoun,           csvFile;

  getDataForNoun = function( noun, _CB_ ){
    var
      http_request,     options,      node,       nodes;
    nodes = {};
    options ={
      url       : configMap.testRoute + '/db/data/cypher',
      method    : 'POST',
      headers   : { 'content-type': 'application/json'},
      body      : JSON.stringify( {
        query   : "MATCH (n:" + noun + ") RETURN id(n),Labels(n),n",
        params  : {}
      })
    };
    http_request = require( 'request' );
    http_request( options, function( error, results_from_neo4j ) {
      var
        i,      results;
      if( !error ){
        results = JSON.parse( results_from_neo4j.body );
        for ( i in results.data ){
          if ( !nodes[results.data[i][0]] ){
            node = {};
            node.id    =  results.data[i][0];
            node.type  =  results.data[i][1][0];
            for ( j in results.data[i][2].data ){
              node[j] = results.data[i][2].data[j]
            }
            nodes[results.data[i][0]] = node;
          }
        }
        _CB_( null, { nodes: nodes } );
      }
      else{
        _CB_( "Error retrieiving nodes", null );
      }
    });
  };

  getDataForSentence = function (sentence, _CB_ ){
    var
      nodes,            edges,                subjString,         relString,
      objString,        http_request,         options,            sentenceResults,
      reverseRelationship,                    queryString;

    nodes = {};
    edges = {};
    if ( sentence[0] == "*" ){
      subjString = "(n)"
    }
    else {
      subjString = "(n:" + sentence[0] + ")"
    }
    console.log( JSON.stringify(sentences) +":"+ sentence[0].slice(-1) + ":" )
    if ( sentence[1] == "*"){
      relString = "[r]"
    }
    else {
      if (sentence[1][0] == "~"){
        reverseRelationship = true;
        leftRelEnd    = "<-";
        rightRelEnd   = "-";
        relString = "[r:" + sentence[1].slice(1,sentence[1].length) + "]"
      }
      else {
        reverseRelationship = false;
        leftRelEnd    = "-";
        rightRelEnd   = "->";
        relString = "[r:" + sentence[1] + "]"
      }
    }
    if ( sentence[2] == "*"){
      objString = "(m)"
    }
    else {
      objString = "(m:" + sentence[2] + ")"
    }
    if ( reverseRelationship ){
      queryString = "MATCH " + subjString + "<-" + relString + "-" + objString + " RETURN id(m),labels(m),m,type(r),id(n),labels(n),n,id(r)"  // NOTE n and m reversed in return clause
    }
    else {
      queryString = "MATCH " + subjString + "-" + relString + "->" + objString + " RETURN id(n),labels(n),n,type(r),id(m),labels(m),m,id(r)"
    }
    options ={
      url       : configMap.testRoute + '/db/data/cypher',
      method    : 'POST',
      headers   : { 'content-type': 'application/json'},
      body      : JSON.stringify( {
        query   : queryString,
        params  : {}
      })
    };
    http_request = require( 'request' );
    http_request( options, function( error, results_from_neo4j ) {
      var
        http_request,     options, i,j  ,       node,       edge;
      if ( !error ) {
        sentenceResults = JSON.parse( results_from_neo4j.body );
        for ( i in sentenceResults.data ){
          if ( !nodes[sentenceResults.data[i][0]] ){
            node = {};
            node.id    =  sentenceResults.data[i][0];
            node.type  =  sentenceResults.data[i][1][0];
            for ( j in sentenceResults.data[i][2].data ){
              node[j] = sentenceResults.data[i][2].data[j]
            }
            nodes[sentenceResults.data[i][0]] = node;
          }
          if ( !nodes[sentenceResults.data[i][4]] ){
            node = {};
            node.id    =  sentenceResults.data[i][4];
            node.type  =  sentenceResults.data[i][5][0];
            for ( j in sentenceResults.data[i][6].data ){
              node[j] = sentenceResults.data[i][6].data[j]
//              if ( allNodeProperties.indexOf(j) == -1 ){
//                allNodeProperties.push(j);
//              }
            }
            nodes[sentenceResults.data[i][4]] = node;
          }
          if ( !edges[sentenceResults.data[i][7]] ){
            edge = {};
            edge.source = sentenceResults.data[i][0];
            edge.target = sentenceResults.data[i][4];
            edge.rel    = sentenceResults.data[i][3];
            edges[sentenceResults.data[i][7]] = edge;
          }
        }
        for ( i in nodes ){
          console.log("Node " + JSON.stringify( nodes[i] ))
        }
        for ( i in edges ) {
          console.log("Edge " + JSON.stringify( edges[i] ))
        }
        _CB_( null, {nodes: nodes, edges: edges} )
      }
    })
  };

  splitPathIntoSentences = function( plist, sentenceContainer, extraNounContainer ){
    var subject,  verb,       object;


    if (plist.length >=3 ) {
      subject = plist[0]
      if( subject.slice(-1) == "+"){
        subject = subject.slice(0,subject.length-1);
          if ( extraNounContainer.indexOf( subject ) == -1 ){
            extraNounContainer.push( subject )
          }
        }
      verb = plist[1]
      object = plist[2]
      if( object.slice(-1) == "+"){
        object = object.slice(0,object.length-1);
        if ( extraNounContainer.indexOf( object ) == -1 ){
          extraNounContainer.push( object )
        }
      }
      sentenceContainer.push([subject,verb,object])
      splitPathIntoSentences( plist.slice(2,plist.length), sentenceContainer, extraNounContainer )
    }
  };

  nodeTypes = {};
  relTypes = {};
  sentences = [];
  nodeDsv = [];
  edgeDsv = [];
  nouns  = [];

  allEdgeProperties = [];
  allNodeProperties = [];

  pathList = req.params.path.split('.');
  if( ! (((pathList.length - 1) % 2 ) == 0 )) {
    console.log("Length error")
  }
  else {
    splitPathIntoSentences(pathList, sentences, nouns );
//    for( i in sentences )
    async.parallel(
      [
      function(callback){
        async.map(sentences, getDataForSentence, function( err, r){
          callback( err, r )
        })
      },
        function(callback){
          if ( nouns.length > 0 ){
            async.map( nouns, getDataForNoun, function( err, r ){
              callback( err, r )
            })
          }
          else {
            callback( null, [] )
          }
        }
      ], function( err, results ) {
        var i, j, k, resultsItem,    dsvString,
          nodes,   edges,   r;
        nodes = {};
        edges = {};
        // todo consolidate the node passes if necessary
        // todo setup allNodeProperties
        // todo setup allEdProperties, when edges become first class citizens
//        allEdgeProperties = r[r.length -1 ].allEdgeProperties;
//        allNodeProperties = r[r.length -1 ].allNodeProperties;
        for( resultsItem in results ){
          r = results[resultsItem];
          for ( i in r ) {   // todo cleanup expecting nodes and edges in r
            if( r[i].nodes) {
              for ( j in r[i].nodes ) {
                if ( !nodes[j] ) {
                  nodes[j] = r[i].nodes[j];
                  for( k in nodes[j] ){
                    if ( allNodeProperties.indexOf(k) == -1 ){
                      allNodeProperties.push(k);
                    }
                  }
                }
              }
            }
            if( r[i].edges) {
              for ( j in r[i].edges ) {
                if ( !edges[j] ) {
                  edges[j] = r[i].edges[j];
                  for( k in edges[j] ){
                    if ( allEdgeProperties.indexOf(k) == -1 ){
                      allEdgeProperties.push(k);
                    }
                  }
                }
              }
            }
          }
        }
//      console.log(JSON.stringify(r));
        edgeDsv.push(allEdgeProperties.join( configMap.delimeter ) + configMap.delimeter );
        for ( j in edges ) {
          dsvString = "";
          for ( i in allEdgeProperties ){
            dsvString = dsvString + edges[j][allEdgeProperties[i]] + configMap.delimeter
          }
          edgeDsv.push( dsvString );
        }
        nodeDsv.push(allNodeProperties.join( configMap.delimeter ) + configMap.delimeter );
        for ( j in nodes ) {
          dsvString = "";
          for ( i in allNodeProperties ){
            if( typeof(nodes[j][allNodeProperties[i]]) == "string" ){
              nodes[j][allNodeProperties[i]] = nodes[j][allNodeProperties[i]].replace(/\n/g," ");
            }
            dsvString = dsvString + nodes[j][allNodeProperties[i]] + configMap.delimeter
          }
          nodeDsv.push( dsvString );
        }
        console.log( JSON.stringify(edgeDsv ));
        console.log( JSON.stringify(nodeDsv ));
/*
        csvFile = require('fs');
        fileName = "csvstore/" + (new Date().toISOString().replace(/:/g,"-")) + ".csv";
        console.log(fileName);
        nodeDsv.forEach( function(v){
          csvFile.appendFileSync( fileName, v+"\n" );
        });
        edgeDsv.forEach(function(v){
          csvFile.appendFileSync( fileName, v+"\n" );
        });
*/
        res.setHeader('content-type','text')
        res.write(nodeDsv.join('\n'))
        res.write("\n")
        res.write(edgeDsv.join('\n'))
        res.end()
      })
    };

};

