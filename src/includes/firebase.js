// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
  getFirestore,
  collection,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  CACHE_SIZE_UNLIMITED,
} from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCnFTGLfNeH54QiNAthI5klHhlm--mSLqI',
  authDomain: 'solid-dominion-452212-c3.firebaseapp.com',
  projectId: 'solid-dominion-452212-c3',
  storageBucket: 'solid-dominion-452212-c3.firebasestorage.app',
  messagingSenderId: '968135681876',
  appId: '1:968135681876:web:62d2c17414e4f663d54ac1',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  }),
})
const db = getFirestore(app)
const usersCollection = collection(db, 'users')
const songsCollection = collection(db, 'songs')
const commentsCollection = collection(db, 'comments')
const storage = getStorage(app)

// let's export that shit
export { auth, db, usersCollection, songsCollection, commentsCollection, storage }
