(() => {
  const articles = [
    { slug:'static-requirements-fail', title:'Why static requirements fail', phase:'Diagnose', phaseNo:'01', reading:'4 min', pain:'Requirements become isolated sentences with no visible reason, owner or acceptance logic.', connection:'Link each requirement to a use case, process, responsible actor, evidence and accepted output.', move:'Keep the document as a contractual view, but manage the logic as connected objects.', scenario:'owner', query:'AIA / EIR requirement tracking', node:'AIA / EIR requirement tracking', improvement:'Add explicit requirement and acceptance-criterion nodes. Today, requirements are represented mainly as inputs and outputs, so the graph cannot yet distinguish a business requirement from its delivery evidence.' },
    { slug:'what-should-the-owner-order', title:'What should the client order?', phase:'Define', phaseNo:'02', reading:'4 min', pain:'Clients order “a BIM model” instead of the information needed for a specific decision or operational result.', connection:'Start above the use-case layer with business outcomes, decisions and measurable acceptance conditions.', move:'Select the outcome first, then derive the use case, information need, format, rule and delivery.', scenario:'owner', query:'BIM2FM asset handover', node:'BIM2FM asset handover', improvement:'Add business-outcome and decision nodes above use cases. This would make the graph answer not only “what is delivered?” but also “which owner decision does it support?”' },
    { slug:'why-start-with-use-cases', title:'Why start with use cases?', phase:'Define', phaseNo:'02', reading:'4 min', pain:'Teams copy complete requirement catalogues into projects without proving that every requested property has value.', connection:'Use cases provide the traceable reason for processes, data, tools, responsibilities and checks.', move:'Require every information item to reference at least one selected use case or compliance obligation.', scenario:'owner', query:'Lifecycle change impact analysis', node:'Lifecycle change impact analysis', improvement:'Add lifecycle phase, priority and project-applicability fields as first-class filters. This would turn the graph from a catalogue into a project-specific selection tool.' },
    { slug:'how-this-connects-to-ids', title:'How does this connect to IDS?', phase:'Specify & check', phaseNo:'03', reading:'5 min', pain:'IDS is treated as the starting point, so technically valid checks can encode requirements that were never justified.', connection:'Trace IDS specifications back through IFC entities and properties to an information need, process and use case.', move:'Define intent first; use IDS only to encode the selected, testable subset.', scenario:'ids', query:'BIM model quality check', node:'BIM model quality check', improvement:'Add property, classification, applicability and IDS-specification node types. The current evidence layer shows that checking exists, but not exactly what is checked or why.' },
    { slug:'who-is-responsible', title:'Who is responsible?', phase:'Organise', phaseNo:'04', reading:'4 min', pain:'Generic BIM titles hide who decides, produces, reviews, resolves and accepts each information output.', connection:'Derive responsibility from the process and distinguish decision ownership from production and validation.', move:'Build responsibility around actual deliverables and milestones, not a generic role list.', scenario:'roles', query:'Requirement management', node:'Requirement management', improvement:'Replace the single owner relation with explicit accountable, producer, reviewer, approver and recipient relations. This would support a usable RACI-style view without flattening responsibilities.' },
    { slug:'what-skills-are-missing', title:'What skills are missing?', phase:'Organise', phaseNo:'04', reading:'4 min', pain:'Software knowledge is mistaken for capability, while process, governance, integration and communication gaps remain invisible.', connection:'Connect selected use cases and processes to required capabilities, available people and evidence of competence.', move:'Ask which use case is unsupported and which capability closes the gap.', scenario:'roles', query:'Data standardization', node:'Data standardization', improvement:'Add skill and capability entities with required level, available level and gap status. Actors currently exist, but the graph cannot yet support recruitment or training decisions directly.' },
    { slug:'how-fm-benefits', title:'How does FM benefit?', phase:'Operate', phaseNo:'05', reading:'5 min', pain:'FM receives incomplete files at handover because operational processes were not used to define project information early enough.', connection:'Connect FM processes to asset types, identifiers, required properties, source systems, checks and CAFM outputs.', move:'Define operational readiness as a measurable process, not a final export.', scenario:'fm', query:'CAFM readiness check', node:'CAFM readiness check', improvement:'Add FM-process and asset-type mappings, including target CAFM fields and stable identifiers. The current FM scenario uses the same broad node types as the owner view and needs stronger operational focus.' },
    { slug:'the-full-vision', title:'What is the full vision?', phase:'Scale', phaseNo:'06', reading:'5 min', pain:'Separate documents, tables and diagrams create duplicated logic and conflicting versions of the same requirement system.', connection:'Use one structured source to generate stakeholder views, requirement packages, checking rules and handover plans.', move:'Treat the graph as a decision model and the tables and documents as generated views.', scenario:'owner', query:'Lifecycle change impact analysis', node:'Lifecycle change impact analysis', improvement:'Add saved scenarios, versioned relations and generated-output definitions. This is the step that turns a demonstrator into a reusable information-ordering engine.' }
  ];

  const parts = location.pathname.split('/').filter(Boolean);
  const knowledgeAt = parts.lastIndexOf('knowledge');
  const slug = knowledgeAt >= 0 ? (parts[knowledgeAt + 1] || '') : '';
  const currentIndex = articles.findIndex(item => item.slug === slug);
  const overview = currentIndex < 0;
  const root = overview ? '../' : '../../';
  const esc = value => String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
  const graphUrl = item => `${root}?${new URLSearchParams({scenario:item.scenario,q:item.query,mode:'cluster'})}#graph`;
  const button = (href,label,primary=false) => `<a class="series-button${primary?' primary':''}" href="${href}">${label}<span aria-hidden="true">→</span></a>`;

  document.querySelectorAll('h1,h2,.card h2,.next a').forEach(el => { el.textContent = el.textContent.replace('What should the Bauherr order?','What should the client order?'); });
  document.title = document.title.replace('What should the Bauherr order?','What should the client order?');

  function enhanceOverview(){
    document.body.classList.add('knowledge-overview');
    const hero=document.querySelector('.hero');
    const grid=document.querySelector('.grid');
    if(!hero||!grid)return;
    const lead=hero.querySelector('.lead');
    if(lead)lead.textContent='Eight connected arguments for replacing document-centred BIM requirements with a traceable decision model—from owner intent to operational use.';
    const actions=document.createElement('div');
    actions.className='series-actions';
    actions.innerHTML=button('./static-requirements-fail/','Start with the problem',true)+button(`${root}?scenario=owner&mode=cluster#graph`,'Explore the model');
    hero.append(actions);
    const thesis=document.createElement('section');
    thesis.className='series-thesis';
    thesis.innerHTML=`<div><span class="series-label">The recurring problem</span><h2>BIM projects rarely lack requirements. They lack connections.</h2><p>A document can state what is required, but it usually cannot show why it is needed, who must act, how it will be checked or which operational process depends on it.</p></div><div class="series-pain-grid"><article><span>01</span><strong>Purpose disappears</strong><p>Data requests become detached from decisions and use cases.</p></article><article><span>02</span><strong>Responsibility blurs</strong><p>Generic roles replace explicit process and acceptance ownership.</p></article><article><span>03</span><strong>Validation arrives late</strong><p>Checks and FM readiness are discovered near handover.</p></article></div>`;
    hero.after(thesis);
    const pathHeader=document.createElement('header');
    pathHeader.className='series-path-header';
    pathHeader.innerHTML='<div><span class="series-label">Suggested reading path</span><h2>Build the connected model in six moves.</h2></div><p>Read in sequence, or enter through the problem closest to your current project.</p>';
    grid.before(pathHeader);
    [...grid.querySelectorAll('.card')].forEach((card,index)=>{
      const item=articles[index]; if(!item)return;
      const num=card.querySelector('.num'); if(num)num.textContent=String(index+1).padStart(2,'0');
      const title=card.querySelector('h2'); if(title)title.textContent=item.title;
      const text=card.querySelector('p'); if(text)text.textContent=item.pain;
      const meta=document.createElement('div'); meta.className='series-card-meta'; meta.innerHTML=`<span>Phase ${item.phaseNo} · ${esc(item.phase)}</span><span>${item.reading}</span>`; card.prepend(meta);
      const answer=document.createElement('p'); answer.className='series-card-outcome'; answer.innerHTML=`<strong>Connected answer:</strong> ${esc(item.connection)}`; card.append(answer);
    });
    const model=document.createElement('section');
    model.className='series-model';
    model.innerHTML=`<div><span class="series-label">The IPM proposition</span><h2>One source. Several decision views.</h2><p>The graph should not be a larger diagram. It should be a structured source that can produce a client brief, responsibility view, IDS package, capability-gap analysis and FM handover plan.</p></div><div class="series-chain"><span>Outcome</span><i>→</i><span>Use case</span><i>→</i><span>Process</span><i>→</i><span>Information</span><i>→</i><span>Check</span><i>→</i><span>Operation</span></div><div class="series-actions">${button(`${root}?scenario=owner&mode=cluster#graph`,'Open the structured graph',true)}${button(`${root}tables/`,'Inspect the source tables')}</div>`;
    grid.after(model);
  }

  function enhanceArticle(item,index){
    document.body.classList.add('knowledge-article');
    document.documentElement.style.setProperty('--series-progress',`${((index+1)/articles.length)*100}%`);
    const hero=document.querySelector('.hero'); const content=document.querySelector('.content'); const side=document.querySelector('.side');
    if(!hero||!content)return;
    const h1=hero.querySelector('h1'); if(h1)h1.textContent=item.title;
    const crumb=document.createElement('div'); crumb.className='series-breadcrumb'; crumb.innerHTML=`<a href="../">Knowledge series</a><span>/</span><span>Post ${String(index+1).padStart(2,'0')} of 08</span>`; hero.prepend(crumb);
    const meta=document.createElement('div'); meta.className='series-article-meta'; meta.innerHTML=`<span>Phase ${item.phaseNo} · ${esc(item.phase)}</span><span>${item.reading} read</span><span>Post ${index+1} of 8</span>`; hero.append(meta);
    const actions=document.createElement('div'); actions.className='series-actions'; actions.innerHTML=button(graphUrl(item),'Open this graph context',true)+button('../','View all posts'); hero.append(actions);
    const summary=document.createElement('section'); summary.className='argument-summary'; summary.innerHTML=`<article><span>Pain point</span><p>${esc(item.pain)}</p></article><article><span>Graph connection</span><p>${esc(item.connection)}</p></article><article><span>Practical move</span><p>${esc(item.move)}</p></article>`; content.prepend(summary);
    content.querySelector('.flow')?.classList.add('series-flow');
    const improvement=document.createElement('section'); improvement.className='graph-improvement'; improvement.innerHTML=`<span class="series-label">What the graph should add next</span><h2>Make this relationship explicit in the data model.</h2><p>${esc(item.improvement)}</p><div class="graph-context"><div><small>Recommended scenario</small><strong>${item.scenario==='ids'?'IDS & checking':item.scenario==='roles'?'Roles & skills':item.scenario==='fm'?'BIM2FM':'Owner requirements'}</strong></div><div><small>Start node</small><strong>${esc(item.node)}</strong></div>${button(graphUrl(item),'Inspect in graph',true)}</div>`;
    const next=content.querySelector('.next'); next?next.before(improvement):content.append(improvement);
    if(side){
      const context=document.createElement('section'); context.className='side-graph-context'; context.innerHTML=`<span class="series-label">In the model</span><h3>${esc(item.node)}</h3><p>Open the relevant scenario and node filter directly.</p>${button(graphUrl(item),'Open context',true)}`; side.prepend(context);
      const nav=document.createElement('section'); nav.className='side-series-nav'; nav.innerHTML='<span class="series-label">Series</span>'+articles.map((entry,i)=>`<a href="../${entry.slug}/"${i===index?' aria-current="page"':''}><span>${String(i+1).padStart(2,'0')}</span>${esc(entry.title)}</a>`).join(''); side.append(nav);
    }
  }

  overview?enhanceOverview():enhanceArticle(articles[currentIndex],currentIndex);
})();
