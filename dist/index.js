"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.currentYPosition=currentYPosition,exports.elmYPosition=elmYPosition,exports.smoothScroll=smoothScroll,require("babel-polyfill");function currentYPosition(){return self.pageYOffset?self.pageYOffset:document.documentElement&&document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop?document.body.scrollTop:0}function elmYPosition(a){for(var b=document.querySelector(a),c=b.offsetTop,d=b;d.offsetParent&&d.offsetParent!=document.body;)d=d.offsetParent,c+=d.offsetTop;return c}function smoothScroll(a,b){var c=currentYPosition(),d=b?b:elmYPosition(a),e=d>c?d-c:c-d;if(100>e)return void scrollTo(0,d);var f=Math.round(e/50);20<=f&&(f=20);var g=Math.round(e/25),h=d>c?c+g:c-g,j=0;if(d>c){for(var k=c;k<d;k+=g)setTimeout("window.scrollTo(0, "+h+")",j*f),h+=g,h>d&&(h=d),j++;return}for(var k=c;k>d;k-=g)setTimeout("window.scrollTo(0, "+h+")",j*f),h-=g,h<d&&(h=d),j++}console.log("got comm.");