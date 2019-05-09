!function(e){var t={};function o(n){if(t[n])return t[n].exports;var s=t[n]={i:n,l:!1,exports:{}};return e[n].call(s.exports,s,s.exports,o),s.l=!0,s.exports}o.m=e,o.c=t,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)o.d(n,s,function(t){return e[t]}.bind(null,s));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=0)}([function(e,t,o){"use strict";o.r(t);var n=Object.keys(localStorage).some(e=>-1!==e.indexOf("ConsoleGame.prefs"));console.log(n?"user preferences applied.":"no user preferences detected.");var s=localStorage.getItem("ConsoleGame.prefs.font")||"monaco",i=localStorage.getItem("ConsoleGame.prefs.color")||"#32cd32",a=localStorage.getItem("ConsoleGame.prefs.size")||"100%",r=`font-size:calc(1.2 * ${a});color:${i};font-family:${s}`;var l=function(){const e=["****************","****************","****************","****************","****************","****************","****************","****************","****************","****************","****************","****************","****************","****************","****************","****************"];return(e=>{let t,o=[];return e.map(e=>{t=e.map(e=>e.split("")),o.push(t)}),o})([e,["****************","***RQP@*********","***S#***********","***TUV**********","*****W**********","*****XY*********","******Z*********","****************","****************","****************","****************","****************","****************","****************","****************","****************"],["****************","****************","****#***********","****************","****************","****************","****************","****************","****************","****************","****************","****************","****************","***************","****************","****************"],["****************","****$***********","****0000000000**","****0000000000**","*****@**********","*****XY*********","******Z*********","****************","****************","****************","****************","******0%0*******","******0%0*******","******0%0*******","*******A********","****************"],["****************","****************","****************","****************","****************","****************","******Z*********","****************","****************","****************","****************","****************","****************","*******#********","****************","****************"],["****************","***RQP@*********","***S#***********","***TUV**********","*****W**********","*****XY*********","******Z*********","****************","****************","****************","****************","****************","*******$********","*******^********","****************","****************"],e])}();var c=e=>{const t={name:"Nowhere",locked:!1,lockText:"",unlockText:"",hideSecrets:!1,description:"You find yourself in a non-descript, unremarkable, non-place. Nothing of interest is likely to ever happen here.",hiddenEnv:[],visibleEnv:[],get env(){return this.hideSecrets?this.visibleEnv:(this.visibleEnv=this.visibleEnv.concat(this.hiddenEnv),this.hiddenEnv=[],this.visibleEnv)},set env(e){return this.visibleEnv=e},removeFromEnv:function(e){const t=this.visibleEnv.map(e=>e.name).indexOf(e.name);return-1!==t?this.env.splice(t,1):console.log("Cannot remove as item is not present in environment.")},addToEnv:function(t){const o=e.items[`_${t}`];return this.visibleEnv.push(o)}},o={0:{locked:!0,lockText:"An attempt has been made to board up this door. Reaching between the unevenly spaced boards, you try the doorknob and discover that it is also locked."},A:{name:"Freedom!",locked:!0,lockText:"The formidable wooden front door will not open. It looks as old as the rest of the building, and like the wood panelled walls of the entrance hall, it is dark with countless murky layers of varnish. This makes it very easy to see exactly why the door won't open– a shiny, apparently new stainless steel deadbolt. The keyhole is empty."},"^":{name:"Second floor hallway",description:"You are at the top of a wide wooden staircase, on the second floor of the old house.",visibleEnv:[]},"#":{name:"Staircase landing",description:"You are on the landing of a worn oak staircase connecting the first and second floors of the old abandoned house.",visibleEnv:["key","note","catalogue"]},"%":{name:"Entrance hall",description:"You are in the main entrance hall of a seemingly abandoned house. There are three doors on either side of the hall, several of which have been boarded up. Facing you at the rear of the hall is a wide oak staircase that connects the first and second floors of the old house.",visibleEnv:["door","lock"]},"@":{name:"Stone staircase",description:"You are standing on a stone staircase leading to the basement. A faint cold draft greets you from below."},$:{name:"Broom closet",hideSecrets:!0,hiddenEnv:["glove"],visibleEnv:["chain"],des1:"The small closet is dark, although you can see a small chain hanging in front of you.",get des2(){const t=this.hiddenEnv,o=t.length>1?"y":"ies";return"The inside of this small broom closet is devoid of brooms, or much of anything else, for that matter"+(t.length?`, with the exception of ${e.formatList(t.map(e=>`${e.article} ${e.name}`))} which occup${o} a dusty corner.`:".")},get description(){return this.hideSecrets?this.des1:this.des2}}};return Object.keys(o).map(e=>{Object.setPrototypeOf(o[e],t)}),o};var h=e=>{const t={name:"Item",used:!1,weight:1,get description(){return`There is nothing particularly interesting about this ${this.name}.`},takeable:!0,openable:!1,closed:!1,locked:!1,article:"a",take:function(){return e.state.objectMode=!1,this.takeable&&e.inEnvironment(this.name)?(e.addToInventory([this]),e.mapKey[e.state.currentCell].removeFromEnv(this),console.p(`You pick up the ${this.name}`)):console.p("You can't take that.")},drop:function(){return e.state.objectMode=!1,e.inInventory(this.name)?(e.removeFromInventory(this),e.mapKey[e.state.currentCell].env.push(this),console.p(`${this.name} dropped.`)):console.p("You don't have that.")},examine:function(){return e.state.objectMode=!1,console.p(this.description)},open:function(){e.state.objectMode=!1,e.inEnvironment?this.openable?this.closed?this.locked?console.p("It appears to be locked."):(console.p(`The ${this.name} is now open.`),this.closed=!1):console.p("It is already open."):console.p("It cannot be opened."):console.p(`You don't see ${this.article} ${this.name} here.`)},read:function(){return e.state.objectMode=!1,this.text?e.inInventory(this.name)?(console.p(`The text on the ${this.name} reads: \n`),console.note(this.text)):console.p(`You will need to pick up the ${this.name} first.`):console.p("There is nothing to read.")},hide:function(){return e.displayItem()},unlock:function(){if(e.state.objectMode=!1,this.locked)return e.inInventory(this.unlockedBy)?(this.locked=!1,void console.p(`Using the ${this.unlockedBy}, you are able to unlock the ${this.name}`)):void console.p(`You do not have the means to unlock the ${this.name}.`);console.p(`The ${this.name} is not locked.`)},use:function(){return e.state.objectMode=!1,console.p(`Try as you might, you cannot manage to use the ${this.name}`)}},o={_all:{name:"all",_take_all:function(){e.state.env}},_book:{name:"book",weight:2,article:"a",description:"This dusty, leatherbound tome"},_catalogue:{name:"catalogue",article:"a",description:"This booklet appears to be the exhibition catalogue for some fancy art show. ",read:function(){console.info('[click link to read => "https://drive.google.com/file/d/0B89dfqio_IykVk9ZMV96TUJESnM/view?usp=sharing"]')}},_door:{name:"door",article:"a",openable:!0,locked:!0,closed:!0,unlockedBy:"key",description:"It is a massive wooden door, darkened with generations of dirt and varnish. It is secured with a steel deadbolt."},_lock:{name:"lock",weight:0,description:"The brushed steel surface of the lock is virtually unscratched, its brightness in stark contrast to the dark and grimy wood of the heavy front door. It seems certain that this deadbolt was installed very recently. It is a very sturdy-looking lock and without the key that fits its currently vacant keyhole, you will not be able to open it."},_chain:{name:"chain",weight:0,description:'The thin ball chain dangling in front of you is exactly the sort often connected to a lightbulb. Perhaps you should "pull" it...',takeable:!1,pull:function(){e.state.objectMode=!1;let t=e.mapKey[e.state.currentCell].hideSecrets;return t?console.p("An overhead lightbulb flickers on, faintly illuminating the room."):console.p("The lightbulb is extinguished."),e.mapKey[e.state.currentCell].hideSecrets=!t,e.describeSurroundings()},use:function(){return this.pull()}},_glove:{name:"glove",description:"It is a well-worn gray leather work glove. There is nothing otherwise remarkable about it. 🧤",contents:[],examine:function(){if(e.state.objectMode=!1,this.contents.length){const t=this.contents.pop();return console.p(`${this.description}\nAs you examine the glove, a ${t.name} falls out, onto the floor.`),e.mapKey[e.state.currentCell].addToEnv(t.name)}return this.description}},_grue_repellant:{name:"grue_repellant",defective:Math.random()<.03,weight:3,article:"some",description:"A 12oz can of premium aerosol grue repellant. This is the good stuff. Grues genuinely find it to be somewhat off-putting.",use:function(){return e.state.objectMode=!1,e.inInventory(this.name)?this.used?console.p("Sorry, but it has already been used."):this.defective?(this.used=!0,console.p("Nothing happens. This must be one of the Math.random() < 0.03 of grue_repellant cans that were programmed to be, I mean, that were accidentally manufactured defectively. Repeated attempts to coax repellant from the aerosol canister prove equally fruitless.")):(this.used=!0,console.p("A cloud of repellant hisses from the canister, temporarily obscuring your surroundings. By the time it clears, your head begins to throb, and you feel a dull, leaden taste coating your tongue. The edges of your eyes and nostrils feel sunburnt, and you there is also a burning sensation to accompany an unsteady buzzing in your ears. Although you are not a grue, you find it to be more than somewhat off-putting.")):inEnvironment(this.name)?console.p("You will need to pick it up first."):console.p("You don't see that here.")},spray:function(){return this.use()},drink:function(){e.dead("Drinking from an aerosol can is awkward at best, but still you manage to ravenously slather your chops with the foaming grue repellant. You try to enjoy the searing pain inflicted by this highly caustic (and highly toxic!) chemical as it dissolves the flesh of your mouth and throat, but to no avail. It is not delicious, and you are starting to realize that there are some non-trivial drawbacks to willingly ingesting poison. Oops.")}},_key:{name:"key",description:"It is an old-timey key that appears to be made of tarnished brass"},_note:{name:"note",text:"Dear John,\nI'm leaving. After all of this time, I said it. But I want you to understand that it is not because of you, or something you've done (you have been a loving and loyal partner). It is I who have changed. I am leaving because I am not the person who married you so many years ago; that, and the incredibly low, low prices at Apple Cabin. Click here ==> http://liartownusa.tumblr.com/post/44189893625/apple-cabin-foods-no-2 to see why I prefer their produce for its quality and respectability.",description:"A filthy note you found on the floor of a restroom. Congratulations, it is still slightly damp. Despite its disquieting moistness, the text is still legible."},_no_tea:{name:"no_tea",weight:0,article:"",description:"You do not have any tea.",methodCallcount:0,no_teaMethod:function(t){this.methodCallcount++,e.state.objectMode=!1,console.p(t),this.methodCallcount>1&&console.inline(["Perhaps you should take a moment to ","contemplate"," that."],[r,r+"font-style:italic;",r])},drink:function(){return this.no_teaMethod("How do you intend to drink no tea?")},drop:function(){return this.no_teaMethod("You can't very well drop tea that you don't have.")},take:function(){return this.no_teaMethod("No tea isn't the sort of thing you can take.")},examine:function(){return this.no_teaMethod(this.description)},use:function(){return this.no_teaMethod("Unsurprisingly, using the no tea has no effect.")},contemplate:function(){return this.methodCallcount>1?(console.p("Having thoroughly contemplated the existential ramifications of no tea, you suddenly find that your being transcends all time and space. You are the spoon, so to speak."),console.h1("You just won, you winner, you!")):this.no_teaMethod("Let's not resort to that just yet!")},takeable:!1}};return Object.keys(o).map(e=>{Object.setPrototypeOf(o[e],t)}),o};var d={contemplate:["consider","meditate","think","cogitate","cerebrate","ponder","excogitate","muse","reflect","mull","ruminate"],drink:["intake","uptake","imbibe","consume","ingest","have","chug","guzzle"],drop:["unload","discharge","dismiss","shed","discard","release","shitcan","trash","expel"],examine:["analyze","analyse","study","investigate","inspect","scan"],glove:["mitt","gloves","handwear","mitten","mittens"],go:["travel","move","locomote","proceed","depart","exit","leave","run"],grue_repellant:["repellant","aerosol","spray"],inventory:["booty","bounty","hoard","possessions","belongings"],lock:["deadbolt"],look:["see","observe"],note:["letter","missive","paper","epistle","treatise"],open:["unclose"],pull:["tug","yank","jerk"],read:["skim","peruse"],spray:["squirt","spurt","spirt","scatter","sprinkle","disperse","dispense"],take:["acquire","steal","purloin","pilfer","obtain","gank","get","appropriate","arrogate","confiscate","retrieve"],use:["utilize","utilise","apply","employ","exploit","expend"],wait:["abide","await","delay","tarry","dawdle","dillydally","loiter","pause","rest","relax","remain","hesitate","procrastinate"]};var u=e=>{const{_start:t,_help:o,_commands:n,_restore:s,_save:i,_save_slot:a,_quit:c,_resume:h,cases:u}=e,m=t=>{let o={x:e.state.position.x,y:e.state.position.y,z:e.state.position.z};switch(t){case"north":o.y=o.y-1;break;case"south":o.y=o.y+1;break;case"east":o.x=o.x+1;break;case"west":o.x=o.x-1;break;case"up":o.z=o.z+1;break;case"down":o.z=o.z-1}return"*"===l[o.z][o.y][o.x]?console.p("You can't go that direction"):(console.p(`You walk ${t}...`),e.state.position={x:o.x,y:o.y,z:o.z},e.describeSurroundings())},p=t=>{e.state.objectMode=!0,e.state.pendingAction=t,console.p(`What is it you would like to ${t}?`)},f=t=>{e.state.prefMode=!0,e.state.pendingAction=t,console.codeInline([`To set the value of ${t}, you must type an underscore `,"_",", followed by the value enclosed in backticks ","`","."]),console.codeInline(["For example: ","_`value`"])},y=t=>{if(!e.state.objectMode)return console.p("Invalid command");const o=e.inEnvironment(t)||e.inInventory(t);return o?o[e.state.pendingAction]():console.p(`${t} is not available`)},g=(e,t=null,o="")=>{let n=[];return t&&(n=(t[e]||[]).filter(e=>{if(-1===e.indexOf(" "))return u(e)})),`${u(e)},${n.join()}${o?","+o:""}`},v=[[t,u("start","begin","commence")],[h,u("resume")],[m,u("north")+",n,N"],[m,u("south")+",s,S"],[m,u("east")+",e,E"],[m,u("west")+",w,W"],[m,u("up")+",u,U"],[m,u("down")+",d,D"],[()=>{console.p("Time passes...")},g("wait",d)+",z,Z,zzz,ZZZ,Zzz"],[t=>e.describeSurroundings(),u("look","see","observe")+",l,L"],[t=>{let o=[],n=[];e.state.inventory.map(e=>{o.push(e.name);const t=e.article?`${e.article} ${e.name}`:e.name;n.push(t)});let s=`You are carrying ${e.formatList(n)}`.split(" "),i=s.map(e=>{let t=r;return o.map(o=>{e.includes(o)&&(t="font-size:120%;color:cyan;font-style:italic;")}),t});return s=s.map((e,t)=>t===s.length-1?`${e}.`:`${e} `),console.inline(s,i)},g("inventory",d)+",i,I"],[p,g("use",d)],[p,g("take",d)],[p,g("read",d)],[p,g("examine",d)+",x,X"],[p,g("drink",d)],[p,g("drop",d)],[p,g("pull",d)],[p,g("spray",d)],[p,g("contemplate",d)],[p,g("unlock",d)],[p,g("open",d)],[p,u("hide")],[t=>{const o=e.state.inventory.map(e=>{const{name:t,description:o}=e;return{name:t,description:o}});return console.table(o,["name","description"])},u("inventoryTable","invTable","invt")],[o,u("help")+",h,H"],[n,u("commands")+",c,C"],[i,u("save")],[a,"_0"],[a,"_1"],[a,"_2"],[a,"_3"],[a,"_4"],[a,"_5"],[a,"_6"],[a,"_7"],[a,"_8"],[a,"_9"],[s,u("restore","load")],[f,u("font")],[f,u("color")],[f,u("size")],[()=>{const e=document.querySelector("body");return e.parentNode.removeChild(e),console.papyracy(">poof<")},u("poof")],[c,u("quit")],[c,u("restart")],[()=>{if(e.state.confirmMode)return e.confirmationCallback?e.confirmationCallback():void 0;console.p("nope.")},u("yes")+",y,Y"]],b=Object.keys(e.items).map(e=>e.slice(1)).map(e=>[y,g(e,d)]);return v.concat(b)};(()=>{const e=function(e,t,o="log"){console[o](`%c${e}`,t)};console.custom=((t,o)=>{e(t,o)}),console.h1=(t=>{e(t,`font-size:125%;color:pink;font-family:${s};`)}),console.intro=(t=>{e(t,`font-size:calc(1.25 * ${a});color:thistle;font-family:${s};padding:0 1em;line-height:1.5;`)}),console.note=(t=>{e(t,`font-size:calc(1.2 * ${a});font-family:courier new;font-weight:bold;color:#75715E;background-color:white;line-spacing:2em;padding:0 1em 1em;margin-right:auto;`)}),console.warning=(t=>{e(t,`font-size:calc(1.15 * ${a});color:orange;`,logType="warn")}),console.papyracy=(t=>{e(t,`font-size:calc(1.4 * ${a});color:beige;font-family:Papyrus;`)}),console.p=(t=>{e(t,`font-size:calc(1.2 *${a});color:${i};font-family:${s};padding:0 1em;line-height:1.5;`)}),console.tiny=(t=>{e(t,`font-size:calc(0.5 * ${a});color:#75715E;font-family:${s};`)}),console.info=(t=>{e(t,`font-size:calc(1.15*${a});padding:0.5em 1em 0 0.5em;font-family:${s};`)}),console.invalid=(t=>{e(t,`font-size:calc(1.2 * ${a});color:red;font-family:${s};padding:0 1em;`)}),console.inventory=(t=>{e(t,`font-size:calc(1.2 * ${a});color:cyan;font-family:${s};padding:0 1em;`)}),console.title=(t=>{e(t,`font-size:calc(1.25 * ${a});font-weight:bold;color:${i};font-family:${s};`)}),console.header=(t=>{e(t,`font-size:calc(1.25 * ${a});font-weight:bold;color:${i};font-family:${s};padding:0 1em;`)}),console.groupTitle=(t=>{e(t,`font-size:calc(1.25 * ${a});color:#75EA5B;font-family:${s}`,"group")}),console.inline=((e,t)=>{const o=e.map(e=>`%c${e}`).join("");console.log(o,...t)}),console.codeInline=((e,t,o)=>{t=`font-size:calc(1.15*${a});font-family:${s};font-weight:inherit;line-height:1.5;padding-top:0.5em;`+(t||""),o=`font-family:courier;font-weight:bold;line-height:1.5;padding-top:0.5em;font-size:calc(1.35*${a});color:lime;`+(o||"");const n=Array(e.length).fill(t).map((e,t)=>t%2!=0?o:e);console.inline(e,n)})})();const m={maps:[...l],key:{...c(void 0)},state:{objectMode:!1,saveMode:!1,restoreMode:!1,prefMode:!1,confirmMode:!1,inventory:[],history:[],turn:null,pendingAction:null,startPosition:{z:3,y:13,x:7},position:{z:3,y:13,x:7},get currentCell(){return m.maps[this.position.z][this.position.y][this.position.x]},get env(){return m.mapKey[this.currentCell].env}},get mapKey(){return this.key},set mapKey(e){this.key=e},immuneCommands:["help","start","commands","inventory","inventorytable","look","font","color","size","save","restore","resume","_save_slot","yes","_0","_1","_2","_3","_4","_5","_6","_7","_8","_9"],turnDemon:function(e,t){try{return this.immuneCommands.includes(e)||(this.addToHistory(e),this.state.objectMode||this.state.turn++),t(e)}catch(e){return console.p("That's not going to work. Please try something else.")}},addToHistory:function(e){this.state.history.push(e),window.localStorage.setItem("ConsoleGame.history",this.state.history)},replayHistory:function(e){return this.state.restoreMode=!1,this.initializeNewGame(),console.groupCollapsed("Game loading..."),e.split(",").map(e=>{Function(`${e}`)()}),console.groupEnd("Game loaded.")},addToInventory:function(e){e.map(e=>e instanceof String?this.state.inventory.push(this.items[`_${e}`]):this.state.inventory.push(e))},removeFromInventory:function(e){this.state.inventory.splice(this.state.inventory.indexOf(e),1)},resetGame:function(){this.state.objectMode=!1,this.state.saveMode=!1,this.state.restoreMode=!1,this.state.prefMode=!1,this.state.confirmMode=!1,this.state.inventory=[],this.state.history=[],this.state.turn=0,this.state.pendingAction=null,this.state.position=this.state.startPosition,window.localStorage.removeItem("ConsoleGame.history")},formatList:function(e,t=!1){const o=e.length,n=t?"or":"and";return 0===o?"nowhere":1===o?e[0]:2===o?`${e[0]} ${n} ${e[1]}`:`${e[0]}, ${this.formatList(e.slice(1),t)}`},cases:function(...e){let t,o;return e.map(e=>(t=e.toLowerCase(),o=[t,`${t.charAt(0).toUpperCase()}${t.slice(1)}`,t.toUpperCase()],e.length?o:"")).join(",")},possibleMoves:function(e,t,o){return[["north",void 0!==l[e][t-1]&&"*"!==l[e][t-1][o]],["south",void 0!==l[e][t+1]&&"*"!==l[e][t+1][o]],["east",void 0!==l[e][t][o+1]&&"*"!==l[e][t][o+1]],["west",void 0!==l[e][t][o-1]&&"*"!==l[e][t][o-1]],["up",void 0!==l[e+1]&&"*"!==l[e+1][t][o]],["down",void 0!==l[e-1]&&"*"!==l[e-1][t][o]]].filter(e=>e[1]).map(e=>e[0])},movementOptions:function(){return this.formatList(this.possibleMoves(this.state.position.z,this.state.position.y,this.state.position.x),!0)},describeSurroundings:function(){this.mapKey[this.state.currentCell].name,this.state.turn;const e=this.mapKey[this.state.currentCell].description,t=this.itemsInEnvironment()?`You see ${this.itemsInEnvironment()} here.`:"",o=`You can go ${this.movementOptions()}.`;return console.header(this.currentHeader()),console.p(e+"\n"+o+"\n"+t+"\n")},currentHeader:function(e=80){const t=this.mapKey[this.state.currentCell].name,o=`Turn : ${this.state.turn}`,n=e-t.length-o.length;return`\n${t}${" ".repeat(n)}${o}`},inInventory:function(e){const t=this.state.inventory.map(e=>e.name).indexOf(e);return-1!==t&&this.state.inventory[t]},inEnvironment:function(e){const t=this.mapKey[this.state.currentCell].env.map(e=>e.name).indexOf(e);return-1!==t&&this.mapKey[`${this.state.currentCell}`].env[t]},itemsInEnvironment:function(){return this.state.env.length&&this.formatList(this.state.env.map(e=>`${e.article} ${e.name}`))},displayItem:function(e,t,o,n){let s=document.getElementById("console-game-content");if(!e)return s.innerHTML="";let i=document.createElement("object");return i.setAttribute("data",e),i.setAttribute("type",t),i.setAttribute("width",o||"600px"),i.setAttribute("height",n||"300px"),s.innerHTML="",s.append(i)},dead:function(e){console.p(e),console.p("You have died. Of course, being dead, you are unaware of this unfortunate truth. In fact, you are no longer aware of anything at all."),window.localStorage.removeItem("ConsoleGame.history"),setTimeout(()=>location.reload(),2e3)},_restore:function(e){let t=Object.keys(localStorage).filter(e=>-1!==e.indexOf("ConsoleGame.save"));if(t.length>0){let o=t.map(e=>{return e.substring(e.length-2)});console.codeInline(["saved games:\n",o]),this.state.restoreMode=!0,this.state.saveMode=!1,this.state.pendingAction=e;return console.info("Please choose which slot number (0 – 9) to restore from. To restore, type an underscore, ","_ ","immediately followed by the slot number."),console.codeInline(["For example, type ","_3"," to select slot 3."])}return console.invalid("No saved games found.")},_restoreGame:function(e){this.state.restoreMode=!1;let t=localStorage.getItem(`ConsoleGame.save.${e}`);return this.resetGame(),this.replayHistory(t),this.describeSurroundings()},_save:function(e){this.state.saveMode=!0,this.state.restoreMode=!1,this.state.pendingAction=e;console.info("Please choose a slot number (_0 through _9) to save your this. To save to the selected slot, type an underscore, immediately followed by the slot number."),console.codeInline(["For example, type ","_3"," to select slot 3."])},_save_slot:function(e){if(this.state.saveMode)try{return this._saveGame(e)}catch(t){return console.invalid(`Save to slot ${e} failed.`),console.trace(t)}else if(this.state.restoreMode)try{return this._restoreGame(e),this.state.restoreMode=!1}catch(t){return console.invalid(`Restore from slot ${e} failed.`),console.trace(t)}else console.invalid("Operation failed.")},_saveGame:function(e){const t=`ConsoleGame.save.${e}`;if(localStorage.getItem(t)&&!this.state.confirmMode)return console.invalid("That save slot is already in use."),console.codeInline(["type ","yes ",`to overwrite slot ${e} with current game data.`]),this.state.confirmMode=!0,void(this.confirmationCallback=(()=>this._saveGame(e)));this.state.saveMode=!1,this.state.confirmMode=!1;try{localStorage.setItem(t,this.state.history),console.info(`Game saved to slot ${e}.`),this.describeSurroundings()}catch(t){return console.invalid(`Save to slot ${e} failed.`)}},_quit:function(){return this.resetGame(),location.reload(),"reloading..."},initCommands:function(e){e.map(e=>{let[t,o]=e;this.bindCommandToFunction(t,o)})},bindCommandToFunction:function(e,t,o=this.turnDemon){const n=t.split(","),s=n[0],i=o?o.bind(this,s,e):e.bind(this,s);try{n.map(e=>{Object.defineProperty(window,e.trim(),{get:i})})}catch(e){}},bindInitialCommands:function(){[[this._start,this.cases("start","begin")],[this._resume,this.cases("resume")],[this._help,this.cases("help")+",h,H,ayuda"],[this._commands,this.cases("command","commands")],[this._restore,this.cases("restore","load")],[this._quit,this.cases("quit","restart")],[this._save,this.cases("save")],[this._save_slot,"_0"],[this._save_slot,"_1"],[this._save_slot,"_2"],[this._save_slot,"_3"],[this._save_slot,"_4"],[this._save_slot,"_5"],[this._save_slot,"_6"],[this._save_slot,"_7"],[this._save_slot,"_8"],[this._save_slot,"_9"]].map(e=>{const[t,o]=e;this.bindCommandToFunction(t,o,null)})},setPreference:function(e){console.info(`value for ${this.state.pendingAction} will be set to ${e}`),localStorage.setItem(`ConsoleGame.prefs.${this.state.pendingAction}`,e),localStorage.setItem("ConsoleGame.prefMode","true"),location.reload()},unfinishedGame:function(){return window.localStorage.getItem("ConsoleGame.history")},intro:function(){console.intro("\nWelcome!\nAs a fan of old Infocom interactive fiction games, I thought it would be fun to hide a text adventure in the browser's JavaScript console. This demonstration of the concept is as yet incomplete, but you may try it out by typing in the console below.\n"),console.codeInline(this.introOptions())},introOptions:function(){const e=["[ It looks like you have an unsaved game in progress from a previous session. If you would like to continue, type ","resume",". If you would like to load a saved game, type ","restore",". To begin a new game, please type ","start",". ]"],t=["[ Please type ","help ","for instructions, ","commands ","for a list of available commands, ","restore ","to load a saved game, or "],o=[...t,"resume ","to resume the game. ]"],n=[...t,"start ","to start the game. ]"];return null===this.state.turn?this.unfinishedGame()?e:n:o},stockDungeon:function(e){Object.keys(this.mapKey).map(t=>{let o=this.mapKey[t][e],n=[];return o.length&&o.map(e=>{let t="string"==typeof e?this.items[`_${e}`]:e;t?n.push(t):console.log(`Cannot stock ${e}. No such item.`)}),this.mapKey[t][e]=n,n})},initializeNewGame:function(){this.resetGame(),this.initCommands(this.commands),this.stockDungeon("hiddenEnv"),this.stockDungeon("visibleEnv"),this.items._glove.contents.push(this.items._key),this.addToInventory([this.items._grue_repellant,this.items._no_tea])},_start:function(){return this.state.turn<1&&this.initializeNewGame(),this.describeSurroundings()},_resume:function(){const e=this.unfinishedGame();if(this.state.prefMode=!1,e)return this.replayHistory(e),void this.describeSurroundings();this.state.turn?this.describeSurroundings():this._start()},_help:function(){const e=`font-family:${s};color:thistle;font-size:110%;line-spacing:1.5;`,t="color:#29E616;font-size:125%;";console.codeInline(["Due to the limitations of the browser console as a medium, the commands you may enter can only be one-word long, with no spaces. "],e,null);console.codeInline(["However, two-word commands may be constructed on two separate lines. For example, if you wanted to examine the glove, you would first type ","examine ","to which the game would respond ","What is it you would like to examine? ","Then you would type the object of your intended action, ","glove",", to complete the command."],e,t);console.codeInline(["Alternately, you may enter both words on the same line, provided they are separated with a semicolon and no spaces, i.e ","examine;glove"],e,t),console.codeInline(this.introOptions(this.state.turn))},_commands:function(){const e=this.commands.map(e=>{const[t,o]=e;return o}),t={};e.forEach(e=>{const o=e.split(","),[n,s]=[o.shift(),o.join(", ")];t[n]=s}),console.table(t)}};window._=(e=>m.setPreference(e)),m.items=h(m),m.commands=[...u(m)],m.mapKey={...c(m)},m.bindInitialCommands();var p=m;window.onload=(()=>{return localStorage.getItem("ConsoleGame.prefMode")?(localStorage.removeItem("ConsoleGame.prefMode"),p._resume()):p.intro()});t.default=p}]);