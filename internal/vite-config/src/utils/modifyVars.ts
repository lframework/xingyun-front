import { resolve } from 'node:path';

import { generate } from '@ant-design/colors';
// @ts-ignore: typo
/* import { getThemeVariables } from 'ant-design-vue/dist/theme'; */
import { theme } from 'ant-design-vue/lib';
import convertLegacyToken from 'ant-design-vue/lib/theme/convertLegacyToken';

const { compactAlgorithm, defaultSeed } = theme;

const primaryColor = '#0960bd';

function generateAntColors(color: string, theme: 'default' | 'dark' = 'default') {
  return generate(color, {
    theme,
  });
}

/**
 * less global variable
 */
export function generateModifyVars() {
  const palettes = generateAntColors(primaryColor);
  const primary = palettes[5];

  const primaryColorObj: Record<string, string> = {};

  for (let index = 0; index < 10; index++) {
    primaryColorObj[`primary-${index + 1}`] = palettes[index];
  }

  // const modifyVars = getThemeVariables();
  const mapToken = compactAlgorithm(defaultSeed);
  const v3Token = convertLegacyToken(mapToken);

  return {
    ...v3Token,
    // reference:  Avoid repeated references
    hack: `true; @import (reference) "${resolve('src/design/config.less')}";`,
    'primary-color': primary,
    ...primaryColorObj,
    'info-color': primary,
    'processing-color': primary,
    'success-color': '#52C41A', //  Success color
    'error-color': '#FF4D4F', //  False color
    'warning-color': '#FAAD14', //   Warning color
    'font-size-base': '12px', //  Main font size
    'border-radius-base': '2px', //  Component/float fillet
    'link-color': primary, //   Link color
    'app-content-background': '#fafafa', //   Link color
  };
}
