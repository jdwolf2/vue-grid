// vue-grid/src/main.js

import { createApp } from 'vue'
import App from './App.vue'

// ─── SYNCFUSION GRID PLUGIN ───────────────────────────────────────────────────
import { GridPlugin } from '@syncfusion/ej2-vue-grids'

// ─── AMPLIFY CONFIGURATION (from @aws-amplify/core) ───────────────────────────
import Amplify from '@aws-amplify/core'

// ── PASTE YOUR COGNITO SETTINGS (from vue-4) BELOW ─────────────────────────────
Amplify.configure({
  Auth: {
    // region, userPoolId, userPoolWebClientId must match your existing Cognito setup:
    region: 'us-east-2',
    userPoolId: 'us-east-2_G2vpbtsqp',
    userPoolWebClientId: '2ps5f1adntoj56ml8ll8c7lbrg',
    oauth: {
      domain: 'your-cognito-domain.auth.us-east-2.amazoncognito.com',
      scope: ['openid', 'profile', 'email'],
      redirectSignIn: 'http://localhost:3000/',
      redirectSignOut: 'http://localhost:3000/',
      responseType: 'code',
    },
  },
})
// ────────────────────────────────────────────────────────────────────────────────

// ─── CREATE & MOUNT VUE APP ─────────────────────────────────────────────────────
const app = createApp(App)

app.use(GridPlugin)
app.mount('#app')
