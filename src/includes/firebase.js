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
  //my config
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
