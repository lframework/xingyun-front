import * as utils from '@/utils/utils';

export function validKey(rule, value) {
  if (!utils.isEmpty(value)) {
    if (!/^[A-Za-z0-9\.\-_]+$/.test(value)) {
      return Promise.reject('键只能由大写字母、小写字母、数字或._-组成');
    }
  }

  return Promise.resolve();
}
