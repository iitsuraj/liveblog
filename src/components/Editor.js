import loadable from '@loadable/component';

export default loadable(() => import('./containers/EditorContainer'), {
  fallback: null
});
