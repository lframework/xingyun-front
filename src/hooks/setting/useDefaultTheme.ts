import { theme } from 'ant-design-vue';

export function useDefaultTheme() {
  const { compactAlgorithm, defaultSeed } = theme;
  // defaultSeed.fontSize = ratio(defaultSeed.fontSize);
  // defaultSeed.sizePopupArrow = ratio(defaultSeed.sizePopupArrow);
  const mapToken = compactAlgorithm(defaultSeed);

  const defaultTheme = {
    token: {
      ...mapToken,
      // fontSizeIcon: ratio(mapToken.fontSizeIcon),
      colorPrimary: '#0960bd',
      borderRadius: 2,
      borderRadiusLG: 2,
      borderRadiusOuter: 2,
      borderRadiusSM: 2,
      borderRadiusXS: 2,
      // controlHeight: ratio(mapToken.controlHeight),
      // controlHeightLG: ratio(mapToken.controlHeightLG),
      // controlHeightSM: ratio(mapToken.controlHeightSM),
      // controlHeightXS: ratio(mapToken.controlHeightXS),
      // controlPaddingHorizontal: ratio(mapToken.controlPaddingHorizontal),
      // controlPaddingHorizontalSM: ratio(mapToken.controlPaddingHorizontalSM),
      // controlInteractiveSize: ratio(mapToken.controlInteractiveSize),
      // size: ratio(mapToken.size),
      // sizeLG: ratio(mapToken.sizeLG),
      // sizeMD: ratio(mapToken.sizeMD),
      // sizeMS: ratio(mapToken.sizeMS),
      // sizeSM: ratio(mapToken.sizeSM),
      // sizeXL: ratio(mapToken.sizeXL),
      // sizeXS: ratio(mapToken.sizeXS),
      // sizeXXL: ratio(mapToken.sizeXXL),
      // sizeXXS: ratio(mapToken.sizeXXS),
      // margin: ratio(mapToken.margin),
      // marginLG: ratio(mapToken.marginLG),
      // marginMD: ratio(mapToken.marginMD),
      // marginSM: ratio(mapToken.marginSM),
      // marginXL: ratio(mapToken.marginXL),
      // marginXS: ratio(mapToken.marginXS),
      // marginXXL: ratio(mapToken.marginXXL),
      // marginXXS: ratio(mapToken.marginXXS),
      // padding: mapToken.padding / 14 * 12,
      // paddingContentHorizontal: ratio(mapToken.paddingContentHorizontal),
      // paddingContentHorizontalLG: ratio(mapToken.paddingContentHorizontalLG),
      // paddingContentHorizontalSM: ratio(mapToken.paddingContentHorizontalSM),
      // paddingContentVertical: ratio(mapToken.paddingContentVertical),
      // paddingContentVerticalLG: ratio(mapToken.paddingContentVerticalLG),
      // paddingContentVerticalSM: ratio(mapToken.paddingContentVerticalSM),
      // paddingLG: ratio(mapToken.paddingLG),
      // paddingMD: ratio(mapToken.paddingMD),
      // paddingSM: ratio(mapToken.paddingSM),
      // paddingXL: ratio(mapToken.paddingXL),
      // paddingXS: ratio(mapToken.paddingXS),
      // paddingXXS: ratio(mapToken.paddingXXS),
    },
  };

  return {
    defaultTheme,
  };
}
