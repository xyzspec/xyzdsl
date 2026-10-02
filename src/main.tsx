import { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AssetResolver, createSpatialDocument, openLocalScene } from './index';
import { VisualEditor } from './ui/VisualEditor';
import { resolveRemoteAsset } from './remoteAssets';
import './workspace.css';
import './styles.css';
function App() {
 const [source,setSource] = useState('"Box/+0+1/+0+1/+0+1":"color: coral;"');
 const [error,setError] = useState('');
 const [local,setLocal] = useState<Awaited<ReturnType<typeof openLocalScene>>>();
 const generation = useRef(0);
 useEffect(() => () => local?.close(), [local]);
 const assetError = useMemo(() => { try { for (const node of createSpatialDocument(source).renderNodes) for (const value of [node.model?.source,node.model?.previewSource,node.model?.detailSource]) if (value) (local?.resolve ?? resolveRemoteAsset)(value); return ''; } catch(error) { return String(error); } }, [source,local]);
 const assets = <><p>Models: {local ? 'local folder' : 'remote store'}</p>{local && <button onClick={() => { generation.current++; setLocal(undefined); }}>Use remote model store</button>}<label className="viewer-folder-input">Open scene folder<input type="file" multiple {...{webkitdirectory:''}} onChange={async event => {
 const files = Array.from(event.target.files ?? []); event.target.value=''; const current = ++generation.current;
 try { const next = await openLocalScene(files); if (current !== generation.current) {next.close();return;} setLocal(next); setSource(next.source); setError(''); } catch(error) { if(current === generation.current) setError(String(error)); }
 }}/></label><p>Choose a folder containing scene.xyz and its GLB models. Files stay in your browser.</p><p role="alert">{error}</p></>;
 return <AssetResolver.Provider value={local?.resolve ?? resolveRemoteAsset}><VisualEditor source={source} onChange={setSource} assetsPanel={assets} assetError={assetError}/></AssetResolver.Provider>;
}
createRoot(window.document.getElementById('root')!).render(<App/>);
