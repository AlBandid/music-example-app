<script>
import { songsCollection } from '@/includes/firebase.js'
import { doc, getDoc, getDocs, query, limit, orderBy, startAfter } from 'firebase/firestore'
import SongItem from '@/components/SongItem.vue'
import IconSecondary from '@/directives/icon-secondary.js'

export default {
  name: 'HomeView',
  data() {
    return {
      songs: [],
      scroll_interval: 15,
      pendingRequest: false,
    }
  },
  components: {
    SongItem,
  },
  directives: {
    'icon-secondary': IconSecondary,
  },
  methods: {
    async requestSongs() {
      if (this.pendingRequest) {
        console.log('There is a pending request already')
        return
      }

      console.log('Loading the next batch')
      this.pendingRequest = true
      let songsSnapshot
      if (this.songs.length > 0) {
        const lastSong = await getDoc(doc(songsCollection, this.songs[this.songs.length - 1].docID))
        songsSnapshot = await getDocs(
          query(
            songsCollection,
            orderBy('modified_name', 'asc'),
            startAfter(lastSong),
            limit(this.scroll_interval),
          ),
        )
      } else {
        songsSnapshot = await getDocs(
          query(songsCollection, orderBy('modified_name', 'asc'), limit(this.scroll_interval)),
        )
      }
      songsSnapshot.forEach((doc) => {
        this.songs.push({ ...doc.data(), docID: doc.id })
      })
      this.pendingRequest = false
    },
    async handleScroll() {
      const { scrollTop, offsetHeight } = document.documentElement
      const { innerHeight } = window
      const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight
      if (bottomOfWindow) {
        await this.requestSongs()
      }
    },
  },
  async created() {
    await this.requestSongs()
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
}
</script>
<template>
  <main>
    <section class="mb-8 py-20 text-white text-center relative">
      <div
        class="absolute inset-0 w-full h-full bg-contain introduction-bg bg-[url(../../public/assets/img/header.png)]"
      ></div>
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-5xl mb-5">{{ $t('home.introductionHeader') }}</h1>
          <p class="w-full md:w-8/12 mx-auto">Welcome to my small music app!</p>
        </div>
      </div>

      <img
        class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
        src="../../public/assets/img/introduction-music.png"
        alt="background image with some music related icons"
      />
    </section>

    <section class="container mx-auto">
      <div class="bg-white rounded-sm border border-gray-200 relative flex flex-col">
        <div
          class="px-6 pt-6 pb-5 font-bold border-b border-gray-200"
          v-icon-secondary="{ icon: 'headphones-alt', right: true, color: 'yellow' }"
        >
          <span class="card-title">Songs</span>
          <!-- Icon -->
        </div>
        <!-- Playlist -->
        <ol id="playlist">
          <li
            v-for="song in songs"
            :key="song.docID"
            class="flex justify-between items-center p-3 pl-6 cursor-pointer transition duration-300 hover:bg-gray-50"
          >
            <song-item :song="song" />
          </li>
        </ol>
        <!-- .. end Playlist -->
      </div>
    </section>
  </main>
</template>
