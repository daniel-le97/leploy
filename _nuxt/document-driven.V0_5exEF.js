import k from"./DocumentDrivenEmpty.UdcOUbSV.js";import P from"./ContentRenderer.Ht30JPe4.js";import b from"./DocumentDrivenNotFound.EfDE_qeJ.js";import{k as L,d,G as g,P as R,v as x,H as C,I as S,J as u,K as m,r as B,u as N,L as T,M as j,N as p,T as E,O as H,Q as O,S as A,R as w,U as D,m as $,V as q,W as I,b as f,c as M,g as y,w as _,X as v}from"./entry.varwMfW1.js";import"./ContentRendererMarkdown.vue.VNkq6HhK.js";import"./ButtonLink.syQ5DKC-.js";import"./slot.qxrLqykP.js";import"./node.V6KjywBy.js";const V=d({name:"LayoutLoader",inheritAttrs:!1,props:{name:String,layoutProps:Object},async setup(t,n){const e=await m[t.name]().then(o=>o.default||o);return()=>p(e,t.layoutProps,n.slots)}}),F=d({name:"NuxtLayout",inheritAttrs:!1,props:{name:{type:[String,Boolean,Object],default:null},fallback:{type:[String,Object],default:null}},setup(t,n){const e=L(),o=g(R),s=o===x()?C():o,r=S(()=>{let a=u(t.name)??s.meta.layout??"default";return a&&!(a in m)&&t.fallback&&(a=u(t.fallback)),a}),i=B();n.expose({layoutRef:i});const l=e.deferHydration();if(e.isHydrating){const a=e.hooks.hookOnce("app:error",l);N().beforeEach(a)}return()=>{const a=r.value&&r.value in m,c=s.meta.layoutTransition??T;return j(E,a&&c,{default:()=>p(A,{suspensible:!0,onResolve:()=>{O(l)}},{default:()=>p(G,{layoutProps:H(n.attrs,{ref:i}),key:r.value||void 0,name:r.value,shouldProvide:!t.name,hasTransition:!!c},n.slots)})}).default()}}}),G=d({name:"NuxtLayoutProvider",inheritAttrs:!1,props:{name:{type:[String,Boolean]},layoutProps:{type:Object},hasTransition:{type:Boolean},shouldProvide:{type:Boolean}},setup(t,n){const e=t.name;return t.shouldProvide&&w(D,{isCurrent:o=>e===(o.meta.layout??"default")}),()=>{var o,s;return!e||typeof e=="string"&&!(e in m)?(s=(o=n.slots).default)==null?void 0:s.call(o):p(V,{key:e,layoutProps:t.layoutProps,name:e},n.slots)}}}),J={class:"document-driven-page"},ee=d({__name:"document-driven",setup(t){const{contentHead:n}=$().public.content,{page:e,layout:o}=q();return e.value,n&&I(e),(s,r)=>{const i=k,l=P,a=b,c=F;return f(),M("div",J,[y(c,{name:u(o)||"default"},{default:_(()=>[u(e)?(f(),v(l,{key:u(e)._id,value:u(e)},{empty:_(({value:h})=>[y(i,{value:h},null,8,["value"])]),_:1},8,["value"])):(f(),v(a,{key:1}))]),_:1},8,["name"])])}}});export{ee as default};
