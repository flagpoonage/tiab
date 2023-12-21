import { getPathFromRoot } from './utils/root-path';

export const build_params_prod_fpath = getPathFromRoot(
  './environment/build-params.json',
);
export const build_params_dev_fpath = getPathFromRoot(
  './environment/build-params.dev.json',
);

export const env_define_output_fpath = getPathFromRoot('./.build/define.json');
export const env_params_output_fpath = getPathFromRoot('./.build/env.json');
export const build_dpath = getPathFromRoot('./build');
export const assets_dpath = getPathFromRoot('./assets');
export const index_fpath = getPathFromRoot('./src/index.ts');
