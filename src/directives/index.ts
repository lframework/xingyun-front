/**
 * Configure and register global directives
 */
import type { App } from 'vue';
import { setupPermissionDirective } from './permission';
import { setupNoPermissionDirective } from './no-permission';
import { setupLoadingDirective } from './loading';
import { setupEllipsisDirective } from './ellipsis';

export function setupGlobDirectives(app: App) {
  setupPermissionDirective(app);
  setupNoPermissionDirective(app);
  setupLoadingDirective(app);
  setupEllipsisDirective(app);
}
