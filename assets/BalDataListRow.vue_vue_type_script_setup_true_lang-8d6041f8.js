import{_ as T}from"./BalLink-6d436d10.js";import{aq as A,ax as N,aZ as S,bN as R,aY as I,ao as Q}from"./BalBtn-a3a093af.js";import{_ as V}from"./BalLoadingBlock.vue_vue_type_style_index_0_lang-24e44890.js";import{w as Y}from"./useTransactions-19512b92.js";import{d as u,q as d,v as j,D as i,b as s,c as y,x as p,y as o,h as m,A as n,l as k,E as c,I as q,e as _}from"./runtime-core.esm-bundler-24a2b16f.js";const F={key:1,class:"flex justify-between items-center text-sm text-gray-400 dark:text-gray-600"},H={class:"flex items-center"},z={class:"ml-2"},ee=u({__name:"ConfirmationIndicator",props:{txReceipt:null},setup(e){const t=e,{getTxConfirmedAt:l}=Y(),{explorerLinks:b}=A(),{networkConfig:$}=N(),L=d(()=>{var a;return!!((a=r.value)!=null&&a.transactionHash)}),r=d(()=>t.txReceipt),{data:f,isLoading:B,error:C}=S(I.Transaction.ConfirmationDate(r),async()=>{const a=await l(r.value),x=b.txLink(r.value.transactionHash);return{confirmedAt:R(a),explorerLink:x}},j({enabled:L})),D=d(()=>B.value||!!C.value);return(a,x)=>{var g,v;const w=V,h=Q,E=T;return i(D)?(s(),y(w,{key:0,class:"h-6"})):(s(),p("div",F,[o("div",H,[m(h,{name:"clock"}),o("span",z,n((g=i(f))==null?void 0:g.confirmedAt),1)]),m(E,{href:(v=i(f))==null?void 0:v.explorerLink,external:"",noStyle:"",class:"group flex items-center"},{default:k(()=>[c(n(i($).explorerName)+" ",1),m(h,{name:"arrow-up-right",size:"sm",class:"ml-px group-hover:text-pink-500 transition-colors"})]),_:1},8,["href"])]))}}}),K={class:"mt-4 rounded-lg border dark:border-gray-700 divide-y dark:divide-gray-700"},U={class:"flex flex-col py-2"},te=u({__name:"BalDataList",props:{title:{default:"Summary"},hTag:{default:"h6"}},setup(e){return(t,l)=>(s(),p("div",K,[(s(),y(q(e.hTag),{class:"p-2"},{default:k(()=>[c(n(e.title),1)]),_:1})),o("div",U,[_(t.$slots,"default")])]))}}),W={class:"grid grid-cols-2 py-1 px-2"},Z={class:"flex items-center"},G={class:"flex justify-end items-center"},ae=u({__name:"BalDataListRow",props:{label:null,value:null},setup(e){return(t,l)=>(s(),p("div",W,[o("div",Z,[_(t.$slots,"label",{},()=>[c(n(e.label),1)])]),o("div",G,[_(t.$slots,"value",{},()=>[c(n(e.value),1)])])]))}});export{ae as _,te as a,ee as b};
//# sourceMappingURL=BalDataListRow.vue_vue_type_script_setup_true_lang-8d6041f8.js.map
