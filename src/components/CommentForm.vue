<script>
import { commentsCollection, auth, songsCollection } from '@/includes/firebase.js'
import { ErrorMessage } from 'vee-validate'
import { addDoc, updateDoc, getDoc, doc } from 'firebase/firestore'

export default {
  name: 'CommentForm',
  data() {
    return {
      in_submission: false,
      show_alert: false,
      alert_variant: 'bg-blue-500',
      alert_message: 'Poczkaj, dodajemy Twój komentarz.',
    }
  },
  components: { ErrorMessage },
  props: {
    song: {
      type: Object,
      required: true,
    },
    song_id: {
      type: String,
      required: true,
    },
    addComment: {
      type: Function,
    },
  },
  methods: {
    async createComment(values, { resetForm }) {
      this.in_submission = true
      this.show_alert = true
      this.alert_variant = 'bg-blue-500'
      this.alert_message = 'Poczkaj, dodajemy Twój komentarz.'

      const comment = {
        author_id: auth.currentUser.uid,
        author: auth.currentUser.displayName,
        content: values.comment,
        song_id: this.song_id,
        creation_time: new Date().getTime(),
        date_posted: new Date().toString(),
      }

      try {
        await addDoc(commentsCollection, comment)
        const snapshot = await getDoc(doc(songsCollection, this.song_id))
        const fresh_comment_count = snapshot.data().comment_count
        await updateDoc(doc(songsCollection, this.song_id), {
          comment_count: fresh_comment_count + 1,
        })
      } catch (e) {
        this.in_submission = false
        this.alert_variant = 'bg-red-500'
        this.alert_message = `Coś nie pykło... ${e.message}`
        return
      }

      this.alert_variant = 'bg-green-500'
      this.alert_message = 'Uff, udało się!'

      const delay = (ms) => new Promise((res) => setTimeout(res, ms))
      await delay(1000)
      this.in_submission = false
      await this.addComment()
      this.show_alert = false

      resetForm()
    },
  },
}
</script>

<template>
  <div
    class="text-white text-center font-bold p-4 rounded mb-4"
    v-if="show_alert"
    :class="alert_variant"
  >
    {{ alert_message }}
  </div>
  <vee-form @submit="createComment">
    <vee-field
      as="textarea"
      name="comment"
      class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
      placeholder="Your comment here..."
      rules="required|min:2|max:200"
    ></vee-field>
    <error-message class="text-red-600" name="comment" />
    <button
      type="submit"
      class="py-1.5 px-3 rounded text-white bg-green-600 block"
      :disabled="in_submission"
    >
      Submit
    </button>
  </vee-form>
</template>
