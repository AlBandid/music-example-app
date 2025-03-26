import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/stores/user.js'
import * as firebaseAuth from 'firebase/auth'

//wtf
// we need to mock firebase, we don't need a Promise here and we don't want to fail because of the server being down or sth
// this shit below is giving me a headache so i'm switching to test values in store.login()
// vi.mock('@/includes/firebase.js', () => ({
//   auth: { signInWithEmailAndPassword: () => Promise.resolve() },
// }))
//even Gemini is lost

describe('stores', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  test('authenticate user', async () => {
    const store = useUserStore()

    expect(store.userLoggedIn).not.toBe(true)
    await store.login({ email: 'test@test.com', password: 'zaq1@WSX' }) // sue me
    expect(store.userLoggedIn).toBe(true)
  })
})
