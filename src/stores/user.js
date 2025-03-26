import { defineStore } from 'pinia'
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth, usersCollection } from '@/includes/firebase.js'
import { addDoc } from 'firebase/firestore'

export const useUserStore = defineStore('user', {
  //here you define properties and methods for your state
  state: () => ({
    userLoggedIn: false,
  }),
  actions: {
    async register(values) {
      const userCred = await createUserWithEmailAndPassword(auth, values.email, values.password)
      await addDoc(usersCollection, {
        parentId: userCred.user.uid,
        name: values.name,
        email: values.email,
        age: values.age,
        gender: values.gender,
        country: values.country,
      })

      await updateProfile(userCred.user, { displayName: values.name })

      this.userLoggedIn = true
    },
    async login(values) {
      await signInWithEmailAndPassword(auth, values.email, values.password)
      this.userLoggedIn = true
    },
    async logout() {
      await signOut(auth)
      this.userLoggedIn = false
    },
  },
})
