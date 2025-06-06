// vue-grid/src/composables/useAuth.js

import { ref, onMounted } from 'vue'
import { Auth } from '@aws-amplify/auth'

/**
 * Exposes:
 *   user      → ref(null) or CognitoUser
 *   signIn()  → Auth.federatedSignIn()
 *   signOut() → Auth.signOut()
 */
export function useAuth() {
  const user = ref(null)

  // On component mount, check if a user session already exists:
  onMounted(async () => {
    try {
      const current = await Auth.currentAuthenticatedUser()
      user.value = current
    } catch {
      user.value = null
    }
  })

  // Redirect to the Cognito Hosted UI
  function signIn() {
    Auth.federatedSignIn()
  }

  // Sign out (global) and clear the local ref:
  async function signOut() {
    try {
      await Auth.signOut({ global: true })
    } catch (err) {
      console.error('Error during signOut:', err)
    }
    user.value = null
  }

  return {
    user,
    signIn,
    signOut,
  }
}
