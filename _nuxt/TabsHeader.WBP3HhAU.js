import{d as b,r as l,$ as v,b as s,c as a,F as g,ah as x,e as u,f as y,Z as I,n as k,t as T,p as S,i as $,Q as C,l as w}from"./entry.varwMfW1.js";const B=t=>(S("data-v-9b59cc28"),t=t(),$(),t),N={class:"tabs-header"},U=["onClick"],q=B(()=>u("span",{class:"tab"},null,-1)),F=[q],H=b({__name:"TabsHeader",props:{tabs:{type:Array,required:!0},activeTabIndex:{type:Number,required:!0}},emits:["update:activeTabIndex"],setup(t,{emit:h}){const p=t,f=h,n=l(),i=l(),o=e=>{e&&(i.value.style.insetInlineStart=`${e.offsetLeft}px`,i.value.style.width=`${e.clientWidth}px`)},m=(e,c)=>{f("update:activeTabIndex",c),C(()=>o(e.target))};return v(n,e=>{e&&setTimeout(()=>{o(n.value.children[p.activeTabIndex])},50)},{immediate:!0}),(e,c)=>(s(),a("div",N,[t.tabs?(s(),a("div",{key:0,ref_key:"tabsRef",ref:n,class:"tabs"},[(s(!0),a(g,null,x(t.tabs,({label:d},r)=>(s(),a("button",{key:`${r}${d}`,class:k([t.activeTabIndex===r?"active":"not-active"]),onClick:_=>m(_,r)},T(d),11,U))),128)),u("span",{ref_key:"highlightUnderline",ref:i,class:"highlight-underline"},F,512)],512)):y("",!0),I(e.$slots,"footer",{},void 0,!0)]))}}),R=w(H,[["__scopeId","data-v-9b59cc28"]]);export{R as default};
