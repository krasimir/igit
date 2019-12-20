const LOCAL = false;

export const BASE_PATH = '/app';
export const NO_TOKEN = 'NO_TOKEN';
export const USE_MOCKS = LOCAL ? 'zeta' : false;
// export const USE_MOCKS = LOCAL ? 'githorn-playground' : false;
export const PRINT_PRS = false;
export const PULLING = !LOCAL;

export const SUBSCRIBED_REPOS = 'SUBSCRIBED_REPOS';
export const TOGGLE_REPO = 'TOGGLE_REPO';
export const REGISTER_PRS = 'REGISTER_PRS';
export const ADD_EVENT_TO_PR = 'ADD_EVENT_TO_PR';
export const REPLACE_EVENT_IN_PR = 'REPLACE_EVENT_IN_PR';
export const DELETE_EVENT_FROM_PR = 'DELETE_EVENT_FROM_PR';
export const ADD_PR_REVIEW_COMMENT = 'ADD_PR_REVIEW_COMMENT';
export const REPLACE_PR_REVIEW_COMMENT = 'REPLACE_PR_REVIEW_COMMENT';
export const DELETE_PR_REVIEW_COMMENT = 'DELETE_PR_REVIEW_COMMENT';
export const REPLACE_PR = 'REPLACE_PR';
export const ADD_PR = 'ADD_PR';
export const REPLACE_EVENT = 'REPLACE_EVENT';
export const DELETE_EVENT = 'DELETE_EVENT';
