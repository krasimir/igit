const LOCAL = true;

export const BASE_PATH = '/app';
export const NO_TOKEN = 'NO_TOKEN';
export const USE_MOCKS = LOCAL ? 'zeta' : false;
// export const USE_MOCKS = LOCAL ? 'githorn-playground' : false;
export const PRINT_PRS = !LOCAL;
// export const PRINT_PRS = false;
export const PULLING = LOCAL ? false : 120000;
