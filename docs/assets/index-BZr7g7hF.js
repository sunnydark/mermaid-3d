(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))t(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const l of s.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&t(l)}).observe(document,{childList:!0,subtree:!0});function r(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function t(o){if(o.ep)return;o.ep=!0;const s=r(o);fetch(o.href,s)}})();const O="modulepreload",Y=function(e){return"/mermaid-3d/"+e},k={},$=function(i,r,t){let o=Promise.resolve();if(r&&r.length>0){let l=function(m){return Promise.all(m.map(u=>Promise.resolve(u).then(p=>({status:"fulfilled",value:p}),p=>({status:"rejected",reason:p}))))};document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),h=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));o=l(r.map(m=>{if(m=Y(m),m in k)return;k[m]=!0;const u=m.endsWith(".css"),p=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${m}"]${p}`))return;const n=document.createElement("link");if(n.rel=u?"stylesheet":O,u||(n.as="script"),n.crossOrigin="",n.href=m,h&&n.setAttribute("nonce",h),document.head.appendChild(n),u)return new Promise((f,d)=>{n.addEventListener("load",f),n.addEventListener("error",()=>d(new Error(`Unable to preload CSS for ${m}`)))})}))}function s(l){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=l,window.dispatchEvent(a),!a.defaultPrevented)throw l}return o.then(l=>{for(const a of l||[])a.status==="rejected"&&s(a.reason);return i().catch(s)})};let v={},C=null;async function I(){if(!C){const e=await $(()=>import("./mermaid.core-CFDHOQBH.js").then(i=>i.bB),[]);C=e.default||e,C.initialize({startOnLoad:!1,securityLevel:"loose",...v})}return C}let _=0;const w="http://www.w3.org/2000/svg",R=.707,q=-.5,N=.707,T=.5,P=`matrix(${R} ${q} ${N} ${T} 0 0)`;function X(e){var d;let i=e.querySelector("defs");i||(i=document.createElementNS(w,"defs"),e.insertBefore(i,e.firstChild));const r=document.createElementNS(w,"filter");r.setAttribute("id","mermaid3d-shadow"),r.setAttribute("x","-30%"),r.setAttribute("y","-30%"),r.setAttribute("width","180%"),r.setAttribute("height","180%");const t=document.createElementNS(w,"feOffset");t.setAttribute("in","SourceAlpha"),t.setAttribute("dx","6"),t.setAttribute("dy","8"),t.setAttribute("result","offsetAlpha"),r.appendChild(t);const o=document.createElementNS(w,"feGaussianBlur");o.setAttribute("in","offsetAlpha"),o.setAttribute("stdDeviation","5"),o.setAttribute("result","blurred"),r.appendChild(o);const s=document.createElementNS(w,"feFlood");s.setAttribute("flood-color","black"),s.setAttribute("flood-opacity","0.25"),s.setAttribute("result","color"),r.appendChild(s);const l=document.createElementNS(w,"feComposite");l.setAttribute("in","color"),l.setAttribute("in2","blurred"),l.setAttribute("operator","in"),l.setAttribute("result","shadow"),r.appendChild(l);const a=document.createElementNS(w,"feMerge"),h=document.createElementNS(w,"feMergeNode");h.setAttribute("in","shadow"),a.appendChild(h);const m=document.createElementNS(w,"feMergeNode");m.setAttribute("in","SourceGraphic"),a.appendChild(m),r.appendChild(a),i.appendChild(r);const u=[];e.querySelectorAll(".node").forEach(c=>u.push(c)),e.querySelectorAll("rect.actor").forEach(c=>{const y=c.closest("g[id]")||c.parentElement;y&&y.tagName==="g"&&!u.includes(y)&&u.push(y)}),e.querySelectorAll("rect.task").forEach(c=>u.push(c)),e.querySelectorAll("rect.journey-section").forEach(c=>u.push(c));const p=e.querySelector("path.pieCircle");((d=p==null?void 0:p.parentElement)==null?void 0:d.tagName)==="g"&&u.push(p.parentElement),e.querySelectorAll('rect[class*="task"]').forEach(c=>{u.includes(c)||u.push(c)});const n=e.querySelector("g.commit-bullets:not(:empty)");n&&u.push(n);const f=e.querySelector("g.commit-arrows");f&&u.push(f),e.querySelectorAll("line.branch").forEach(c=>u.push(c)),e.querySelectorAll(".branchLabel").forEach(c=>u.push(c)),e.querySelectorAll("rect.branchLabelBkg").forEach(c=>u.push(c)),e.querySelectorAll(".timeline-node").forEach(c=>u.push(c));for(const c of u)c.setAttribute("filter","url(#mermaid3d-shadow)")}function F(e){const i=document.createElementNS(w,"g");for(i.setAttribute("transform",P);e.firstChild;)i.appendChild(e.firstChild);e.appendChild(i);const r=i.getBBox(),t=[[r.x,r.y],[r.x+r.width,r.y],[r.x+r.width,r.y+r.height],[r.x,r.y+r.height]];let o=1/0,s=1/0,l=-1/0,a=-1/0;for(const[m,u]of t){const p=R*m+N*u,n=q*m+T*u;o=Math.min(o,p),s=Math.min(s,n),l=Math.max(l,p),a=Math.max(a,n)}const h=30;e.setAttribute("viewBox",`${o-h} ${s-h} ${l-o+2*h} ${a-s+2*h}`)}function H(e){const i=(e.getAttribute("viewBox")||"0 0 800 600").split(/[\s,]+/).map(Number);return{x:i[0],y:i[1],w:i[2],h:i[3]}}function z(e,i){const r=i.getBoundingClientRect();if(r.width===0||r.height===0)return e;const t=r.width/r.height,o=e.w/e.h;if(t>o){const s=e.h*t;return{x:e.x-(s-e.w)/2,y:e.y,w:s,h:e.h}}else{const s=e.w/t;return{x:e.x,y:e.y-(s-e.h)/2,w:e.w,h:s}}}function G(e,i){i.setAttribute("preserveAspectRatio","none");const r=H(i);let t=z(r,e),o=!1,s=0,l=0,a=0;function h(){i.setAttribute("viewBox",`${t.x} ${t.y} ${t.w} ${t.h}`)}h();function m(){a&&(cancelAnimationFrame(a),a=0)}function u(n,f=600){m();const d={...t},c=performance.now();function y(g){const A=Math.min((g-c)/f,1),b=1-Math.pow(1-A,3);t.x=d.x+(n.x-d.x)*b,t.y=d.y+(n.y-d.y)*b,t.w=d.w+(n.w-d.w)*b,t.h=d.h+(n.h-d.h)*b,h(),A<1?a=requestAnimationFrame(y):a=0}a=requestAnimationFrame(y)}e.addEventListener("wheel",n=>{n.preventDefault(),m();const f=n.deltaY>0?1.08:1/1.08,d=e.getBoundingClientRect(),c=(n.clientX-d.left)/d.width,y=(n.clientY-d.top)/d.height,g=t.w*f,A=t.h*f;t.x-=(g-t.w)*c,t.y-=(A-t.h)*y,t.w=g,t.h=A,h()},{passive:!1}),e.addEventListener("mousedown",n=>{(n.button===0||n.button===1)&&(m(),o=!0,s=n.clientX,l=n.clientY,e.style.cursor="grabbing",n.preventDefault())}),window.addEventListener("mousemove",n=>{if(!o)return;const f=n.clientX-s,d=n.clientY-l;s=n.clientX,l=n.clientY;const c=e.getBoundingClientRect();t.x-=f*(t.w/c.width),t.y-=d*(t.h/c.height),h()}),window.addEventListener("mouseup",()=>{o&&(o=!1,e.style.cursor="grab")}),e.addEventListener("dblclick",n=>{const f=n.target.closest(".node");if(!f)return;const d=f.getBoundingClientRect(),c=e.getBoundingClientRect(),y=t.x+(d.left+d.width/2-c.left)/c.width*t.w,g=t.y+(d.top+d.height/2-c.top)/c.height*t.h,A=d.width/c.width*t.w,b=d.height/c.height*t.h,S=Math.max(A,b)/.2,B=S*(c.height/c.width);u({x:y-S/2,y:g-B/2,w:S,h:B})});let p=0;e.addEventListener("touchstart",n=>{if(m(),n.touches.length===1)o=!0,s=n.touches[0].clientX,l=n.touches[0].clientY;else if(n.touches.length===2){o=!1;const f=n.touches[1].clientX-n.touches[0].clientX,d=n.touches[1].clientY-n.touches[0].clientY;p=Math.sqrt(f*f+d*d)}n.preventDefault()},{passive:!1}),e.addEventListener("touchmove",n=>{if(n.touches.length===1&&o){const f=n.touches[0].clientX-s,d=n.touches[0].clientY-l;s=n.touches[0].clientX,l=n.touches[0].clientY;const c=e.getBoundingClientRect();t.x-=f*(t.w/c.width),t.y-=d*(t.h/c.height),h()}else if(n.touches.length===2){const f=n.touches[1].clientX-n.touches[0].clientX,d=n.touches[1].clientY-n.touches[0].clientY,c=Math.sqrt(f*f+d*d),y=p/c,g=e.getBoundingClientRect(),A=((n.touches[0].clientX+n.touches[1].clientX)/2-g.left)/g.width,b=((n.touches[0].clientY+n.touches[1].clientY)/2-g.top)/g.height,L=t.w*y,S=t.h*y;t.x-=(L-t.w)*A,t.y-=(S-t.h)*b,t.w=L,t.h=S,p=c,h()}n.preventDefault()},{passive:!1}),e.addEventListener("touchend",()=>{o=!1}),e.style.cursor="grab"}const W=`
.mermaid-3d-container {
  overflow: hidden;
  position: relative;
}
.mermaid-3d-container svg {
  display: block;
  width: 100%;
  height: 100%;
}
`;function j(){if(document.getElementById("mermaid-3d-styles"))return;const e=document.createElement("style");e.id="mermaid-3d-styles",e.textContent=W,document.head.appendChild(e)}function J(e){const i=document.createElement("div");return i.id=e,i.className="mermaid-3d-container",i.style.position="absolute",i.style.inset="0",i}const E={initialize(e={}){v={...v,...e},C=null},async render(e,i,r){j();const t=await I(),o=`mermaid3d-render-${_++}`,{svg:s}=await t.render(o,i),l=J(e);l.innerHTML=s,r&&r.appendChild(l);const a=l.querySelector("svg");return a&&(a.removeAttribute("width"),a.removeAttribute("height"),a.style.maxWidth="none",v.shadows!==!1&&X(a),F(a),G(l,a)),{svg:s,element:l,bindFunctions:h=>{}}},async run(e){var t;const i=(e==null?void 0:e.querySelector)||"pre.mermaid, div.mermaid, .mermaid",r=e!=null&&e.nodes?Array.from(e.nodes):Array.from(document.querySelectorAll(i));for(let o=0;o<r.length;o++){const s=r[o],l=(t=s.textContent)==null?void 0:t.trim();if(!l)continue;const a=s.id||`mermaid-3d-${o}`;try{const h=await this.render(a,l),m=s.parentNode;m&&(h.element.id=a,m.replaceChild(h.element,s)),e!=null&&e.postRenderCallback&&e.postRenderCallback(a)}catch(h){e!=null&&e.suppressErrors||console.error(`mermaid-3d: Failed to render diagram ${a}:`,h)}}},async parse(e,i){const t=await(await I()).parse(e);return{diagramType:(t==null?void 0:t.diagramType)||"unknown"}},async registerExternalDiagrams(e){const i=await I();typeof i.registerExternalDiagrams=="function"&&await i.registerExternalDiagrams(e)},setParseErrorHandler(e){v.__parseErrorHandler=e},mermaidAPI:{initialize(e){E.initialize(e)},async render(e,i,r){return E.render(e,i,r)},async parse(e){return E.parse(e)}}},M={flowchart:`flowchart TD
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
        Sit down: 5: Me`};let D="default";E.initialize({theme:D,shadows:!0});async function x(){const e=document.getElementById("editor"),i=document.getElementById("diagram-container"),r=document.getElementById("error-banner"),t=e.value.trim();if(t){r.classList.remove("visible"),r.textContent="",i.innerHTML="";try{await E.render("demo-diagram",t,i)}catch(o){r.textContent=`Error: ${o.message||o}`,r.classList.add("visible"),console.error("Render error:",o)}}}document.getElementById("render-btn").addEventListener("click",x);document.getElementById("theme-select").addEventListener("change",e=>{D=e.target.value,E.initialize({theme:D,shadows:document.getElementById("shadows-toggle").checked}),x()});document.getElementById("shadows-toggle").addEventListener("change",e=>{E.initialize({theme:D,shadows:e.target.checked}),x()});document.querySelectorAll(".examples button").forEach(e=>{e.addEventListener("click",()=>{const i=e.dataset.example;M[i]&&(document.getElementById("editor").value=M[i],x())})});document.getElementById("editor").addEventListener("keydown",e=>{e.key==="Enter"&&(e.ctrlKey||e.metaKey)&&(e.preventDefault(),x())});x();export{$ as _};
