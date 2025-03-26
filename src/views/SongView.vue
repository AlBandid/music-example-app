<script>
import { songsCollection, commentsCollection } from '@/includes/firebase.js'
import { doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { mapState } from 'pinia'
import { useUserStore } from '@/stores/user.js'
import SongHeader from '@/components/SongHeader.vue'
import CommentForm from '@/components/CommentForm.vue'
import CommentItem from '@/components/CommentItem.vue'
export default {
  name: 'SongView',
  data() {
    return {
      song: {},
      comments: [],
      sort: '1',
    }
  },
  computed: {
    ...mapState(useUserStore, ['userLoggedIn']),
    sortedComments() {
      return this.comments.slice().sort((a, b) => {
        if (this.sort === '1') {
          return b.creation_time - a.creation_time
        }
        return a.creation_time - b.creation_time
      })
    },
  },
  components: {
    CommentForm,
    CommentItem,
    SongHeader,
  },
  methods: {
    async addComment() {
      await this.getComments()
      this.song.comment_count = this.comments.length
    },
    async getComments() {
      const commentsSnapshot = await getDocs(
        query(
          commentsCollection,
          where('song_id', '==', this.$route.params.id),
          //orderBy('creation_time', 'desc'),
        ),
      )
      this.comments = []
      commentsSnapshot.forEach((doc) => {
        this.comments.push({ ...doc.data(), docID: doc.id })
      })
    },
  },
  watch: {
    sort(newVal) {
      if (newVal === this.$route.query.sort) {
        return
      }
      this.$router.push({
        query: {
          sort: newVal,
        },
      })
    },
  },
  async created() {
    const snapshot = await getDoc(doc(songsCollection, this.$route.params.id))
    if (!snapshot.exists()) {
      this.$router.push({ name: 'home' })
      return
    }

    const { sort } = this.$route.query
    this.sort = sort === '1' || sort === '2' ? sort : '1'

    this.song = snapshot.data()
    await this.getComments()
  },
}
</script>
<template>
  <main>
    <song-header :song="song" />

    <!-- Form -->
    <section class="container mx-auto mt-6" id="comments">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200" v-icon.right="'comments'">
          <!-- Comment Count -->
          <p v-if="song.comment_count === undefined">{{ song.toJSON() }}</p>
          <span class="card-title">{{ $t('song.comment_count', song.comment_count) }}</span>
        </div>
        <div class="p-6">
          <comment-form
            v-if="userLoggedIn"
            :song="song"
            :song_id="this.$route.params.id"
            :addComment="addComment"
          />
          <!-- Sort Comments -->
          <select
            v-model="sort"
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          >
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto">
      <li
        v-for="comment in sortedComments"
        :key="comment.docID"
        class="p-6 bg-gray-50 border border-gray-200"
      >
        <comment-item :comment="comment" />
      </li>
    </ul>
  </main>
</template>
