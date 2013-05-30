var Lawnchair=function(e,t){if(!(this instanceof Lawnchair))return new Lawnchair(e,t);if(!JSON)throw"JSON unavailable! Include http://www.json.org/json2.js to fix.";if(!(arguments.length<=2&&arguments.length>0))throw"Incorrect # of ctor args!";t=typeof arguments[0]=="function"?arguments[0]:arguments[1],e=typeof arguments[0]=="function"?{}:arguments[0];if(typeof t!="function")throw"No callback was provided";this.record=e.record||"record",this.name=e.name||"records";var n;if(e.adapter){for(var r=0,i=Lawnchair.adapters.length;r<i;r++)if(Lawnchair.adapters[r].adapter===e.adapter){n=Lawnchair.adapters[r].valid()?Lawnchair.adapters[r]:undefined;break}}else for(var r=0,i=Lawnchair.adapters.length;r<i;r++){n=Lawnchair.adapters[r].valid()?Lawnchair.adapters[r]:undefined;if(n)break}if(!n)throw"No valid adapter.";for(var s in n)this[s]=n[s];for(var r=0,i=Lawnchair.plugins.length;r<i;r++)Lawnchair.plugins[r].call(this);this.init(e,t)};Lawnchair.adapters=[],Lawnchair.adapter=function(e,t){t.adapter=e;var n="adapter valid init keys save batch get exists all remove nuke".split(" "),r=this.prototype.indexOf;for(var i in t)if(r(n,i)===-1)throw"Invalid adapter! Nonstandard method: "+i;Lawnchair.adapters.splice(0,0,t)},Lawnchair.plugins=[],Lawnchair.plugin=function(e){for(var t in e)t==="init"?Lawnchair.plugins.push(e[t]):this.prototype[t]=e[t]},Lawnchair.prototype={isArray:Array.isArray||function(e){return Object.prototype.toString.call(e)==="[object Array]"},indexOf:function(e,t,n,r){if(e.indexOf)return e.indexOf(t);for(n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return-1},lambda:function(e){return this.fn(this.record,e)},fn:function(e,t){return typeof t=="string"?new Function(e,t):t},uuid:function(){var e=function(){return((1+Math.random())*65536|0).toString(16).substring(1)};return e()+e()+"-"+e()+"-"+e()+"-"+e()+"-"+e()+e()+e()},each:function(e){var t=this.lambda(e);if(this.__results)for(var n=0,r=this.__results.length;n<r;n++)t.call(this,this.__results[n],n);else this.all(function(e){for(var n=0,r=e.length;n<r;n++)t.call(this,e[n],n)});return this}},Lawnchair.adapter("dom",function(){var e=window.localStorage,t=function(t){return{key:t+"._index_",all:function(){var t=e.getItem(this.key);return t&&(t=JSON.parse(t)),t===null&&e.setItem(this.key,JSON.stringify([])),JSON.parse(e.getItem(this.key))},add:function(t){var n=this.all();n.push(t),e.setItem(this.key,JSON.stringify(n))},del:function(t){var n=this.all(),r=[];for(var i=0,s=n.length;i<s;i++)n[i]!=t&&r.push(n[i]);e.setItem(this.key,JSON.stringify(r))},find:function(e){var t=this.all();for(var n=0,r=t.length;n<r;n++)if(e===t[n])return n;return!1}}};return{valid:function(){return!!e},init:function(e,n){this.indexer=t(this.name),n&&this.fn(this.name,n).call(this,this)},save:function(t,n){var r=t.key?this.name+"."+t.key:this.name+"."+this.uuid();return this.indexer.find(r)===!1&&this.indexer.add(r),delete t.key,e.setItem(r,JSON.stringify(t)),t.key=r.slice(this.name.length+1),n&&this.lambda(n).call(this,t),this},batch:function(e,t){var n=[];for(var r=0,i=e.length;r<i;r++)this.save(e[r],function(e){n.push(e)});return t&&this.lambda(t).call(this,n),this},keys:function(e){if(e){var t=this.name,n=this.indexer.all().map(function(e){return e.replace(t+".","")});this.fn("keys",e).call(this,n)}return this},get:function(t,n){if(this.isArray(t)){var r=[];for(var i=0,s=t.length;i<s;i++){var o=this.name+"."+t[i],u=e.getItem(o);u&&(u=JSON.parse(u),u.key=t[i],r.push(u))}n&&this.lambda(n).call(this,r)}else{var o=this.name+"."+t,u=e.getItem(o);u&&(u=JSON.parse(u),u.key=t),n&&this.lambda(n).call(this,u)}return this},exists:function(e,t){var n=this.indexer.find(this.name+"."+e)===!1?!1:!0;return this.lambda(t).call(this,n),this},all:function(t){var n=this.indexer.all(),r=[],i,s;for(var o=0,u=n.length;o<u;o++)s=n[o],i=JSON.parse(e.getItem(s)),i.key=s.replace(this.name+".",""),r.push(i);return t&&this.fn(this.name,t).call(this,r),this},remove:function(t,n){var r=this.name+"."+(t.key?t.key:t);return this.indexer.del(r),e.removeItem(r),n&&this.lambda(n).call(this),this},nuke:function(e){return this.all(function(t){for(var n=0,r=t.length;n<r;n++)this.remove(t[n]);e&&this.lambda(e).call(this)}),this}}}()),Lawnchair.adapter("window-name",function(e,t){var n=window.top.name?JSON.parse(window.top.name):{};return{valid:function(){return typeof window.top.name!="undefined"},init:function(r,i){n[this.name]=n[this.name]||{index:[],store:{}},e=n[this.name].index,t=n[this.name].store,this.fn(this.name,i).call(this,this)},keys:function(t){return this.fn("keys",t).call(this,e),this},save:function(r,i){var s=r.key||this.uuid();return r.key&&delete r.key,this.exists(s,function(o){o||e.push(s),t[s]=r,window.top.name=JSON.stringify(n),r.key=s,i&&this.lambda(i).call(this,r)}),this},batch:function(e,t){var n=[];for(var r=0,i=e.length;r<i;r++)this.save(e[r],function(e){n.push(e)});return t&&this.lambda(t).call(this,n),this},get:function(e,n){var r;if(this.isArray(e)){r=[];for(var i=0,s=e.length;i<s;i++)r.push(t[e[i]])}else r=t[e],r&&(r.key=e);return n&&this.lambda(n).call(this,r),this},exists:function(e,n){return this.lambda(n).call(this,!!t[e]),this},all:function(n){var r=[];for(var i=0,s=e.length;i<s;i++){var o=t[e[i]];o.key=e[i],r.push(o)}return this.fn(this.name,n).call(this,r),this},remove:function(r,i){var s=this.isArray(r)?r:[r];for(var o=0,u=s.length;o<u;o++)delete t[s[o]],e.splice(this.indexOf(e,s[o]),1);return window.top.name=JSON.stringify(n),i&&this.lambda(i).call(this),this},nuke:function(t){return storage={},e=[],window.top.name=JSON.stringify(n),t&&this.lambda(t).call(this),this}}}()),function(){var e;e=function(e){var t,n,r,i,s,o,u,a,f,l,c;return e==null&&(e=null),e?window.stage=Kinetic.Node.create(e,"container"):window.stage=new Kinetic.Stage({container:"container"}),window.stage.setWidth(window.innerWidth),window.stage.setHeight(window.innerHeight),n=new Kinetic.Layer,t=new Kinetic.Rect({x:0,y:0,width:window.innerWidth,height:window.innerHeight}),l=new Kinetic.Rect({x:0,y:0,width:window.innerWidth/2,height:window.innerHeight/2,fill:"#333"}),c=new Kinetic.Rect({x:window.innerWidth/2,y:0,width:window.innerWidth/2,height:window.innerHeight/2,fill:"#555"}),r=new Kinetic.Rect({x:0,y:window.innerHeight/2,width:window.innerWidth/2,height:window.innerHeight/2,fill:"#777"}),i=new Kinetic.Rect({x:window.innerWidth/2,y:window.innerHeight/2,width:window.innerWidth/2,height:window.innerHeight/2,fill:"#999"}),s=new Kinetic.Layer,u=stage.getWidth()/2-50,a=stage.getHeight()/2-25,o=function(e,t,n){var r,i,s;return r=new Kinetic.Label({x:t,y:n,draggable:!0,dragOnTop:!0}),i=new Kinetic.Tag({fill:"#F5F5F5"}),s=new Kinetic.Text({text:e,fontSize:12,fontFamily:"Menlo",padding:6,fill:"black"}),r.on("dragstart touchstart mousedown",function(){return this.moveToTop()}),r.on("mouseover",function(){return document.body.style.cursor="pointer"}),r.on("mouseout",function(){return document.body.style.cursor="default"}),s.on("dblclick",function(e){e.cancelBubble=!0;if(this.getText())return this.setText(prompt("New Text:",this.getText())),f()}),r.on("touchstart",function(e){return e.cancelBubble=!0}),r.add(i).add(s),r},stage.on("touchstart dblclick",function(e){return s.add(o(prompt("New Tag:"),e.layerX,e.layerY)),f()}),f=function(){return s.draw(),window.store.save({key:"stage",options:window.stage.toJSON()})},stage.on("dragend",f),n.add(t),n.add(l),n.add(c),n.add(r),n.add(i),window.stage.add(n).add(s)},window.store=new Lawnchair({name:window.location.hash||"testing"},function(t){return t.get("stage",function(t){return t&&t.options?e(t.options):e()})})}.call(this);