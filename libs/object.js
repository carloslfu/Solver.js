//Objectjs library version 1.0
//to use type : miobj=new Ojs();
//to convert a standard object to Objectjs type : miobj=new Ojs(stdobj);
//to implement:
//function comparator
//Utilities for Object
Cloner=function(obj){
  if(obj!=undefined)
  {
    var i;
    for(i in obj)
      this[i]=obj[i];
    delete i;
  }
};
Ojs=function(obj){
  if(obj!=undefined)
  {
    var i;
    for(i in obj)
      this[i]=obj[i];
    delete i;
  }
};
//the code of toType and equals functions was copied from:
//http://www.etnassoft.com/2011/10/05/como-comparar-objetos-y-arrays-en-javascript/
//equals function will be removed in new versions by an implementation to compare logic functions
Ojs.prototype.toType = function (obj) {
  if (typeof obj === "undefined") {
    return "undefined";
 
    // consider: typeof null === object
  }
  if (obj === null) {
    return "null";
  }
 
  var type = Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1] || '';
 
  switch (type) {
  case 'Number':
    if (isNaN(obj)) {
      return "nan";
    } else {
      return "number";
    }
  case 'String':
  case 'Boolean':
  case 'Array':
  case 'Date':
  case 'RegExp':
  case 'Function':
    return type.toLowerCase();
  }
  if (typeof obj === "object") {
    return "object";
  }
  return undefined;
};
Ojs.prototype.equals = function () {//this function only compare types when target is a function
 
  var innerEquiv; // the real equiv function
  var callers = []; // stack to decide between skip/abort functions
  var parents = []; // stack to avoiding loops from circular referencing
  // Call the o related callback with the given arguments.
 
  function bindCallbacks(o, callbacks, args) {
    var prop = toType(o);
    if (prop) {
      if (toType(callbacks[prop]) === "function") {
        return callbacks[prop].apply(callbacks, args);
      } else {
        return callbacks[prop]; // or undefined
      }
    }
  }
 
  var callbacks = function () {
 
    // for string, boolean, number and null
 
    function useStrictEquality(b, a) {
      if (b instanceof a.constructor || a instanceof b.constructor) {
        // to catch short annotaion VS 'new' annotation of a
        // declaration
        // e.g. var i = 1;
        // var j = new Number(1);
        return a == b;
      } else {
        return a === b;
      }
    }
 
    return {
      "string": useStrictEquality,
      "boolean": useStrictEquality,
      "number": useStrictEquality,
      "null": useStrictEquality,
      "undefined": useStrictEquality,
 
      "nan": function (b) {
        return isNaN(b);
      },
 
      "date": function (b, a) {
        return this.toType(b) === "date" && a.valueOf() === b.valueOf();
      },
 
      "regexp": function (b, a) {
        return this.toType(b) === "regexp" && a.source === b.source && // the regex itself
        a.global === b.global && // and its modifers
        // (gmi) ...
        a.ignoreCase === b.ignoreCase && a.multiline === b.multiline;
      },
 
      // - skip when the property is a method of an instance (OOP)
      // - abort otherwise,
      // initial === would have catch identical references anyway
      "function": function () {
        var caller = callers[callers.length - 1];
        return caller !== Object && typeof caller !== "undefined";
      },
 
      "array": function (b, a) {
        var i, j, loop;
        var len;
 
        // b could be an object literal here
        if (!(toType(b) === "array")) {
          return false;
        }
 
        len = a.length;
        if (len !== b.length) { // safe and faster
          return false;
        }
 
        // track reference to avoid circular references
        parents.push(a);
        for (i = 0; i < len; i++) {
          loop = false;
          for (j = 0; j < parents.length; j++) {
            if (parents[j] === a[i]) {
              loop = true; // dont rewalk array
            }
          }
          if (!loop && !innerEquiv(a[i], b[i])) {
            parents.pop();
            return false;
          }
        }
        parents.pop();
        return true;
      },
 
      "object": function (b, a) {
        var i, j, loop;
        var eq = true; // unless we can proove it
        var aProperties = [],
          bProperties = []; // collection of
        // strings
        // comparing constructors is more strict than using
        // instanceof
        if (a.constructor !== b.constructor) {
          return false;
        }
 
        // stack constructor before traversing properties
        callers.push(a.constructor);
        // track reference to avoid circular references
        parents.push(a);
 
        for (i in a) { // be strict: don't ensures hasOwnProperty
          // and go deep
          loop = false;
          for (j = 0; j < parents.length; j++) {
            if (parents[j] === a[i]) loop = true; // don't go down the same path
            // twice
          }
          aProperties.push(i); // collect a's properties
          if (!loop && !innerEquiv(a[i], b[i])) {
            eq = false;
            break;
          }
        }
 
        callers.pop(); // unstack, we are done
        parents.pop();
 
        for (i in b) {
          bProperties.push(i); // collect b's properties
        }
 
        // Ensures identical properties name
        return eq && innerEquiv(aProperties.sort(), bProperties.sort());
      }
    };
  }();
 
  innerEquiv = function () { // can take multiple arguments
    var args = Array.prototype.slice.apply(arguments);
    if (args.length < 2) {
      return true; // end transition
    }
 
    return (function (a, b) {
      if (a === b) {
        return true; // catch the most you can
      } else if (a === null || b === null || typeof a === "undefined" || typeof b === "undefined" || toType(a) !== toType(b)) {
        return false; // don't lose time with error prone cases
      } else {
        return bindCallbacks(a, callbacks, [b, a]);
      }
 
      // apply transition with (1..n) arguments
    })(args[0], args[1]) && arguments.callee.apply(this, args.splice(1, args.length - 1));
  };
 
  return innerEquiv;
 
}();

