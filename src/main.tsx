import { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AssetResolver, SceneRoot, createSpatialDocument, openLocalScene } from './index';
import './styles.css';
import { resolveRemoteAsset } from './remoteAssets';
const noop = () => {};

function App() {
 const [source,setSource] = useState('"Box/+0+1/+0+1/+0+1":"color: coral;"');
 const [error,setError] = useState('');
 const [local,setLocal] = useState<Awaited<ReturnType<typeof openLocalScene>>>();
 useEffect(() => () => local?.close(), [local]);
 const document = useMemo(() => { const document = createSpatialDocument(source); for (const node of document.nodes) if (node.content?.kind === 'url') node.content = { ...node.content, kind: 'text', text: node.content.url }; return document; }, [source]);
 const assetError = useMemo(() => { try { for (const node of document.renderNodes) for (const value of [node.model?.source, node.model?.previewSource, node.model?.detailSource]) if (value) (local?.resolve ?? resolveRemoteAsset)(value); return ''; } catch(error) { return String(error); } }, [document, local]);
 return <main><aside><h1>XYZ viewer</h1><p>Render XYZDSL using the remote model store, or open a local scene folder.</p><p>Models: {local ? 'local folder' : 'remote store'}</p>{local && <button onClick={() => setLocal(undefined)}>Use remote model store</button>}<label>Open scene folder<input type="file" multiple {...{webkitdirectory:''}} onChange={async event => {
 const files = Array.from(event.target.files ?? []); event.target.value='';
 try { const next = await openLocalScene(files); setLocal(next); setSource(next.source); setError(''); } catch(error) {setError(String(error));}
 }} /></label><label>XYZDSL<textarea value={source} onChange={e => setSource(e.target.value)} spellCheck={false}/></label><p role="alert">{error}</p>{document.diagnostics.map((d,i)=><p key={i}>Line {d.line}: {d.message}</p>)}</aside><>{assetError ? <p role="alert">{assetError}</p> : <AssetResolver.Provider value={local?.resolve ?? resolveRemoteAsset}><SceneRoot document={document} editorMode={false} selectedNodeCanEdit={false} editorLinearStep={0.01} editorRotationStep={15} linearStepChoice="auto" onLinearStepChoiceChange={noop} onRotationStepChange={noop} onMoveNode={noop} onResizeNode={noop} onRotateNode={noop} onCreateNode={noop}/></AssetResolver.Provider>}</></main>;
}
createRoot(window.document.getElementById('root')!).render(<App/>);
