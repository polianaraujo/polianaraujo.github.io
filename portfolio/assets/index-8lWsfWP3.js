(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function i(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(e){if(e.ep)return;e.ep=!0;const r=i(e);fetch(e.href,r)}})();const p="https://api.github.com/graphql",h=void 0,u=10,g=`
query GetRepositories($first: Int, $after: String, $last: Int, $before: String) {
    viewer {
        login
        repositories(
            first: $first,
            after: $after,
            last: $last,
            before: $before,
            orderBy: { field: UPDATED_AT, direction: DESC }
        ) {
            nodes {
                id 
                name
                url
                description
            }
            pageInfo {
                endCursor
                hasNextPage
                hasPreviousPage
                startCursor
            }
            totalCount
        }
    }
}`,a=document.querySelector("#prev-button"),c=document.querySelector("#next-button"),l=document.querySelector("#feedback"),b=t=>{if(t.data&&t.data.viewer&&t.data.viewer.repositories){const o=t.data.viewer.repositories.nodes,i=t.data.viewer.login,n=t.data.viewer.repositories.totalCount;let e=`<h3>Exibindo ${o.length} de ${n} repositórios de ${i}:</h3><ul>`;o.length>0?o.forEach(r=>{e+=`<li>
                    <strong><a href="${r.url}" target="_blank">${r.name}</a></strong>
                    ${r.description?`<p>${r.description}</p>`:""}
                </li>`}):e+="<li>Nenhum repositório encontrado.</li>",e+="</ul>",l.innerHTML=e}else l.innerHTML="Não foi possível buscar os repositórios, mas a conexão foi bem-sucedida.",console.log("Resposta da API:",t)},d=async({first:t=u,after:o=null,last:i=null,before:n=null})=>{l.innerHTML="<p>Carregando...</p>",a.disabled=!0,c.disabled=!0;try{const e=await fetch(p,{method:"POST",headers:{Authorization:`bearer ${h}`,"Content-Type":"application/json"},body:JSON.stringify({query:g,variables:{first:t,after:o,last:i,before:n}})});if(!e.ok){const f=await e.json();throw console.error("Erro da API:",f),new Error(`Response status: ${e.status}`)}const r=await e.json();if(r.errors)throw console.error("Erros do GraphQL:",r.errors),new Error("A API GraphQL retornou erros.");b(r);const s=r.data.viewer.repositories.pageInfo;c.disabled=!s.hasNextPage,a.disabled=!s.hasPreviousPage,c.dataset.cursor=s.endCursor,a.dataset.cursor=s.startCursor}catch(e){l.innerHTML="Erro ao conectar à API GraphQL do Github ou ao buscar repositórios.",console.error(e)}};c.addEventListener("click",()=>{d({first:u,after:c.dataset.cursor})});a.addEventListener("click",()=>{d({first:null,last:u,before:a.dataset.cursor})});d({first:u});
