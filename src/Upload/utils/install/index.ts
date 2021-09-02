import { CustomAction } from '../../type';

export const install = (
  key: keyof CustomAction,
  action: CustomAction[keyof CustomAction],
) => {
  INSTALL_MAP[key] = action;
};

export function getInstallMap(key: keyof CustomAction) {
  return INSTALL_MAP[key];
}

const INSTALL_MAP: {
  [key: string]: any;
} = {
  request: undefined,
};
