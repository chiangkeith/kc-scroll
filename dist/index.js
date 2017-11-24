'use strict';var _promise=require('babel-runtime/core-js/promise'),_promise2=_interopRequireDefault(_promise),_assign=require('babel-runtime/core-js/object/assign'),_assign2=_interopRequireDefault(_assign),_classCallCheck2=require('babel-runtime/helpers/classCallCheck'),_classCallCheck3=_interopRequireDefault(_classCallCheck2),_createClass2=require('babel-runtime/helpers/createClass'),_createClass3=_interopRequireDefault(_createClass2);Object.defineProperty(exports,'__esModule',{value:!0}),exports.CardBoard=exports.OnePageScroller=void 0;exports.currentYPosition=currentYPosition,exports.elmYPosition=elmYPosition,exports.smoothScroll=smoothScroll,exports.smoothScrollTo=smoothScrollTo;var _card=require('./card');Object.defineProperty(exports,'CardBoard',{enumerable:!0,get:function get(){return _card.CardBoard}});var _verge=require('verge'),_verge2=_interopRequireDefault(_verge);function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}function currentYPosition(){return self.pageYOffset?self.pageYOffset:document.documentElement&&document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop?document.body.scrollTop:0}function elmYPosition(a,b){var c=document.querySelector(a);if(!c)return void(b&&b({message:'cannot find element'+a}));for(var d=c.offsetTop,e=c;e.offsetParent&&e.offsetParent!=document.body;)e=e.offsetParent,d+=e.offsetTop;return d}function smoothScroll(a,b,c){smoothScrollTo({eID:a,yPos:b,steps:c})}function smoothScrollTo(a){var b=a.eID,c=a.yPos,d=a.steps,e=currentYPosition(),f=null!==c&&c!==void 0?c:elmYPosition(b),g=f>e?f-e:e-f;if(100>g)return void scrollTo(0,f);var h=Math.round(g/50);20<h&&(h=20),10>h&&(h=10);var j=null!==d&&d!==void 0?d:25,k=Math.round(g/j),l=f>e?e+k:e-k,m=1;if(f>e){for(var n=e;n<f;n+=k)setTimeout('window.scrollTo(0, '+l+')',m*h),l+=k,l>f&&(l=f),m+=1;return}for(var n=e;n>f;n-=k)setTimeout('window.scrollTo(0, '+l+')',m*h),l-=k,l<f&&(l=f),m+=1}var OnePageScroller=exports.OnePageScroller=function(){function a(){(0,_classCallCheck3.default)(this,a)}return(0,_createClass3.default)(a,[{key:'construct',value:function construct(){this.init=this.init.bind(this),this.moveDown=this.moveDown.bind(this),this.moveUp=this.moveUp.bind(this),this.moveTo=this.moveTo.bind(this),this.setUpSwiperBehavior=this.setUpSwiperBehavior.bind(this),this.setUpMouseWheelBehavior=this.setUpMouseWheelBehavior.bind(this),this.setUpResponsiveBehavior=this.setUpResponsiveBehavior.bind(this),this.setUpKeyDownBehavior=this.setUpKeyDownBehavior.bind(this),this.transformPage=this.transformPage.bind(this),this._init_scroll=this._init_scroll.bind(this),this._addClass=this._addClass.bind(this),this._removeClass=this._removeClass.bind(this),this._hasClass=this._hasClass.bind(this),this._trim=this._trim.bind(this),this._whichTransitionEvent=this._whichTransitionEvent.bind(this),this._isDescendant=this._isDescendant.bind(this),this.isDescendant=this.isDescendant.bind(this),this.pauseToggle=this.pauseToggle.bind(this),this.cancelPause=this.cancelPause.bind(this),this.doPause=this.doPause.bind(this),this.defaults={pageContainer:'section',easing:'ease',animationTime:1e3,keyboard:!0,beforeMove:null,afterMove:null,loop:!1,responsiveFallback:!1,defaultInitialPage:1},this.settings={},this.pages={},this.doc=document,this.lastAnimation=0,this.quietPeriod=500,this.container={},this.scrollingFlag=!1,this.initializedFlag=!1,this.containerSlector='body',this.options={},this.pauseFlag=!1,this.height=_verge2.default.viewportH()}},{key:'init',value:function init(b,c){this.defaults={pageContainer:'section',easing:'ease',animationTime:1e3,quietPeriod:500,keyboard:!0,beforeMove:null,afterMove:null,loop:!1,responsiveFallback:!1,defaultInitialPage:1},this.doc=document,this.settings=(0,_assign2.default)({},this.defaults,c),this.container=this.doc.querySelector(b),this.pages=this.container.querySelectorAll(this.settings.pageContainer),this.pauseFlag=!1,this.scrollingFlag=!1,this.containerSlector=b,this.options=c,this.height=_verge2.default.viewportH();var d=this.pages.length;this.quietPeriod=this.settings.quietPeriod;for(var j=0;j<d;j+=1)this.pages[j].dataset.index=j+1,0==j?this._addClass(this.pages[j],'active'):this._removeClass(this.pages[j],'active');this.setUpSwiperBehavior(),this.setUpMouseWheelBehavior(),this.setUpResponsiveBehavior(),!0===this.settings.keyboard&&this.setUpKeyDownBehavior(),1!==this.settings.defaultInitialPage&&this.moveTo(this.settings.defaultInitialPage),this.initializedFlag=!0}},{key:'setUpSwiperBehavior',value:function setUpSwiperBehavior(){var b=this;return new _promise2.default(function(c){var d,e,f=function _touchMove(h){var j=h.touches;if(j&&j.length){h.preventDefault();var k=d-j[0].pageX,l=e-j[0].pageY;if(50<=l&&!0!==b.scrollingFlag){var m=new Event('pageUp');b.doc.dispatchEvent(m),b.scrollingFlag=!0}if(-50>=l&&!0!==b.scrollingFlag){var m=new Event('pageDown');b.doc.dispatchEvent(m),b.scrollingFlag=!0}}};b.doc.addEventListener('touchstart',function _touchStart(h){var j=h.touches,k=b._isDescendant(b.container,h.target);!k||j&&j.length&&(d=j[0].pageX,e=j[0].pageY,b.scrollingFlag=!1,b.doc.addEventListener('touchmove',f))}),b.doc.addEventListener('touchend',function(){b.doc.removeEventListener('touchmove',f)}),b.doc.addEventListener('pageDown',function(h){b.pauseFlag||h.preventDefault(),b.pauseFlag||b.moveUp()}),b.doc.addEventListener('pageUp',function(h){b.pauseFlag||h.preventDefault(),b.pauseFlag||b.moveDown()}),c()})}},{key:'setUpMouseWheelBehavior',value:function setUpMouseWheelBehavior(){var b=this;return new _promise2.default(function(c){var d=function _mouseWheelHandler(e){var f=b._isDescendant(b.container,e.target);if(f){var g=e.wheelDelta||-e.detail;b.pauseFlag||e.preventDefault(),b.pauseFlag||b._init_scroll(e,g)}};b.doc.addEventListener('mousewheel',d),b.doc.addEventListener('DOMMouseScroll',d),c()})}},{key:'setUpResponsiveBehavior',value:function setUpResponsiveBehavior(){return new _promise2.default(function(b){window.addEventListener('resize',function(){}),b()})}},{key:'setUpKeyDownBehavior',value:function setUpKeyDownBehavior(){var b=this;return new _promise2.default(function(c){b.doc.onkeydown=function _keydownHandler(e){var f=e.target.tagName.toLowerCase();switch(e.which){case 38:'input'!=f&&'textarea'!=f&&b.moveUp();break;case 40:'input'!=f&&'textarea'!=f&&b.moveDown();break;default:return;}return!1},c()})}},{key:'moveDown',value:function moveDown(){var b=this.doc.querySelector(this.settings.pageContainer+'.active').dataset.index,c=this.doc.querySelector(this.settings.pageContainer+'[data-index="'+b+'"]'),d=this.doc.querySelector(this.settings.pageContainer+'[data-index="'+(parseInt(b)+1)+'"]'),e=0;if(!!d)e=-1*(100*b);else if(!0==this.settings.loop)e=0,d=this.doc.querySelector(this.settings.pageContainer+'[data-index="1"]');else return;var f=d.dataset.index;this._removeClass(c,'active'),this._addClass(d,'active'),this._transformPage(e,f,d)}},{key:'moveUp',value:function moveUp(){var b=this.doc.querySelector(this.settings.pageContainer+'.active').dataset.index,c=this.doc.querySelector(this.settings.pageContainer+'[data-index="'+b+'"]'),d=this.doc.querySelector(this.settings.pageContainer+'[data-index="'+(parseInt(b)-1)+'"]'),e=0;if(!!d)e=-1*(100*(d.dataset.index-1));else if(!0==this.settings.loop)e=-1*(100*(total-1)),d=this.doc.querySelector(this.settings.pageContainer+'[data-index="'+total+'"]');else return;var f=d.dataset.index;this._removeClass(c,'active'),this._addClass(d,'active'),!0==this.settings.pagination&&(this._removeClass(this.doc.querySelector('.onepage-pagination li a[data-index="'+b+'"]'),'active'),this._addClass(this.doc.querySelector('.onepage-pagination li a[data-index="'+f+'"]'),'active')),this._transformPage(e,f,d)}},{key:'moveTo',value:function moveTo(b){var c=this.doc.querySelector(this.settings.pageContainer+'.active'),d=this.doc.querySelector(this.settings.pageContainer+'[data-index=\''+b+'\']'),e=0;if(d){d.dataset.index;this._removeClass(c,'active'),this._addClass(d,'active'),e=-1*(100*(b-1)),this._transformPage(e,b,d)}}},{key:'_init_scroll',value:function _init_scroll(b,c){var e=new Date().getTime();return e-this.lastAnimation<this.quietPeriod+this.settings.animationTime||!0===this.pauseFlag?void b.preventDefault():void(0>c?this.moveDown():this.moveUp(),this.lastAnimation=e)}},{key:'_addClass',value:function _addClass(b,c){this._hasClass(b,c)||(b.className+=' '+c),b.className=this._trim(b.className)}},{key:'_removeClass',value:function _removeClass(b,c){if(this._hasClass(b,c)){var d=new RegExp('(\\s|^)'+c+'(\\s|$)');b.className=b.className.replace(d,' ')}b.className=this._trim(b.className)}},{key:'_hasClass',value:function _hasClass(b,c){return b.className?b.className.match(new RegExp('(\\s|^)'+c+'(\\s|$)')):b.className=c}},{key:'_trim',value:function _trim(b){return b.replace(/^\s\s*/,'').replace(/\s\s*$/,'')}},{key:'_transformPage',value:function _transformPage(b,c,d){var e=this;'function'==typeof this.settings.beforeMove&&this.settings.beforeMove(c,d);var f='\n      touch-action: none;\n      -webkit-transform: translate3d(0, '+b+'%, 0);\n      -webkit-transition: -webkit-transform '+this.settings.animationTime+'ms '+this.settings.easing+';\n      -moz-transform: translate3d(0, '+b+'%, 0);\n      -moz-transition: -moz-transform '+this.settings.animationTime+'ms '+this.settings.easing+';\n      -ms-transform: translate3d(0, '+b+'%, 0);\n      -ms-transition: -ms-transform '+this.settings.animationTime+'ms '+this.settings.easing+';\n      transform: translate3d(0, '+b+'%, 0);\n      transition: all '+this.settings.animationTime+'ms '+this.settings.easing+';';this.container.style.cssText=f;var g=this._whichTransitionEvent(),h=function endAnimation(){'function'==typeof e.settings.afterMove&&e.settings.afterMove(c,d),e.container.removeEventListener(g,h)};this.container.addEventListener(g,h,!1)}},{key:'_whichTransitionEvent',value:function _whichTransitionEvent(){var b=document.createElement('fakeelement'),c={transition:'transitionend',OTransition:'oTransitionEnd',MozTransition:'transitionend',WebkitTransition:'webkitTransitionEnd'};for(var d in c)if(void 0!==b.style[d])return c[d]}},{key:'_isDescendant',value:function _isDescendant(b,c){for(var d=c.parentNode;null!==d;){if(d===b)return!0;d=d.parentNode}return!1}},{key:'isDescendant',value:function isDescendant(){return _isDescendant()}},{key:'pauseToggle',value:function pauseToggle(){this.pauseFlag=!this.pauseFlag}},{key:'cancelPause',value:function cancelPause(){this.pauseFlag=!1}},{key:'doPause',value:function doPause(){this.pauseFlag=!0}}]),a}();