Ojs.prototype.forEach = function(func){//if func return anything stop looping, else continue loop
  var i;
  var len=this.getLength();
  for(i=0;i<len && func(this.objectNameAt(i))==undefined;i++);
}
Ojs.prototype.indexOf = function(name){
  var i,id=0;
  for(i in this){
    if(i==name){
      return id;
    }
    id++;
  }
}
Ojs.prototype.objectAt = function(index){
  var i,id=0;
  for(i in this){
    if(id==index){
      return this[i];
    }
    id++;
  }
}
Ojs.prototype.objectNameAt = function(index){
  var i,id=0;
  for(i in this){
    if(id==index){
      return i;
    }
    id++;
  }  return i;
}
Ojs.prototype.clear = function(){
  var i;
  var len=this.getLength();
  for(i=0;i<len;i++)
    delete this[this.objectNameAt(0)];
}
Ojs.prototype.insert = function(index,name,obj){
  var i;
  var aux=new Ojs();
  var len=this.getLength();
  for(i=index;i<len;i++){
    aux[this.objectNameAt(index)]=this.objectAt(index);
    delete this[this.objectNameAt(index)];
  }
  this[name]=obj;
  len=aux.getLength();
  for(i=0;i<len;i++){
    this[aux.objectNameAt(i)]=aux.objectAt(i);
  }
}
Ojs.prototype.replaceAt = function(index,name,obj){
  delete this[this.objectNameAt(index)];
  this.insert(index,name,obj);
}
Ojs.prototype.replace = function(namedel,name,obj){
  index=this.indexOf(namedel);
  delete this[namedel];
  this.insert(index,name,obj);
}
Ojs.prototype.sortByName = function(func){
  var i;
  var names=[];
  var obj=new Cloner(this);
  var len=this.getLength();
  for(i=0;i<len;i++){
    names[i]=this.objectNameAt(i);
  }
  names.sort(func);
  this.clear();
  for(i=0;i<len;i++)
    this[names[i]]=obj[names[i]];
}
Ojs.prototype.reverse = function(func){
  var i;
  var names=[];
  var obj=new Cloner(this);
  var len=this.getLength();
  for(i=0;i<len;i++){
    names[i]=this.objectNameAt(i);
  }
  names.reverse();
  this.clear();
  for(i=0;i<len;i++)
    this[names[i]]=obj[names[i]];
}
Ojs.prototype.sort = function(func){
  var i;
  var names=[];
  var obj=new Cloner(this);
  var len=this.getLength();
  for(i=0;i<len;i++){
    names[i]=new Cloner(this.objectAt(i));
    names[i].objectName=this.objectNameAt(i);
  }
  names.sort(func);
  this.clear();
  for(i=0;i<len;i++)
    this[names[i].objectName]=obj[names[i].objectName];
}
Ojs.prototype.sortIndexed = function(func){
  var i;
  var names=[];
  var obj=new Cloner(this);
  var len=this.getLength();
  for(i=0;i<len;i++){
    names[i]=new Cloner(this.objectAt(i));
    names[i].objectName=this.objectNameAt(i);
  }
  names.sort(func);
  this.clear();
  for(i=0;i<len;i++)
    this[i]=obj[names[i].objectName];
}
Ojs.prototype.Index = function(){
  var i;
  var obj=new Ojs(this);
  var len=obj.getLength();
  this.clear();
  for(i=0;i<len;i++)
    this[i]=obj.objectAt(i);
}
Ojs.prototype.toStr=function(){
  var i,s,obj={};
  var len=this.getLength();
  for(i=0;i<len;i++){
    switch(this.toType(this.objectAt(i)))
    {
      case 'function':
        s=this.objectAt(i)+'';
        obj[this.objectNameAt(i)]=s;
        obj[this.objectNameAt(i)+'-type']='function';
        break;
      case 'object':
        obj[this.objectNameAt(i)]=(new Ojs(this.objectAt(i))).toStr();
        obj[this.objectNameAt(i)+'-type']='object';
        break;
      default:
        obj[this.objectNameAt(i)]=this.objectAt(i);
        obj[this.objectNameAt(i)+'-type']=this.toType(this.objectAt(i));
        break;
    }
  }
  return JSON.stringify(obj);
}
Ojs.prototype.toOjs=function(str){
  var i,obj=new Ojs();
  var arr=new Ojs(JSON.parse(str));
  var len=arr.getLength();
  for(i=0;i<len;i+=2){
    switch(arr[arr.objectNameAt(i)+'-type'])
    {
      case 'function':
        eval('obj[arr.objectNameAt(i)]='+arr.objectAt(i));
        break;
      case 'object':
        obj[arr.objectNameAt(i)]=this.toOjs(arr.objectAt(i));
        break;
      default:
        obj[arr.objectNameAt(i)]=arr.objectAt(i);
        break;
    }
  }    
  return obj;
}
Ojs.prototype.toObj=function(){
  var i,obj={};
  var len=this.getLength();
  for(i=0;i<len;i++)
      obj[this.objectNameAt(i)]=this.objectAt(i);
  return obj;
}
Ojs.prototype.toClearObj=function(){
  var i,obj={};
  var len=this.getLength();
  for(i=0;i<len;i++)
    if(this.toType(this.objectAt(i))=="object" && this.objectAt(i).toClearObj)
      obj[this.objectNameAt(i)]=this.objectAt(i).toClearObj();
    else
      obj[this.objectNameAt(i)]=this.objectAt(i);
  return obj;
}
Ojs.prototype.last = function(){
  return this.objectAt(this.getLength()-1);
}
Ojs.prototype.lastObjectName = function(){
  return this.objectNameAt(this.getLength()-1);
}
Ojs.prototype.getLength = function(){
  var i, c = 0;
  for(i in this) c++;
  return c;
}
//fix length for object predefined functions 
var aref010203=new Ojs();
var lenghtobjprotinitial=aref010203.getLength();

Ojs.prototype.getLength = function(){
  var i, c = 0;
  for(i in this) c++;
  return c-lenghtobjprotinitial;
}