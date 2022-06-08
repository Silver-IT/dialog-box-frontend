export const API_URL =
  process.env.REACT_APP_NODE_ENV == "production"
    ? process.env.REACT_APP_PRODUTION_API_URL
    : (process.env.REACT_APP_NODE_ENV == "staging"
    ? process.env.REACT_APP_STAGING_API_URL
    : process.env.REACT_APP_DEVELOPMENT_API_URL);

export const ACCOUNT_TYPE = {
  OWNER: "account_owner",
  ADMIN: "account_admin",
  NORMAL: "account_normal",
};
