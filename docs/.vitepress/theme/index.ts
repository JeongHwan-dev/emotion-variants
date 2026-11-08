import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { defineAsyncComponent } from 'vue';
import 'vitepress-plugin-sandpack/dist/style.css';
import './custom.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Async so sandpack-vue3 (CodeMirror, browser-only) stays out of the SSR pass.
    app.component(
      'Sandpack',
      defineAsyncComponent(() => import('./components/Sandpack.vue')),
    );
  },
} satisfies Theme;
