export const buttonProps = {
  loading: { type: Boolean },
  disabled: { type: Boolean },
  danger: { type: Boolean },
  /**
   * Text before icon.
   */
  preIcon: { type: String },
  /**
   * Text after icon.
   */
  postIcon: { type: String },
  /**
   * preIcon and postIcon icon size.
   * @default: 14
   */
  iconSize: { type: Number, default: 14 },
  onClick: { type: [Function, Array] as PropType<(() => any) | (() => any)[]>, default: null },
};
