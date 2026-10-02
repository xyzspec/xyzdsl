// @vitest-environment jsdom
import { useState } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { VisualEditor } from './VisualEditor';
vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} });
vi.mock('../scene/SceneRoot', () => ({ SceneRoot: (props: any) => <div><button onClick={() => props.onSelectNode(props.document.renderNodes[0].id)}>Pick box</button><button onClick={() => props.onMoveNode('x',1)}>Move box</button><button onClick={() => props.onCreateNode([2,0,0])}>Create box</button></div> }));
afterEach(cleanup);
function Host() { const [source,setSource] = useState('"Box/+0+1/+0+1/+0+1":"color: coral;"'); return <><VisualEditor source={source} onChange={setSource}/><output data-testid="source">{source}</output></>; }
it('edits the selected source declaration and retains selection after a transform', () => {
 render(<Host/>); fireEvent.click(screen.getByText('Pick box')); fireEvent.click(screen.getByText('Move box'));
 expect(screen.getByTestId('source').textContent).toContain('Box/+1+1');
 fireEvent.change(screen.getByLabelText('Color'), {target:{value:'blue'}});
 expect(screen.getByTestId('source').textContent).toContain('color: blue');
});
it('creates declarations, edits source, and switches between viewer and editor', () => {
 render(<Host/>); fireEvent.click(screen.getByText('Create box'));
 expect(screen.getByTestId('source').textContent?.split('\n')).toHaveLength(2);
 fireEvent.click(screen.getByRole('tab',{name:'Source'}));
 fireEvent.change(screen.getByRole('textbox'),{target:{value:'"Sphere/+0+1/+0+1/+0+1":"geometry: sphere"'}});
 expect(screen.getByTestId('source').textContent).toContain('Sphere');
 fireEvent.click(screen.getByRole('button',{name:'Viewer mode'}));
 expect(screen.queryByRole('tabpanel')).toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'Editor mode'}));
 expect(screen.getByRole('tabpanel')).toBeTruthy();
});
