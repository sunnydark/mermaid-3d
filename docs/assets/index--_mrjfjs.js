(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))t(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const l of s.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&t(l)}).observe(document,{childList:!0,subtree:!0});function r(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function t(i){if(i.ep)return;i.ep=!0;const s=r(i);fetch(i.href,s)}})();const O="modulepreload",Y=function(e){return"/mermaid-3d/"+e},k={},$=function(o,r,t){let i=Promise.resolve();if(r&&r.length>0){let l=function(h){return Promise.all(h.map(u=>Promise.resolve(u).then(p=>({status:"fulfilled",value:p}),p=>({status:"rejected",reason:p}))))};document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),m=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));i=l(r.map(h=>{if(h=Y(h),h in k)return;k[h]=!0;const u=h.endsWith(".css"),p=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${h}"]${p}`))return;const n=document.createElement("link");if(n.rel=u?"stylesheet":O,u||(n.as="script"),n.crossOrigin="",n.href=h,m&&n.setAttribute("nonce",m),document.head.appendChild(n),u)return new Promise((f,d)=>{n.addEventListener("load",f),n.addEventListener("error",()=>d(new Error(`Unable to preload CSS for ${h}`)))})}))}function s(l){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=l,window.dispatchEvent(a),!a.defaultPrevented)throw l}return i.then(l=>{for(const a of l||[])a.status==="rejected"&&s(a.reason);return o().catch(s)})};let C={},x=null;async function I(){if(!x){if(typeof window<"u"&&window.mermaid)x=window.mermaid;else{const e=await $(()=>import("./mermaid.core-D2nU2nAr.js").then(o=>o.bB),[]);x=e.default||e}x.initialize({startOnLoad:!1,securityLevel:"loose",...C})}return x}let _=0;const w="http://www.w3.org/2000/svg",R=.707,q=-.5,N=.707,T=.5,P=`matrix(${R} ${q} ${N} ${T} 0 0)`;function X(e){var d;let o=e.querySelector("defs");o||(o=document.createElementNS(w,"defs"),e.insertBefore(o,e.firstChild));const r=document.createElementNS(w,"filter");r.setAttribute("id","mermaid3d-shadow"),r.setAttribute("x","-30%"),r.setAttribute("y","-30%"),r.setAttribute("width","180%"),r.setAttribute("height","180%");const t=document.createElementNS(w,"feOffset");t.setAttribute("in","SourceAlpha"),t.setAttribute("dx","6"),t.setAttribute("dy","8"),t.setAttribute("result","offsetAlpha"),r.appendChild(t);const i=document.createElementNS(w,"feGaussianBlur");i.setAttribute("in","offsetAlpha"),i.setAttribute("stdDeviation","5"),i.setAttribute("result","blurred"),r.appendChild(i);const s=document.createElementNS(w,"feFlood");s.setAttribute("flood-color","black"),s.setAttribute("flood-opacity","0.25"),s.setAttribute("result","color"),r.appendChild(s);const l=document.createElementNS(w,"feComposite");l.setAttribute("in","color"),l.setAttribute("in2","blurred"),l.setAttribute("operator","in"),l.setAttribute("result","shadow"),r.appendChild(l);const a=document.createElementNS(w,"feMerge"),m=document.createElementNS(w,"feMergeNode");m.setAttribute("in","shadow"),a.appendChild(m);const h=document.createElementNS(w,"feMergeNode");h.setAttribute("in","SourceGraphic"),a.appendChild(h),r.appendChild(a),o.appendChild(r);const u=[];e.querySelectorAll(".node").forEach(c=>u.push(c)),e.querySelectorAll("rect.actor").forEach(c=>{const y=c.closest("g[id]")||c.parentElement;y&&y.tagName==="g"&&!u.includes(y)&&u.push(y)}),e.querySelectorAll("rect.task").forEach(c=>u.push(c)),e.querySelectorAll("rect.journey-section").forEach(c=>u.push(c));const p=e.querySelector("path.pieCircle");((d=p==null?void 0:p.parentElement)==null?void 0:d.tagName)==="g"&&u.push(p.parentElement),e.querySelectorAll('rect[class*="task"]').forEach(c=>{u.includes(c)||u.push(c)});const n=e.querySelector("g.commit-bullets:not(:empty)");n&&u.push(n);const f=e.querySelector("g.commit-arrows");f&&u.push(f),e.querySelectorAll("line.branch").forEach(c=>u.push(c)),e.querySelectorAll(".branchLabel").forEach(c=>u.push(c)),e.querySelectorAll("rect.branchLabelBkg").forEach(c=>u.push(c)),e.querySelectorAll(".timeline-node").forEach(c=>u.push(c));for(const c of u)c.setAttribute("filter","url(#mermaid3d-shadow)")}function F(e){const o=document.createElementNS(w,"g");for(o.setAttribute("transform",P);e.firstChild;)o.appendChild(e.firstChild);e.appendChild(o);const r=o.getBBox(),t=[[r.x,r.y],[r.x+r.width,r.y],[r.x+r.width,r.y+r.height],[r.x,r.y+r.height]];let i=1/0,s=1/0,l=-1/0,a=-1/0;for(const[h,u]of t){const p=R*h+N*u,n=q*h+T*u;i=Math.min(i,p),s=Math.min(s,n),l=Math.max(l,p),a=Math.max(a,n)}const m=30;e.setAttribute("viewBox",`${i-m} ${s-m} ${l-i+2*m} ${a-s+2*m}`)}function z(e){const o=(e.getAttribute("viewBox")||"0 0 800 600").split(/[\s,]+/).map(Number);return{x:o[0],y:o[1],w:o[2],h:o[3]}}function H(e,o){const r=o.getBoundingClientRect();if(r.width===0||r.height===0)return e;const t=r.width/r.height,i=e.w/e.h;if(t>i){const s=e.h*t;return{x:e.x-(s-e.w)/2,y:e.y,w:s,h:e.h}}else{const s=e.w/t;return{x:e.x,y:e.y-(s-e.h)/2,w:e.w,h:s}}}function G(e,o){o.setAttribute("preserveAspectRatio","none");const r=z(o);let t=H(r,e),i=!1,s=0,l=0,a=0;function m(){o.setAttribute("viewBox",`${t.x} ${t.y} ${t.w} ${t.h}`)}m();function h(){a&&(cancelAnimationFrame(a),a=0)}function u(n,f=600){h();const d={...t},c=performance.now();function y(g){const A=Math.min((g-c)/f,1),b=1-Math.pow(1-A,3);t.x=d.x+(n.x-d.x)*b,t.y=d.y+(n.y-d.y)*b,t.w=d.w+(n.w-d.w)*b,t.h=d.h+(n.h-d.h)*b,m(),A<1?a=requestAnimationFrame(y):a=0}a=requestAnimationFrame(y)}e.addEventListener("wheel",n=>{n.preventDefault(),h();const f=n.deltaY>0?1.08:1/1.08,d=e.getBoundingClientRect(),c=(n.clientX-d.left)/d.width,y=(n.clientY-d.top)/d.height,g=t.w*f,A=t.h*f;t.x-=(g-t.w)*c,t.y-=(A-t.h)*y,t.w=g,t.h=A,m()},{passive:!1}),e.addEventListener("mousedown",n=>{(n.button===0||n.button===1)&&(h(),i=!0,s=n.clientX,l=n.clientY,e.style.cursor="grabbing",n.preventDefault())}),window.addEventListener("mousemove",n=>{if(!i)return;const f=n.clientX-s,d=n.clientY-l;s=n.clientX,l=n.clientY;const c=e.getBoundingClientRect();t.x-=f*(t.w/c.width),t.y-=d*(t.h/c.height),m()}),window.addEventListener("mouseup",()=>{i&&(i=!1,e.style.cursor="grab")}),e.addEventListener("dblclick",n=>{const f=n.target.closest(".node");if(!f)return;const d=f.getBoundingClientRect(),c=e.getBoundingClientRect(),y=t.x+(d.left+d.width/2-c.left)/c.width*t.w,g=t.y+(d.top+d.height/2-c.top)/c.height*t.h,A=d.width/c.width*t.w,b=d.height/c.height*t.h,S=Math.max(A,b)/.2,B=S*(c.height/c.width);u({x:y-S/2,y:g-B/2,w:S,h:B})});let p=0;e.addEventListener("touchstart",n=>{if(h(),n.touches.length===1)i=!0,s=n.touches[0].clientX,l=n.touches[0].clientY;else if(n.touches.length===2){i=!1;const f=n.touches[1].clientX-n.touches[0].clientX,d=n.touches[1].clientY-n.touches[0].clientY;p=Math.sqrt(f*f+d*d)}n.preventDefault()},{passive:!1}),e.addEventListener("touchmove",n=>{if(n.touches.length===1&&i){const f=n.touches[0].clientX-s,d=n.touches[0].clientY-l;s=n.touches[0].clientX,l=n.touches[0].clientY;const c=e.getBoundingClientRect();t.x-=f*(t.w/c.width),t.y-=d*(t.h/c.height),m()}else if(n.touches.length===2){const f=n.touches[1].clientX-n.touches[0].clientX,d=n.touches[1].clientY-n.touches[0].clientY,c=Math.sqrt(f*f+d*d),y=p/c,g=e.getBoundingClientRect(),A=((n.touches[0].clientX+n.touches[1].clientX)/2-g.left)/g.width,b=((n.touches[0].clientY+n.touches[1].clientY)/2-g.top)/g.height,L=t.w*y,S=t.h*y;t.x-=(L-t.w)*A,t.y-=(S-t.h)*b,t.w=L,t.h=S,p=c,m()}n.preventDefault()},{passive:!1}),e.addEventListener("touchend",()=>{i=!1}),e.style.cursor="grab"}const W=`
.mermaid-3d-container {
  overflow: hidden;
  position: relative;
}
.mermaid-3d-container svg {
  display: block;
  width: 100%;
  height: 100%;
}
`;function j(){if(document.getElementById("mermaid-3d-styles"))return;const e=document.createElement("style");e.id="mermaid-3d-styles",e.textContent=W,document.head.appendChild(e)}function J(e){const o=document.createElement("div");return o.id=e,o.className="mermaid-3d-container",o}const E={initialize(e={}){C={...C,...e},x=null},async render(e,o,r){j();const t=await I(),i=`mermaid3d-render-${_++}`,{svg:s}=await t.render(i,o),l=J(e);l.innerHTML=s,r&&r.appendChild(l);const a=l.querySelector("svg"),m=()=>{a&&(a.removeAttribute("width"),a.removeAttribute("height"),a.style.maxWidth="none",C.shadows!==!1&&X(a),F(a),G(l,a))};return r&&m(),{svg:s,element:l,bindFunctions:h=>{},finalize:m}},async run(e){var t;const o=(e==null?void 0:e.querySelector)||"pre.mermaid, div.mermaid, .mermaid",r=e!=null&&e.nodes?Array.from(e.nodes):Array.from(document.querySelectorAll(o));for(let i=0;i<r.length;i++){const s=r[i],l=(t=s.textContent)==null?void 0:t.trim();if(!l)continue;const a=s.id||`mermaid-3d-${i}`;try{const m=await this.render(a,l),h=s.parentNode;h&&(m.element.id=a,h.replaceChild(m.element,s),m.finalize()),e!=null&&e.postRenderCallback&&e.postRenderCallback(a)}catch(m){e!=null&&e.suppressErrors||console.error(`mermaid-3d: Failed to render diagram ${a}:`,m)}}},async parse(e,o){const t=await(await I()).parse(e);return{diagramType:(t==null?void 0:t.diagramType)||"unknown"}},async registerExternalDiagrams(e){const o=await I();typeof o.registerExternalDiagrams=="function"&&await o.registerExternalDiagrams(e)},setParseErrorHandler(e){C.__parseErrorHandler=e},mermaidAPI:{initialize(e){E.initialize(e)},async render(e,o,r){return E.render(e,o,r)},async parse(e){return E.parse(e)}}},M={flowchart:`flowchart TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[Deploy]
    E --> F((Done))`,sequence:`sequenceDiagram
    Alice->>John: Hello John
    John-->>Alice: Hi Alice
    Alice->>John: How are you?
    John-->>Alice: I'm good!`,class:`classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal : +int age
    Animal : +String gender
    Animal : +isMammal()
    Duck : +String beakColor
    Duck : +swim()
    Fish : +int sizeInFeet
    Fish : +canEat()`,state:`stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]`,er:`erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses`,gantt:`gantt
    title A Gantt Diagram
    section Section
        A task          :a1, 2024-01-01, 30d
        Another task    :after a1, 20d
    section Another
        Task in Another :2024-01-12, 12d
        another task    :24d`,pie:`pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15`,gitgraph:`gitGraph
    commit
    commit
    branch develop
    commit
    commit
    checkout main
    commit
    merge develop
    commit`,mindmap:`mindmap
    root((Central Idea))
        Topic A
            Subtopic 1
            Subtopic 2
        Topic B
            Subtopic 3
        Topic C`,timeline:`timeline
    title Timeline of Events
    2020 : Event A
         : Event B
    2021 : Event C
    2022 : Event D
         : Event E`,journey:`journey
    title My working day
    section Go to work
        Make tea: 5: Me
        Go upstairs: 3: Me
        Do work: 1: Me, Cat
    section Go home
        Go downstairs: 5: Me
        Sit down: 5: Me`};let D="default";E.initialize({theme:D,shadows:!0});async function v(){const e=document.getElementById("editor"),o=document.getElementById("diagram-container"),r=document.getElementById("error-banner"),t=e.value.trim();if(t){r.classList.remove("visible"),r.textContent="",o.innerHTML="";try{await E.render("demo-diagram",t,o)}catch(i){r.textContent=`Error: ${i.message||i}`,r.classList.add("visible"),console.error("Render error:",i)}}}document.getElementById("render-btn").addEventListener("click",v);document.getElementById("theme-select").addEventListener("change",e=>{D=e.target.value,E.initialize({theme:D,shadows:document.getElementById("shadows-toggle").checked}),v()});document.getElementById("shadows-toggle").addEventListener("change",e=>{E.initialize({theme:D,shadows:e.target.checked}),v()});document.querySelectorAll(".examples button").forEach(e=>{e.addEventListener("click",()=>{const o=e.dataset.example;M[o]&&(document.getElementById("editor").value=M[o],v())})});document.getElementById("editor").addEventListener("keydown",e=>{e.key==="Enter"&&(e.ctrlKey||e.metaKey)&&(e.preventDefault(),v())});v();export{$ as _};
