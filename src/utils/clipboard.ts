import Clipboard from 'clipboard';
import * as msg from '@/hooks/web/msg';

function clipboardSuccess() {
  msg.createSuccessTip('复制成功');
}

function clipboardError() {
  msg.createError('复制失败');
}

export default function handleClipboard(text, event) {
  const clipboard = new Clipboard(event.target, {
    text: () => text,
  });
  clipboard.on('success', () => {
    clipboardSuccess();
    clipboard.destroy();
  });
  clipboard.on('error', () => {
    clipboardError();
    clipboard.destroy();
  });
  clipboard.onClick(event);
}
