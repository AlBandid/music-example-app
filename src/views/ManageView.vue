<script>
// import { useUserStore } from '@/stores/user.js'
import UploadPanel from '@/components/UploadPanel.vue'
import EditSongsPanel from '@/components/EditSongsPanel.vue'
import { doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { auth, songsCollection } from '@/includes/firebase.js'
export default {
  name: 'manageView',
  data() {
    return {
      uploads: [],
      songs: [],
      unsavedFlag: false,
    }
  },
  //this Guard runs before routing to this page, we can also call it from the router/index
  //Guards run before any lifecycle of this component, so we don't have access to 'this' variables yet
  //this Guard will run after the Guards defined in router/index
  // beforeRouteEnter(to, from, next) {
  //   const store = useUserStore()
  //   if (store.userLoggedIn) {
  //     next()
  //   } else {
  //     next({ name: 'home' })
  //   }
  // },
  beforeRouteLeave(to, from, next) {
    if (!this.unsavedFlag) {
      next()
    } else if (
      confirm('Are you sure you want to leave this page? Any unsaved changes might be lost')
    ) {
      next()
    }
  },
  components: {
    UploadPanel,
    EditSongsPanel,
  },
  methods: {
    updateUnsavedFlag(value) {
      this.unsavedFlag = value
      const openForms = this.songs.filter((e) => {
        e.state === 'edited'
      })
      const runningUploads = this.uploads.filter((e) => {
        e.state !== 'success'
      })
      if (openForms.length > 0 || runningUploads.length > 0) {
        this.unsavedFlag = true
      }
    },
    addUpload(uploadTask, file_name) {
      //it returns the index of current upload
      return (
        this.uploads.push({
          uploadTask,
          current_progress: 0,
          name: file_name,
          state: 'running',
          variant: 'bg-blue-400',
          icon: 'fas fa-spinner fa-spin',
          text_class: 'text-blue-400',
        }) - 1
      )
    },
    addFailedUpload(uploadTask, file_name) {
      //it returns the index of current upload
      return (
        this.uploads.push({
          uploadTask,
          current_progress: 100,
          name: file_name,
          state: 'failed',
          variant: 'bg-red-400',
          icon: 'fas fa-xmark',
          text_class: 'text-red-400',
        }) - 1
      )
    },
    changeProgress(uploadIndex, value) {
      this.uploads[uploadIndex].current_progress = value
    },
    stateError(uploadIndex) {
      this.uploads[uploadIndex].state = 'error'
      this.uploads[uploadIndex].variant = 'bg-red-400'
      this.uploads[uploadIndex].icon = 'fas fa-exclamation-circle'
      this.uploads[uploadIndex].text_class = 'text-red-400'
    },
    stateSuccess(uploadIndex) {
      this.uploads[uploadIndex].state = 'success'
      this.uploads[uploadIndex].variant = 'bg-green-400'
      this.uploads[uploadIndex].text_class = 'text-green-400'
      this.uploads[uploadIndex].icon = 'fas fa-check'
      this.updateUnsavedFlag(false)
    },
    removeUpload(uploadIndex) {
      this.uploads.splice(uploadIndex, 1)
    },
    async addSong(songID) {
      const song = await getDoc(doc(songsCollection, songID))
      console.log(song)
      this.songs.push({
        ...song.data(),
        docID: song.id,
        showForm: false,
        in_submission: false,
        show_alert: false,
        alert_variant: 'bg-blue-500',
        alert_message: 'Poczkaj, zapisujemy zmiany.',
        deleted: false,
        state: 'normal',
      })
    },
    async editSong(values) {
      const songIndex = this.songs.findIndex((e) => e.docID === values.docID)
      this.songs[songIndex].state = 'edited'
      this.songs[songIndex].in_submission = true
      this.songs[songIndex].show_alert = true
      this.songs[songIndex].alert_variant = 'bg-blue-500'
      this.songs[songIndex].alert_message = 'Poczkaj, zapisujemy zmiany.'

      try {
        await updateDoc(doc(songsCollection, values.docID), {
          modified_name: values.modified_name,
          genre: values.genre,
        })
      } catch (e) {
        this.songs[songIndex].in_submission = false
        this.songs[songIndex].alert_variant = 'bg-red-500'
        this.songs[songIndex].alert_message = `No masz... ${e.message}`
        return
      }

      this.songs[songIndex].state = 'saved'
      this.songs[songIndex].modified_name = values.modified_name
      this.songs[songIndex].genre = values.genre
      this.songs[songIndex].in_submission = false
      this.songs[songIndex].alert_variant = 'bg-green-500'
      this.songs[songIndex].alert_message = 'Zmiany zostały zapisane!'
      this.songs[songIndex].showForm = false
      this.updateUnsavedFlag(false)
    },
    deleteSong(songID) {
      const songIndex = this.songs.findIndex((e) => e.docID === songID)
      this.songs.splice(songIndex, 1)
    },
  },
  async created() {
    const querySnapshot = await getDocs(
      query(songsCollection, where('user_id', '==', auth.currentUser.uid)),
    )
    querySnapshot.forEach((document) => {
      this.songs.push({
        ...document.data(),
        docID: document.id,
        showForm: false,
        in_submission: false,
        show_alert: false,
        alert_variant: 'bg-blue-500',
        alert_message: 'Poczkaj, zapisujemy zmiany.',
        deleted: false,
        state: 'normal',
      })
    })
  },
}
</script>
<template>
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <upload-panel
          ref="upload"
          :uploads="uploads"
          :addUpload="addUpload"
          :addFailedUpload="addFailedUpload"
          :changeProgress="changeProgress"
          :stateError="stateError"
          :stateSuccess="stateSuccess"
          :removeUpload="removeUpload"
          :addSong="addSong"
          :updateUnsavedFlag="updateUnsavedFlag"
        />
      </div>
      <div class="col-span-2">
        <edit-songs-panel
          ref="edit_songs"
          :songs="songs"
          :editSong="editSong"
          :deleteSong="deleteSong"
          :updateUnsavedFlag="updateUnsavedFlag"
        />
      </div>
    </div>
  </section>
</template>
