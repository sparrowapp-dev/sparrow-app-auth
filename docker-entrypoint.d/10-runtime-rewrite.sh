#!/bin/sh
set -eu

ROOT="/usr/share/nginx/html"

# (A) Generate /runtime-config.js from container env (for future use / parity)
#     Dollars are unescaped here because envsubst will do the replacement.
cat >"$ROOT/runtime-config.js.tmpl" <<'EOF'
window.runtimeConfig = {
  VITE_APP_EDITION: "${VITE_APP_EDITION}",
  VITE_API_URL: "${VITE_API_URL}",
  VITE_SPARROW_WEB_URL: "${VITE_SPARROW_WEB_URL}",
  VITE_SPARROW_SUPPORT_EMAIL: "${VITE_SPARROW_SUPPORT_EMAIL}",
  VITE_TERMS_OF_SERVICE: "${VITE_TERMS_OF_SERVICE}",
  VITE_SPARROW_PRIVACY_POLICY: "${VITE_SPARROW_PRIVACY_POLICY}",
  VITE_SPARROW_OAUTH: "${VITE_SPARROW_OAUTH}",
  VITE_ENABLE_MIX_PANEL: "${VITE_ENABLE_MIX_PANEL}",
  VITE_MIX_PANEL_TOKEN: "${VITE_MIX_PANEL_TOKEN}",
  VITE_SPARROW_MARKETING_URL: "${VITE_SPARROW_MARKETING_URL}",
  VITE_CANNY_FEEDBACK_URL: "${VITE_CANNY_FEEDBACK_URL}",
  VITE_SPARROW_CONTACT_SALES_URL: "${VITE_SPARROW_CONTACT_SALES_URL}"
}
EOF
envsubst < "$ROOT/runtime-config.js.tmpl" > "$ROOT/runtime-config.js" || true
rm -f "$ROOT/runtime-config.js.tmpl"

# Helpful log
echo "Generated runtime-config.js:"
sed -n '1,120p' "$ROOT/runtime-config.js" || true
