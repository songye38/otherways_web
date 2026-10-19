import { useEffect, useId, useRef, useState } from 'react';
// ToolkitLab / ToolkitWorkspace가 읽는 것과 같은 데이터 파일입니다.
import { labToolkits } from '../IndexPages/10MinToolkit/toolkit-lab-data.js';
import { STORAGE_KEY, isEditableList, readDraft, makeDraft } from './editor-draft.js';
import { cleanToolkits, parseToolkitFile, serializeToolkits, validateToolkits } from './editor-files.js';
import './ToolkitEditor.css';

const types = {text:'한 줄 입력',textarea:'여러 줄 입력',singleSelect:'하나 선택',multiSelect:'여러 개 선택',list:'반복 입력칸'};
const colors = {pink:'#f0bfd4',green:'#dde5b5',yellow:'#f4dc8f',blue:'#cddfea',peach:'#f0c9ad',cream:'#ece7d9'};
function resolveColor(value) {
  return /^#[0-9a-f]{6}$/i.test(value || '')
    ? value
    : colors[value] || colors.pink;
}

const clone = value => JSON.parse(JSON.stringify(value));
const makeId = prefix => `${prefix}-${Math.random().toString(36).slice(2,9)}`;
function Field({label, value, onChange, multiline=false, type='text', hint}) {
  const id = useId();
  return <div className="ed-field"><label htmlFor={id}>{label}</label>{multiline?<textarea id={id} value={value??''} rows={3} onChange={e=>onChange(e.target.value)}/>:<input id={id} type={type} min={type==='number'?0:undefined} value={value??''} onChange={e=>onChange(type==='number'?Number(e.target.value):e.target.value)}/>} {hint&&<small>{hint}</small>}</div>;
}
function PreviewField({q, answer, setAnswer}) {
  const id=useId();
  if(q.type==='list') return <fieldset className="pv-fieldset"><legend>{q.label||'질문 제목'}{!q.required&&<small>선택</small>}</legend>{Array.from({length:Math.max(1,Math.min(20,q.itemCount||3))},(_,i)=><div className="pv-list" key={i}><span>{i+1}.</span><input aria-label={`${q.label} ${i+1}번`} value={Array.isArray(answer)?answer[i]||'':''} placeholder={q.placeholder||'생각을 적어보세요.'} onChange={e=>{const next=Array.isArray(answer)?[...answer]:[];next[i]=e.target.value;setAnswer(next);}}/></div>)}</fieldset>;
  if(q.type==='singleSelect'||q.type==='multiSelect')return <fieldset className="pv-fieldset"><legend>{q.label||'질문 제목'}{!q.required&&<small>선택</small>}</legend><div className="pv-chips">{(q.options||[]).filter(x=>x.trim()).map((opt,i)=><button key={i} type="button" aria-pressed={q.type==='multiSelect'?Array.isArray(answer)&&answer.includes(opt):answer===opt} onClick={()=>setAnswer(q.type==='multiSelect'?(Array.isArray(answer)&&answer.includes(opt)?answer.filter(x=>x!==opt):[...(Array.isArray(answer)?answer:[]),opt]):opt)}>{opt}</button>)}</div>{q.type==='singleSelect'&&q.allowCustom&&<input aria-label={`${q.label} 직접 입력`} value={typeof answer==='string'?answer:''} placeholder="선택하거나 직접 적어보세요." onChange={e=>setAnswer(e.target.value)}/>}</fieldset>;
  return <div className="pv-field"><label htmlFor={id}>{q.label||'질문 제목'}{!q.required&&<small>선택</small>}</label>{q.type==='textarea'?<textarea id={id} rows={3} placeholder={q.placeholder||''} value={typeof answer==='string'?answer:''} onChange={e=>setAnswer(e.target.value)}/>:<input id={id} placeholder={q.placeholder||''} value={typeof answer==='string'?answer:''} onChange={e=>setAnswer(e.target.value)}/>}</div>;
}
function LivePreview({item}) {
  const [answers,setAnswers]=useState({});
  const [paper,setPaper]=useState(false);
  return <div className="ed-preview"><div className="ed-preview-bar"><span><i/>실시간 미리보기</span><div><button type="button" aria-pressed={!paper} onClick={()=>setPaper(false)}>웹</button><button type="button" aria-pressed={paper} onClick={()=>setPaper(true)}>종이</button></div></div><div className="pv-page"><p className="pv-eyebrow">OTHER WAYS / EXPERIMENT {item.number}</p><h2>{item.title.replaceAll('\n',' ')||'툴킷 제목'}</h2><p className="pv-description">{item.description}</p><div className="pv-meta"><span>{item.category}</span><span>{item.durationMinutes}분</span></div><div className="pv-question" style={{background:resolveColor(item.color)}}><small>START WITH A QUESTION</small><p>{item.question||'핵심 질문을 적어보세요.'}</p></div>{item.steps.map((step,i)=><section className="pv-step" key={step.id}><div className="pv-step-top"><span>{String(i+1).padStart(2,'0')} / EXPERIMENT</span><span>{step.durationMinutes} MIN</span></div><h3>{step.title||'단계 제목'}</h3>{step.description&&<p>{step.description}</p>}{step.questions.map(q=>paper?<div className="pv-paper-field" key={q.id}><strong>{q.label||'질문 제목'}</strong><div/></div>:<PreviewField key={q.id} q={q} answer={answers[`${step.id}/${q.id}`]} setAnswer={value=>setAnswers(current=>({...current,[`${step.id}/${q.id}`]:value}))}/>)}</section>)}<p className="pv-foot">미리보기에서 작성한 답변은 데이터 파일에 포함되지 않습니다.</p></div></div>;
}
export default function ToolkitEditor() {
  // 주소를 아는 것만으로 공개 편집기에 접근하는 일을 막기 위해 개발 환경에서만 표시합니다.
  if (!import.meta.env.DEV) {
    return <p>이 편집기는 로컬 개발 환경에서만 사용할 수 있습니다.</p>;
  }
  if (!isEditableList(labToolkits)) {
    return <div className="editor-app"><p>데이터 형식을 확인해 주세요. steps 안에 단계 객체와 questions 배열이 필요합니다.</p></div>;
  }
  return <ToolkitEditorApp key={JSON.stringify(labToolkits)} source={labToolkits} />;
}

