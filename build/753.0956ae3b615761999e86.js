/*! For license information please see 753.0956ae3b615761999e86.js.LICENSE.txt */
"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[753],{5753:(t,e,n)=>{n.r(e),n.d(e,{default:()=>j});var r=n(7629),o=n(3930),i=n(834),a=n(4566),u=n(1901),c=n(2317),l=n(1235),s=n(8596),f=n(7886),p=n(8550),h=n(5216),m=n(6887);function y(t){return y="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},y(t)}function g(t){return function(t){if(Array.isArray(t))return E(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||x(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function v(){v=function(){return t};var t={},e=Object.prototype,n=e.hasOwnProperty,r=Object.defineProperty||function(t,e,n){t[e]=n.value},o="function"==typeof Symbol?Symbol:{},i=o.iterator||"@@iterator",a=o.asyncIterator||"@@asyncIterator",u=o.toStringTag||"@@toStringTag";function c(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{c({},"")}catch(t){c=function(t,e,n){return t[e]=n}}function l(t,e,n,o){var i=e&&e.prototype instanceof p?e:p,a=Object.create(i.prototype),u=new j(o||[]);return r(a,"_invoke",{value:S(t,n,u)}),a}function s(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(t){return{type:"throw",arg:t}}}t.wrap=l;var f={};function p(){}function h(){}function m(){}var g={};c(g,i,(function(){return this}));var d=Object.getPrototypeOf,b=d&&d(d(Z([])));b&&b!==e&&n.call(b,i)&&(g=b);var w=m.prototype=p.prototype=Object.create(g);function x(t){["next","throw","return"].forEach((function(e){c(t,e,(function(t){return this._invoke(e,t)}))}))}function E(t,e){function o(r,i,a,u){var c=s(t[r],t,i);if("throw"!==c.type){var l=c.arg,f=l.value;return f&&"object"==y(f)&&n.call(f,"__await")?e.resolve(f.__await).then((function(t){o("next",t,a,u)}),(function(t){o("throw",t,a,u)})):e.resolve(f).then((function(t){l.value=t,a(l)}),(function(t){return o("throw",t,a,u)}))}u(c.arg)}var i;r(this,"_invoke",{value:function(t,n){function r(){return new e((function(e,r){o(t,n,e,r)}))}return i=i?i.then(r,r):r()}})}function S(t,e,n){var r="suspendedStart";return function(o,i){if("executing"===r)throw new Error("Generator is already running");if("completed"===r){if("throw"===o)throw i;return{value:void 0,done:!0}}for(n.method=o,n.arg=i;;){var a=n.delegate;if(a){var u=P(a,n);if(u){if(u===f)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if("suspendedStart"===r)throw r="completed",n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);r="executing";var c=s(t,e,n);if("normal"===c.type){if(r=n.done?"completed":"suspendedYield",c.arg===f)continue;return{value:c.arg,done:n.done}}"throw"===c.type&&(r="completed",n.method="throw",n.arg=c.arg)}}}function P(t,e){var n=e.method,r=t.iterator[n];if(void 0===r)return e.delegate=null,"throw"===n&&t.iterator.return&&(e.method="return",e.arg=void 0,P(t,e),"throw"===e.method)||"return"!==n&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+n+"' method")),f;var o=s(r,t.iterator,e.arg);if("throw"===o.type)return e.method="throw",e.arg=o.arg,e.delegate=null,f;var i=o.arg;return i?i.done?(e[t.resultName]=i.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=void 0),e.delegate=null,f):i:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,f)}function L(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function O(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function j(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(L,this),this.reset(!0)}function Z(t){if(t){var e=t[i];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var r=-1,o=function e(){for(;++r<t.length;)if(n.call(t,r))return e.value=t[r],e.done=!1,e;return e.value=void 0,e.done=!0,e};return o.next=o}}return{next:k}}function k(){return{value:void 0,done:!0}}return h.prototype=m,r(w,"constructor",{value:m,configurable:!0}),r(m,"constructor",{value:h,configurable:!0}),h.displayName=c(m,u,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===h||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,m):(t.__proto__=m,c(t,u,"GeneratorFunction")),t.prototype=Object.create(w),t},t.awrap=function(t){return{__await:t}},x(E.prototype),c(E.prototype,a,(function(){return this})),t.AsyncIterator=E,t.async=function(e,n,r,o,i){void 0===i&&(i=Promise);var a=new E(l(e,n,r,o),i);return t.isGeneratorFunction(n)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},x(w),c(w,u,"Generator"),c(w,i,(function(){return this})),c(w,"toString",(function(){return"[object Generator]"})),t.keys=function(t){var e=Object(t),n=[];for(var r in e)n.push(r);return n.reverse(),function t(){for(;n.length;){var r=n.pop();if(r in e)return t.value=r,t.done=!1,t}return t.done=!0,t}},t.values=Z,j.prototype={constructor:j,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(O),!t)for(var e in this)"t"===e.charAt(0)&&n.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=void 0)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function r(n,r){return a.type="throw",a.arg=t,e.next=n,r&&(e.method="next",e.arg=void 0),!!r}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],a=i.completion;if("root"===i.tryLoc)return r("end");if(i.tryLoc<=this.prev){var u=n.call(i,"catchLoc"),c=n.call(i,"finallyLoc");if(u&&c){if(this.prev<i.catchLoc)return r(i.catchLoc,!0);if(this.prev<i.finallyLoc)return r(i.finallyLoc)}else if(u){if(this.prev<i.catchLoc)return r(i.catchLoc,!0)}else{if(!c)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return r(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,f):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),f},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),O(n),f}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var o=r.arg;O(n)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:Z(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=void 0),f}},t}function d(t,e,n,r,o,i,a){try{var u=t[i](a),c=u.value}catch(t){return void n(t)}u.done?e(c):Promise.resolve(c).then(r,o)}function b(t){return function(){var e=this,n=arguments;return new Promise((function(r,o){var i=t.apply(e,n);function a(t){d(i,r,o,a,u,"next",t)}function u(t){d(i,r,o,a,u,"throw",t)}a(void 0)}))}}function w(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=n){var r,o,i,a,u=[],c=!0,l=!1;try{if(i=(n=n.call(t)).next,0===e){if(Object(n)!==n)return;c=!1}else for(;!(c=(r=i.call(n)).done)&&(u.push(r.value),u.length!==e);c=!0);}catch(t){l=!0,o=t}finally{try{if(!c&&null!=n.return&&(a=n.return(),Object(a)!==a))return}finally{if(l)throw o}}return u}}(t,e)||x(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function x(t,e){if(t){if("string"==typeof t)return E(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?E(t,e):void 0}}function E(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function S(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function P(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?S(Object(n),!0).forEach((function(e){L(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):S(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function L(t,e,n){return(e=function(t){var e=function(t,e){if("object"!==y(t)||null===t)return t;var n=t[Symbol.toPrimitive];if(void 0!==n){var r=n.call(t,"string");if("object"!==y(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t);return"symbol"===y(e)?e:String(e)}(e))in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function O(t){return r.createElement(a.Z,{open:t.open,sx:{"& .MuiDialog-paper":{width:"100%",maxWidth:720}},onClose:function(){return t.onClose()}},r.createElement(c.Z,{style:{fontSize:16}},"Settings"),r.createElement(u.Z,{dividers:!0},r.createElement(o.ZP,{container:!0,spacing:1},r.createElement(o.ZP,{item:!0,xs:12},"Create Token Length ",t.setting.createTokenLength),r.createElement(o.ZP,{item:!0,xs:12},r.createElement(s.ZP,{value:t.setting.createTokenLength,onChange:function(e,n){return t.setSetting((function(t){return t.createTokenLength=n,P({},t)}))},min:1,max:2048,step:1})),r.createElement(o.ZP,{item:!0,xs:12},"Memory Context Length ",t.setting.memoryContextLength),r.createElement(o.ZP,{item:!0,xs:12},r.createElement(s.ZP,{value:t.setting.memoryContextLength,onChange:function(e,n){return t.setSetting((function(t){return t.memoryContextLength=n,P({},t)}))},min:1,max:64,step:1})),r.createElement(o.ZP,{item:!0,xs:12},"Top P ",t.setting.topP),r.createElement(o.ZP,{item:!0,xs:12},r.createElement(s.ZP,{value:t.setting.topP,onChange:function(e,n){return t.setSetting((function(t){return t.topP=n,P({},t)}))},min:0,max:1,step:.01})),r.createElement(o.ZP,{item:!0,xs:12},"Temperature ",t.setting.temperature),r.createElement(o.ZP,{item:!0,xs:12},r.createElement(s.ZP,{value:t.setting.temperature,onChange:function(e,n){return t.setSetting((function(t){return t.temperature=n,P({},t)}))},min:0,max:2,step:.01})),r.createElement(o.ZP,{item:!0,xs:12},"Repeat Length ",t.setting.repeatLength),r.createElement(o.ZP,{item:!0,xs:12},r.createElement(s.ZP,{value:t.setting.repeatLength,onChange:function(e,n){return t.setSetting((function(t){return t.repeatLength=n,P({},t)}))},min:0,max:64,step:1})),r.createElement(o.ZP,{item:!0,xs:12},"Punctuation Space ",t.setting.punctuationSpace),r.createElement(o.ZP,{item:!0,xs:12},r.createElement(s.ZP,{value:t.setting.punctuationSpace,onChange:function(e,n){return t.setSetting((function(t){return t.punctuationSpace=n,P({},t)}))},min:0,max:64,step:1})))),r.createElement(l.Z,null,r.createElement(i.Z,{variant:"contained"},t.prompt.length),r.createElement(i.Z,{variant:"contained",onClick:function(){return t.onClose()}},"Save")))}const j=function(){var t=r.useRef(),e=w(r.useState(""),2),n=e[0],o=e[1],a=w(r.useState({createTokenLength:1024,memoryContextLength:4,topP:.9,temperature:1.5,repeatLength:8,repeatDistance:1024,repeatMaxTime:4,punctuationSpace:8,stopToken:""}),2),u=a[0],c=a[1],l=w(r.useState(),2),s=l[0],y=l[1],d=w(r.useState(!1),2),x=d[0],E=d[1],S=function(){var t=b(v().mark((function t(e){var r,i,a,c;return v().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=function(){var t=b(v().mark((function t(e){var n;return v().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,new Promise((function(t){!function n(){return e.next?(0,m.Md)()((function(){e.next(),n()})):t(e.result)}()}));case 2:return n=t.sent,t.abrupt("return",n);case 4:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),i=function(){var t=b(v().mark((function t(e){var n;return v().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,new Promise((function(t){!function n(){return e.next?(0,m.Md)()((function(){e.next(),o([].concat(g(e.token),g(e.result)).join("")),n()})):t(e.result)}()}));case 2:return n=t.sent,t.abrupt("return",n);case 4:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),E(!0),f.Z.setState((function(t){return t.loading=t.loading+1,t})),console.log(n),t.next=7,r((0,p.q)(n));case 7:return a=t.sent,console.log(a),t.next=11,i((0,h.R)(a,P(P({},u),e),f.Z.state.library));case 11:c=t.sent,console.log(c),f.Z.setState((function(t){return t.loading=t.loading-1,t})),E(!1);case 15:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}();return r.useEffect((function(){x&&(t.current.scrollTop=1e5)}),[x,n]),r.createElement(r.Fragment,null,r.createElement("textarea",{value:n,onChange:function(t){return o(t.target.value)},style:{width:"100%",height:"100%",lineHeight:1.5,border:"none",outline:"none",resize:"none",padding:16,paddingBottom:68},ref:function(e){return t.current=e}}),r.createElement("div",{style:{position:"absolute",bottom:16,left:16,fontSize:12}},n.length),r.createElement("div",{style:{position:"absolute",bottom:16,left:0,right:0,margin:"auto",width:"fit-content",display:"flex"}},r.createElement(i.Z,{variant:"contained",style:{textTransform:"none",margin:"0 8px"},onClick:function(){return y(!0)}},"Setting"),r.createElement(i.Z,{variant:"contained",style:{textTransform:"none",margin:"0 8px"},onClick:function(){return S()}},"Generate"),r.createElement(i.Z,{variant:"contained",style:{textTransform:"none",margin:"0 8px"},onClick:function(){return S({createTokenLength:1})}},"Next")),r.createElement(O,{open:Boolean(s),onClose:function(){return y()},setting:u,setSetting:c,prompt:n}))}},6887:(t,e,n)=>{n.d(e,{Md:()=>r,mq:()=>o}),window.location.origin;var r=function(){return window.requestIdleCallback?window.requestIdleCallback:window.requestAnimationFrame?window.requestAnimationFrame:function(t){return setTimeout((function(){return t}),35)}},o=function(){return function(t){return t()}}}}]);