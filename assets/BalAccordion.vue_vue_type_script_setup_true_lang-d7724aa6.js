import{ao as F,bB as N}from"./BalBtn-a3a093af.js";import{d as O,r as a,o as A,n as _,p as b,b as s,x as i,h as C,l as K,F as j,i as z,e as w,B as p,y as I,A as L,D as h,f as S}from"./runtime-core.esm-bundler-24a2b16f.js";const M=["onClick"],P=["onClick"],q=O({__name:"BalAccordion",props:{sections:null,dependencies:null,showSectionBorder:{type:Boolean,default:!0},reCalcKey:{default:0},isOpenedByDefault:{type:Boolean,default:!1}},setup(u){const f=u,l=a(""),d=a(),B=a(),m=a(),y=a(),k=a([]),E=a(0),n=a(!1),H=a(),x=a(0),g=a(0);async function v(e,r=!0){const o=f.sections.find(t=>t.id===e);if(o!=null&&o.isDisabled)return;l.value===e&&r?(l.value="",n.value=!1):(l.value=e,n.value=!0),await _(),d.value&&B.value&&(H.value=d.value.clientHeight,n.value=!1),n.value=!0}A(async()=>{var e,r,o,c;n.value=!0,E.value=((e=m.value)==null?void 0:e.offsetHeight)||0,x.value=((r=y.value)==null?void 0:r.offsetHeight)||0,g.value=((o=m.value)==null?void 0:o.offsetHeight)||0;for(const t of f.sections)l.value=t.id,await _(),g.value=g.value+(((c=d.value)==null?void 0:c.offsetHeight)||0);l.value="",n.value=!1});function D(e){var r;e&&((r=k.value)!=null&&r.includes(e)||k.value.push(e))}return b(()=>f.dependencies,()=>{v(l.value,!1)}),b(()=>f.reCalcKey,e=>{e&&l.value&&v(l.value,!1)}),(e,r)=>{const o=F,c=N;return s(),i("div",{ref_key:"wrapperElement",ref:m},[C(c,{hFull:"",noPad:"",shadow:"none",class:"overflow-visible rounded-xl"},{default:K(()=>[(s(!0),i(j,null,z(u.sections,(t,$)=>(s(),i("div",{key:t.id,ref_for:!0,ref:D,class:"flex flex-col"},[t.handle?(s(),i("div",{key:0,ref_for:!0,ref_key:"handleBarElement",ref:y,onClick:V=>v(t.id)},[w(e.$slots,t.handle)],8,M)):(s(),i("button",{key:1,ref_for:!0,ref_key:"handleBarElement",ref:y,class:p(["transition-all w-full flex justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl",{"border-b dark:border-gray-900":$!==u.sections.length-1}]),onClick:V=>v(t.id)},[I("h6",null,L(t.title),1),C(o,{class:p(["text-blue-400",[h(l)===t.id?"-rotate-180":"rotate-0","transform transition-all"]]),name:"chevron-down"},null,8,["class"])],10,P)),h(l)===t.id||u.isOpenedByDefault?(s(),i("div",{key:2,ref_for:!0,ref_key:"accordionHeightSetterElement",ref:B,class:"relative"},[h(n)||u.isOpenedByDefault?(s(),i("div",{key:0,ref_for:!0,ref_key:"activeSectionElement",ref:d,class:p({"border-b dark:border-gray-900 active-section rounded-b":h(n)&&u.showSectionBorder})},[w(e.$slots,t.id)],2)):S("",!0)],512)):S("",!0)]))),128))]),_:3})],512)}}});export{q as _};
//# sourceMappingURL=BalAccordion.vue_vue_type_script_setup_true_lang-d7724aa6.js.map