export function ToolkitEditorApp({ source }) {
  const sourceFingerprint = JSON.stringify(source);
  const [items,setItems]=useState(() => clone(source));
  const [savedDraft,setSavedDraft]=useState(() => {
    try { return readDraft(window.localStorage); } catch { return null; }
  });
  const [draftReady,setDraftReady]=useState(false);
  const [pendingSource,setPendingSource]=useState(false);
  const [selected,setSelected]=useState(0);
  const [tab,setTab]=useState('questions');
  const [mobilePane,setMobilePane]=useState('edit');
  const [search,setSearch]=useState('');
  const [notice,setNotice]=useState(`프로젝트 데이터 파일의 전체 툴킷 ${source.length}개를 불러왔습니다. 수정 내용은 내보내기 전까지 원본 파일에 반영되지 않습니다.`);
  const [draftStatus,setDraftStatus]=useState('프로젝트 원본에서 시작');
  const [pendingImport,setPendingImport]=useState(null);
  const [pendingDelete,setPendingDelete]=useState(false);
  const fileRef=useRef(null);
  const current=items[selected]||items[0];
  const errors=validateToolkits(cleanToolkits(items));
  useEffect(() => {
    if (!savedDraft) setDraftReady(true);
  }, [savedDraft]);
  useEffect(()=>{
    if (!draftReady) return;
    const timeout=setTimeout(()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(makeDraft(items,sourceFingerprint)));setDraftStatus('이 브라우저에 임시 저장됨');}catch{setDraftStatus('임시 저장 불가 · 파일로 내보내 주세요');}},400);
    return()=>clearTimeout(timeout);
  },[items,draftReady,sourceFingerprint]);
  function useProjectSource() {
    setItems(clone(source)); setSelected(0); setPendingSource(false);
    setSavedDraft(null); setDraftReady(true);
    setNotice(`프로젝트 원본 ${source.length}개로 편집을 시작합니다. 파일 자체는 변경되지 않았습니다.`);
  }
  function restoreSavedDraft() {
    if (!savedDraft) return;
    setItems(clone(savedDraft.items)); setSelected(0);
    setSavedDraft(null); setDraftReady(true);
    setNotice('브라우저 임시 저장본을 복원했습니다. 원본 파일과 비교한 뒤 내보내세요.');
  }
  function backupSavedDraft() {
    if (!savedDraft) return;
    const url=URL.createObjectURL(new Blob([JSON.stringify(savedDraft.items,null,2)],{type:'application/json;charset=utf-8'}));
    const a=document.createElement('a'); a.href=url; a.download='toolkit-previous-draft.json'; a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function update(fn){setItems(current=>fn(clone(current)));setDraftStatus('임시 저장 중…');}
  function patch(values){update(list=>{Object.assign(list[selected],values);return list;});}
  function patchStep(index,values){update(list=>{Object.assign(list[selected].steps[index],values);return list;});}
  function patchQuestion(si,qi,values){update(list=>{Object.assign(list[selected].steps[si].questions[qi],values);return list;});}
  function moveStep(index,direction){update(list=>{const steps=list[selected].steps;const next=index+direction;if(next>=0&&next<steps.length)[steps[index],steps[next]]=[steps[next],steps[index]];return list;});}
  function moveQuestion(si,qi,direction){update(list=>{const q=list[selected].steps[si].questions;const next=qi+direction;if(next>=0&&next<q.length)[q[qi],q[next]]=[q[next],q[qi]];return list;});}
  function addToolkit(){
    if (savedDraft) { setNotice('먼저 이전 편집 복원 또는 프로젝트 원본으로 시작을 선택해 주세요.'); return; }
    const next=Math.max(0,...items.map(x=>Number((x.id||'').replace('exp-',''))||0))+1;
    const item={id:`exp-${String(next).padStart(3,'0')}`,number:String(next).padStart(2,'0'),category:'Question',color:'pink',mark:'↗',title:'새로운 실험',description:'',question:'',outcome:'',durationMinutes:10,materials:[],pdfUrl:'',relatedArchiveIds:[],steps:[{id:makeId('step'),title:'첫 번째 단계',description:'',durationMinutes:10,questions:[{id:makeId('q'),label:'새로운 질문',type:'text',required:true}]}]};
    setItems(current=>[...current,item]);setSelected(items.length);setTab('basic');setMobilePane('edit');setNotice('새 툴킷을 추가했습니다. 제목과 질문을 작성해 보세요.');
  }
  async function importFile(event){
    if (savedDraft) { event.target.value=''; setNotice('먼저 임시 저장본 처리 방법을 선택해 주세요.'); return; }
    const file=event.target.files?.[0];event.target.value='';if(!file)return;
    if(file.size>2*1024*1024){setNotice('2MB 이하의 데이터 파일을 선택해 주세요.');return;}
    try{const parsed=parseToolkitFile(await file.text());if(!parsed.length)throw new Error('툴킷이 하나 이상 들어 있는 파일을 선택해 주세요.');setPendingImport(parsed);setNotice(`${parsed.length}개 툴킷을 확인했습니다. 불러오기 확인 시 현재 목록 전체가 교체됩니다.`);}catch(error){setNotice(`불러오기 실패: ${error.message}. JSON 또는 이 편집기에서 내보낸 JS 파일을 사용해 주세요.`);}
  }
  function download(format){try{const content=serializeToolkits(items,format);const blob=new Blob([content],{type:format==='json'?'application/json;charset=utf-8':'text/javascript;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=format==='json'?'toolkit-backup.json':'toolkit-lab-data.js';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setNotice(format==='json'?'백업 JSON 내보내기를 실행했습니다.':'JS 데이터 내보내기를 실행했습니다. 프로젝트의 데이터 파일과 교체한 뒤 배포해 주세요.');}catch(error){setNotice(`내보내기 전에 확인해 주세요: ${error.message}`);}}
  return <div className="editor-app"><header className="ed-topbar"><a className="ed-brand" href="#" onClick={e=>e.preventDefault()}>OTHER WAYS<span>TOOLKIT EDITOR</span></a><div className="ed-top-actions"><span className="ed-save-status"><i/>{draftStatus}</span><input ref={fileRef} type="file" accept=".json,.js" hidden onChange={importFile}/><button type="button" className="ed-button" onClick={()=>setPendingSource(true)}>프로젝트 원본 다시 보기</button><button type="button" className="ed-button" onClick={()=>fileRef.current.click()}>파일 불러오기 ↑</button><button type="button" className="ed-button" onClick={()=>download('json')}>JSON 백업</button><button type="button" className="ed-button primary" onClick={()=>download('js')}>데이터 내보내기 ↗</button></div></header>
    <div className="ed-demo-banner"><span>LOCAL EDITOR / PROJECT DATA</span>이 화면은 실제 사이트를 발행하지 않습니다. 내보낸 파일을 프로젝트에 넣어 반영합니다.</div>
    <div className="ed-shell"><aside className="ed-sidebar"><div className="ed-side-heading"><h1>나의 툴킷<span>{String(items.length).padStart(2,'0')}</span></h1><button type="button" onClick={addToolkit} aria-label="새 툴킷 추가">＋</button></div><label className="ed-search"><span className="ed-sr">툴킷 검색</span><input placeholder="툴킷 찾기" value={search} onChange={e=>setSearch(e.target.value)}/></label><div className="ed-toolkit-list">{items.map((item,index)=>({item,index})).filter(({item})=>`${item.title} ${item.id}`.toLowerCase().includes(search.toLowerCase())).map(({item,index})=><button type="button" key={index} className={index===selected?'selected':''} onClick={()=>{setSelected(index);setPendingDelete(false);}}><span className="ed-color-mark" style={{background:resolveColor(item.color)}}>{item.mark}</span><span><small>{item.id} · {item.category}</small><strong>{item.title.replaceAll('\n',' ')}</strong><em>{item.steps.length}단계 · {item.steps.reduce((n,s)=>n+s.questions.length,0)}개 질문</em></span></button>)}</div><button type="button" className="ed-add-toolkit" onClick={addToolkit}>＋ 새 툴킷 만들기</button><div className="ed-sidebar-tip"><span>WRITE → PREVIEW → EXPORT</span><p>코드 대신 질문에 집중하세요.<br/>완성된 파일은 기존 사이트에<br/>그대로 가져갈 수 있어요.</p></div></aside>
    <div className="ed-main"><div className="ed-page-heading"><div><p>EDITING / {current?.id || 'NEW COLLECTION'}</p><h2>{current ? current.title.replaceAll('\n',' ') : '첫 툴킷을 추가해 보세요'}</h2></div><span className="ed-status-tag">편집 중</span></div><div className="ed-mobile-switch"><button type="button" aria-pressed={mobilePane==='edit'} onClick={()=>setMobilePane('edit')}>내용 편집</button><button type="button" aria-pressed={mobilePane==='preview'} onClick={()=>setMobilePane('preview')}>미리보기</button></div>
    <div className="ed-notice" role="status" aria-live="polite">{notice}</div>
    {savedDraft && <div className="ed-confirm"><p>{savedDraft.sourceFingerprint === sourceFingerprint ? '이 브라우저에 이전 편집 내용이 있습니다.' : '프로젝트 원본과 임시 저장본의 기준 데이터가 다릅니다. 자동으로 섞지 않고 선택한 목록을 사용합니다.'} 현재 화면에는 프로젝트 원본을 표시하고 있습니다.</p><button type="button" onClick={restoreSavedDraft}>이전 편집 복원</button><button type="button" onClick={backupSavedDraft}>이전 편집 JSON 백업</button><button type="button" onClick={useProjectSource}>프로젝트 원본으로 시작</button></div>}
    {pendingSource && <div className="ed-confirm"><p>현재 편집 목록을 프로젝트 원본으로 바꿀까요? 수정 중인 내용이 필요하면 먼저 JSON 백업을 받으세요.</p><button type="button" onClick={useProjectSource}>원본으로 되돌리기</button><button type="button" onClick={()=>setPendingSource(false)}>취소</button></div>}
    {pendingImport&&<div className="ed-confirm"><p>현재 목록을 불러온 {pendingImport.length}개 툴킷으로 교체할까요? 필요하면 먼저 JSON 백업을 내려받으세요.</p><button type="button" onClick={()=>{setItems(pendingImport);setSelected(0);setPendingImport(null);setNotice('파일을 불러왔습니다. 사이트에는 아직 반영되지 않았습니다.');}}>현재 목록 교체</button><button type="button" onClick={()=>setPendingImport(null)}>취소</button></div>}
    {current ? <div className="ed-columns" inert={Boolean(savedDraft)}><section className={`ed-form ${mobilePane==='preview'?'mobile-hidden':''}`} aria-label="툴킷 편집"><div className="ed-tabs" role="group" aria-label="편집 항목">{[['basic','기본 정보'],['questions','단계와 질문'],['files','파일 · 연결']].map(([value,label])=><button type="button" key={value} aria-pressed={tab===value} onClick={()=>setTab(value)}>{label}</button>)}</div>
    {tab==='basic'&&<div className="ed-form-content"><div className="ed-section-heading"><h3>이 실험을 소개해주세요.</h3><p>목록 카드와 상세페이지가 같은 정보를 사용합니다.</p></div><div className="ed-two"><Field label="고유 ID" value={current.id} onChange={v=>patch({id:v})} hint="배포한 ID는 유지해 주세요."/><Field label="표시 번호" value={current.number} onChange={v=>patch({number:v})}/></div><Field label="툴킷 제목" multiline value={current.title} onChange={v=>patch({title:v})} hint="줄바꿈은 목록 카드에서 사용할 수 있어요."/><Field label="짧은 소개" multiline value={current.description} onChange={v=>patch({description:v})}/><Field label="핵심 질문" multiline value={current.question} onChange={v=>patch({question:v})}/><div className="ed-two"><Field label="카테고리" value={current.category} onChange={v=>patch({category:v})}/><Field label="총 소요 시간 (분)" type="number" value={current.durationMinutes} onChange={v=>patch({durationMinutes:v})}/></div><Field label="해보고 남는 것" value={current.outcome} onChange={v=>patch({outcome:v})}/><Field label="준비물 (쉼표로 구분)" value={(current.materials||[]).join(',')} onChange={v=>patch({materials:v.split(',')})}/><div className="ed-field"><span className="ed-label">시트 색상</span><div className="ed-color-picker">{Object.entries(colors).map(([name,color])=><button key={name} type="button" title={name} aria-label={`${name} 색상`} aria-pressed={current.color===name} style={{background:color}} onClick={()=>patch({color:name})}>{current.color===name?'✓':''}</button>)}
<label className="ed-custom-color">
  <input type="color" aria-label="직접 시트 색상 선택"
    value={resolveColor(current.color)}
    onChange={event => patch({color:event.target.value})} />
  <span>직접 선택</span>
  <code>{resolveColor(current.color)}</code>
</label>
</div></div><Field label="카드 기호" value={current.mark} onChange={v=>patch({mark:v})}/></div>}
    {tab==='questions'&&<div className="ed-form-content"><div className="ed-section-heading"><h3>질문이 경험이 되는 순서.</h3><p>큰 단계 안에 필요한 만큼 세부 질문을 넣어보세요.</p></div>{current.steps.map((step,si)=><div className="ed-step-card" key={step.id}><div className="ed-step-card-top"><span>STEP {String(si+1).padStart(2,'0')}</span><div><button type="button" disabled={si===0} aria-label={`${si+1}단계 위로`} onClick={()=>moveStep(si,-1)}>↑</button><button type="button" disabled={si===current.steps.length-1} aria-label={`${si+1}단계 아래로`} onClick={()=>moveStep(si,1)}>↓</button><button type="button" aria-label={`${si+1}단계 삭제`} onClick={()=>update(list=>{list[selected].steps.splice(si,1);return list;})}>삭제</button></div></div><div className="ed-two"><Field label="단계 제목" value={step.title} onChange={v=>patchStep(si,{title:v})}/><Field label="시간 (분)" type="number" value={step.durationMinutes} onChange={v=>patchStep(si,{durationMinutes:v})}/></div><Field label="단계 안내" multiline value={step.description} onChange={v=>patchStep(si,{description:v})}/>{step.questions.map((q,qi)=><div className="ed-question-card" key={q.id}><div className="ed-question-top"><strong>질문 {qi+1}</strong><span>{types[q.type]}</span><div><button type="button" disabled={qi===0} aria-label={`질문 ${qi+1} 위로`} onClick={()=>moveQuestion(si,qi,-1)}>↑</button><button type="button" disabled={qi===step.questions.length-1} aria-label={`질문 ${qi+1} 아래로`} onClick={()=>moveQuestion(si,qi,1)}>↓</button><button type="button" aria-label={`질문 ${qi+1} 삭제`} onClick={()=>update(list=>{list[selected].steps[si].questions.splice(qi,1);return list;})}>×</button></div></div><Field label="질문 문구" value={q.label} onChange={v=>patchQuestion(si,qi,{label:v})}/><div className="ed-two"><label className="ed-field"><span>입력 방식</span><select value={q.type} onChange={e=>patchQuestion(si,qi,{type:e.target.value,...(e.target.value==='list'?{itemCount:q.itemCount||3}:{}),...(['singleSelect','multiSelect'].includes(e.target.value)?{options:q.options||['선택지 1','선택지 2']}:{} )})}>{Object.entries(types).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label><label className="ed-check"><input type="checkbox" checked={!!q.required} onChange={e=>patchQuestion(si,qi,{required:e.target.checked})}/>필수 질문</label></div>{['singleSelect','multiSelect'].includes(q.type)&&<Field label="선택지 (한 줄에 하나씩)" multiline value={(q.options||[]).join('\n')} onChange={v=>patchQuestion(si,qi,{options:v.split('\n')})}/>} {q.type==='singleSelect'&&<label className="ed-check"><input type="checkbox" checked={!!q.allowCustom} onChange={e=>patchQuestion(si,qi,{allowCustom:e.target.checked})}/>직접 입력도 허용</label>}{q.type==='list'&&<Field label="입력칸 개수 (1~20개)" type="number" value={q.itemCount||3} onChange={v=>patchQuestion(si,qi,{itemCount:v})}/>}<Field label="입력 안내 예시 (placeholder)" value={q.placeholder} onChange={v=>patchQuestion(si,qi,{placeholder:v})}/><details className="ed-advanced"><summary>질문 ID · 결과 표시 이름</summary><Field label="질문 ID" value={q.id} onChange={v=>patchQuestion(si,qi,{id:v})}/><Field label="결과 시트 표시 이름 (선택)" value={q.resultLabel} onChange={v=>patchQuestion(si,qi,{resultLabel:v})}/></details></div>)}<button type="button" className="ed-add-question" onClick={()=>update(list=>{list[selected].steps[si].questions.push({id:makeId('q'),label:'새로운 질문',type:'text',required:false});return list;})}>＋ 세부 질문 추가</button><p className="ed-id-hint">단계 ID: {step.id}</p></div>)}<button type="button" className="ed-add-step" onClick={()=>update(list=>{list[selected].steps.push({id:makeId('step'),title:'새로운 단계',description:'',durationMinutes:2,questions:[{id:makeId('q'),label:'새로운 질문',type:'text',required:false}]});return list;})}>＋ 실험 단계 추가</button></div>}
    {tab==='files'&&<div className="ed-form-content"><div className="ed-section-heading"><h3>종이와 사례를 연결하세요.</h3><p>주소를 입력해도 파일이 업로드되거나 사이트에 발행되지는 않습니다.</p></div><Field label="종이 툴킷 PDF 주소" value={current.pdfUrl} onChange={v=>patch({pdfUrl:v})} hint="예: /toolkits/exp-001.pdf 또는 https://…"/><Field label="관련 아카이브 ID (쉼표로 구분)" value={(current.relatedArchiveIds||[]).join(',')} onChange={v=>patch({relatedArchiveIds:v.split(',')})}/><div className="ed-publish-guide"><span>발행은 이렇게</span><ol><li>오른쪽에서 작성 화면 확인</li><li>데이터 내보내기로 JS 파일 다운로드</li><li>프로젝트의 기존 데이터 파일 교체</li><li>커밋 · Push 후 배포 확인</li></ol></div><button type="button" className="ed-delete-toolkit" disabled={items.length<=1} onClick={()=>setPendingDelete(true)}>이 툴킷 삭제</button>{pendingDelete&&<div className="ed-confirm"><p>현재 툴킷을 편집 목록에서 삭제할까요?</p><button type="button" onClick={()=>{setItems(list=>list.filter((_,i)=>i!==selected));setSelected(0);setPendingDelete(false);}}>삭제</button><button type="button" onClick={()=>setPendingDelete(false)}>취소</button></div>}</div>}
    <div className="ed-validation"><span>{errors.length?'확인할 항목이 있어요':'내보내기 형식 확인 완료 ✓'}</span>{errors.length>0&&<p>{errors[0]}</p>}<p>단계 시간 합계 {current.steps.reduce((sum,step)=>sum+(Number(step.durationMinutes)||0),0)}분 / 총 설정 {current.durationMinutes}분</p></div></section>
    <aside className={`ed-preview-wrap ${mobilePane==='edit'?'mobile-hidden':''}`} aria-label="작성 화면 미리보기"><LivePreview key={current.id} item={current}/></aside></div> : <div className="ed-empty"><p>기존 데이터 파일이 비어 있습니다. 새 툴킷을 만들면 이 목록에 추가됩니다.</p><button type="button" className="ed-button primary" onClick={addToolkit}>새 툴킷 만들기</button></div>}</div></div>
  </div>;
}
