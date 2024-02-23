<template>
  <div ref="codeEditBox" class="codeEditBox"></div>
</template>
<script lang="ts">
  import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue';
  import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker.js?worker';
  import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker.js?worker';
  import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker.js?worker';
  import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker.js?worker';
  import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js?worker';
  import * as monaco from 'monaco-editor';
  import { language as sqlLanguage } from 'monaco-editor/esm/vs/basic-languages/sql/sql.js';
  import { language as yamlLanguage } from 'monaco-editor/esm/vs/basic-languages/yaml/yaml.js';
  import 'monaco-editor/esm/vs/basic-languages/sql/sql.contribution';
  import { editorProps } from './MonacoEditorType';

  export default defineComponent({
    name: 'MonacoEditor',
    props: editorProps,
    emits: ['update:value', 'change', 'editor-mounted'],
    setup(props, { emit }) {
      (self as any).MonacoEnvironment = {
        getWorker(_: string, label: string) {
          if (label === 'json') {
            return new JsonWorker();
          }
          if (['css', 'scss', 'less'].includes(label)) {
            return new CssWorker();
          }
          if (['html', 'handlebars', 'razor'].includes(label)) {
            return new HtmlWorker();
          }
          if (['typescript', 'javascript'].includes(label)) {
            return new TsWorker();
          }
          return new EditorWorker();
        },
      };
      let editor: any;
      const codeEditBox = ref();

      const init = () => {
        monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: true,
          noSyntaxValidation: false,
        });
        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
          target: monaco.languages.typescript.ScriptTarget.ES2020,
          allowNonTsExtensions: true,
        });
        monaco.languages.registerCompletionItemProvider('sql', {
          provideCompletionItems() {
            const suggestions: any = [];
            // 这个keywords就是sql.js文件中有的
            sqlLanguage.keywords.forEach((item: any) => {
              suggestions.push({
                label: item,
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: item,
              });
            });
            sqlLanguage.operators.forEach((item: any) => {
              suggestions.push({
                label: item,
                kind: monaco.languages.CompletionItemKind.Operator,
                insertText: item,
              });
            });
            sqlLanguage.builtinFunctions.forEach((item: any) => {
              suggestions.push({
                label: item,
                kind: monaco.languages.CompletionItemKind.Function,
                insertText: item,
              });
            });
            sqlLanguage.builtinVariables.forEach((item: any) => {
              suggestions.push({
                label: item,
                kind: monaco.languages.CompletionItemKind.Variable,
                insertText: item,
              });
            });
            return {
              // 最后要返回一个数组
              suggestions,
            };
          },
        });
        monaco.languages.registerCompletionItemProvider('yaml', {
          provideCompletionItems() {
            const suggestions: any = [];
            // 这个keywords就是python.js文件中有的
            yamlLanguage.keywords.forEach((item: any) => {
              suggestions.push({
                label: item,
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: item,
              });
            });
            return {
              // 最后要返回一个数组
              suggestions,
            };
          },
        });

        editor = monaco.editor.create(codeEditBox.value, {
          value: props.value,
          language: props.language,
          readOnly: props.readOnly,
          theme: props.theme,
          ...props.options,
        });

        // 监听值的变化
        editor.onDidChangeModelContent(() => {
          const value = editor.getValue(); // 给父组件实时返回最新文本
          emit('update:value', value);
          emit('change', value);
        });

        emit('editor-mounted', editor);
      };
      watch(
        () => props.value,
        (newValue) => {
          if (editor) {
            const value = editor.getValue();
            if (newValue !== value) {
              editor.setValue(newValue);
            }
          }
        },
      );

      watch(
        () => props.options,
        (newValue) => {
          editor.updateOptions(newValue);
        },
        { deep: true },
      );
      watch(
        () => props.readOnly,
        () => {
          console.log('props.readOnly', props.readOnly);
          editor.updateOptions({ readOnly: props.readOnly });
        },
        { deep: true },
      );

      watch(
        () => props.language,
        (newValue) => {
          monaco.editor.setModelLanguage(editor.getModel()!, newValue);
        },
      );

      onBeforeUnmount(() => {
        editor.dispose();
      });

      onMounted(() => {
        init();
      });

      return { codeEditBox };
    },
  });
</script>
<style lang="scss" scoped>
  .codeEditBox {
    width: 100%;
    flex: 1;
    min-height: 100px;
    height: 100%;
    overflow-y: auto;
  }
</style>
