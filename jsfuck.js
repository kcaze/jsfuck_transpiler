var characters = {};

function addCharacters(js) {
  js += "+[]";
  var s = eval(js);
  //DEBUG: console.log(s);
  for (var i = 0; i < s.length; i++) {
    var c = s[i];
    var encoding = "("+js+")["+encodeNumber(i)+"]";
    if (characters[c] == undefined) {
      characters[c] = encoding;
    } else if (characters[c].length > encoding.length) {
      characters[c] = encoding;
    }
  }
}

function encodeCharacter(c) {
  return characters[c];
}

function encodeNumber(n) {
  return "![]+![]"+"+!![]".repeat(n);
}

function encodeString(s) {
  var ret = "";
  for (var i = 0; i < s.length; i++) {
    ret += encodeCharacter(s[i]) + (i < s.length - 1 ? "+" : "");
  }
  return ret;
}

function encodeScript(js) {
  return functionConstructor+"("+encodeString(js)+")";
}

// "false"
addCharacters("![]");
// "true"
addCharacters("!![]");
// "undefined"
addCharacters("[][[]]");
// "function fill() { [native code] }"
addCharacters("[]["+encodeString("fill")+"]");
// "function Array() { [native code] }"
addCharacters("[]["+encodeString("constructor")+"]");
// "function String() { [native code] }"
addCharacters("([]+[])["+encodeString("constructor")+"]");
// all lowercase letters and numbers
for (var i = 0; i < 36; i++) {
  addCharacters("("+encodeNumber(i)+")["+encodeString("toString")+"]"+"("+encodeNumber(36)+")");
}

var functionConstructor = "[]["+encodeString("fill")+"]["+encodeString("constructor")+"]";

// -1
addCharacters("([]+[])["+encodeString("search")+"]("+encodeNumber(0)+")");
// 0.1
addCharacters(encodeScript("return 1e-1")+"()")
// [object Object]
addCharacters(encodeScript("return {}")+"()");
// Should contain "C" in most Javascript environments 
addCharacters(encodeScript("return Object.keys(console)")+"()");

// Use String.fromCharCode to encode all other characters!
encodeCharacter = function (c) {
  if (!(c in characters)) addCharacters(encodeScript("return String.fromCharCode("+c.charCodeAt()+")")+"()");
  return characters[c];
}

function run(js) {
  eval(encodeScript(js)+"()");
}

run("console.log(\"Hello World!\");");
