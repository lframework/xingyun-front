import * as utils from '@/utils/utils';

export function validKey({ itemValue }) {
  if (!utils.isEmpty(itemValue) && !/^[A-Za-z0-9\.\-_]+$/.test(itemValue)) {
    return new Error('键只能由大写字母、小写字母、数字或._-组成');
  }
}
