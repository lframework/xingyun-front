export interface LoginDefaultFormData {
  tenantName: string;
  username: string;
  password: string;
}

const demoLoginDefaultFormData: LoginDefaultFormData = {
  tenantName: '测试租户',
  username: 'admin',
  password: 'admin',
};

const emptyLoginDefaultFormData: LoginDefaultFormData = {
  tenantName: '',
  username: '',
  password: '',
};

export function getLoginDefaultFormData(mode = import.meta.env.MODE): LoginDefaultFormData {
  return ['demo', 'development'].includes(mode)
    ? { ...demoLoginDefaultFormData }
    : { ...emptyLoginDefaultFormData };
}
