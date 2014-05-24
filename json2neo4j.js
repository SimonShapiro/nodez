/**
 * Created by simonshapiro on 21/05/2014.
 */
var
  test = [{
    "a":"single string",
    "num": 54,
    "obj":{ "b":"bee",
      "arr":["one","two",{"x":'X',"y":23,"z":"zed"}]
    }
  }];

var
  walker = function(obj,parent) {
    var
      i, j;
    console.log(parent, Object.prototype.toString.call(obj));
    for (i in obj) {
      console.log('create ', i, 'as', Object.prototype.toString.call(obj[i]))
      console.log(parent+"-[" + i +"]-> " + i +":" + Object.prototype.toString.call(obj[i]));
      if ( typeof(obj[i]) == 'object') {
        walker(obj[i],i)
      }
    }
  };

walker(test,"root");
