const constants = {
  API_URL: import.meta.env.VITE_API_URL,
  ENABLE_MIX_PANEL: import.meta.env.VITE_ENABLE_MIX_PANEL,
  MIX_PANEL_TOKEN: import.meta.env.VITE_MIX_PANEL_TOKEN,
  API_SEND_TIMEOUT: 5000,
  RXDB_DB_NAME: "sparrow-db",
  AUTH_TOKEN: "AUTH_TOKEN",
  REF_TOKEN: "REF_TOKEN",
  WORKSPACE_LIMIT: 5,
  API_LIMIT: 5,
  API_REDIRECT_TIMEOUT: 7000,
  SPARROW_OAUTH:import.meta.env.VITE_SPARROW_OAUTH,
  SPARROW_SUPPORT_EMAIL:import.meta.env.VITE_SPARROW_SUPPORT_EMAIL,
  SPARROW_TERMS_OF_SERVICE: import.meta.env.VITE_TERMS_OF_SERVICE,
  SPARROW_WEB_URL: import.meta.env.VITE_SPARROW_WEB_URL,
  SPARROW_MARKETING_URL: import.meta.env.VITE_SPARROW_MARKETING_URL,
  SPARROW_PRIVACY_POLICY:import.meta.env.VITE_SPARROW_PRIVACY_POLICY
};

export default constants;
