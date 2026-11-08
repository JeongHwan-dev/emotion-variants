<template>
  <Sandbox
    template="react-ts"
    :rtl="rtl"
    :light-theme="lightTheme"
    :dark-theme="darkTheme"
    :options="{
      ...props,
      showLineNumbers: true,
      showTabs: false,
      editorHeight: 420,
    }"
    :custom-setup="{
      ...props,
      deps: {
        'emotion-variants': '2.0.0',
        '@emotion/react': '^11',
        '@emotion/css': '^11',
      },
    }"
    :code-options="codeOptions"
  >
    <slot />
  </Sandbox>
</template>

<script setup>
import { Sandbox, sandboxProps } from 'vitepress-plugin-sandpack';

const props = defineProps(sandboxProps);
</script>

<style>
.dark {
  color-scheme: dark;
}
</style>
