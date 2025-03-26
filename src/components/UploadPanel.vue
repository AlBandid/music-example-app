<script>
import { storage, auth, songsCollection } from '@/includes/firebase.js'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { addDoc } from 'firebase/firestore'
export default {
  name: 'uploadPanel',
  data() {
    return {
      is_dragover: false,
      drag_text: 'Drag your files here',
    }
  },
  props: {
    uploads: {
      type: Array,
    },
    addSong: {
      type: Function,
    },
    updateUnsavedFlag: {
      type: Function,
    },
    addUpload: {
      type: Function,
    },
    addFailedUpload: {
      type: Function,
    },
    removeUpload: {
      type: Function,
    },
    changeProgress: {
      type: Function,
    },
    stateError: {
      type: Function,
    },
    stateSuccess: {
      type: Function,
    },
  },
  methods: {
    dragenter() {
      this.is_dragover = true
      this.drag_text = 'Drop me!'
    },
    dragleave() {
      this.is_dragover = false
      this.drag_text = 'Hey, come back!'
    },
    dragend() {
      this.is_dragover = false
      this.drag_text = 'Drag your files here'
    },
    dragstart() {
      this.is_dragover = false
      this.drag_text = 'Drag your files here'
    },
    upload($event) {
      this.updateUnsavedFlag(true)
      this.is_dragover = false
      this.drag_text = 'You can add more!'
      const files = $event.dataTransfer ? [...$event.dataTransfer.files] : [...$event.target.files]
      files.forEach((file) => {
        if (file.type !== 'audio/mpeg') {
          return
        }

        if (!navigator.onLine) {
          this.addFailedUpload({}, file.name)
          return
        }

        const songsRef = ref(storage, `songs/${file.name}`)
        const uploadTask = uploadBytesResumable(songsRef, file)
        const uploadIndex = this.addUpload(uploadTask, file.name)

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            this.changeProgress(
              uploadIndex,
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            )
          },
          (error) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            this.stateError(uploadIndex)
            switch (error.code) {
              case 'storage/unauthorized':
                console.log('Upload is unauthorized')
                break
              case 'storage/canceled':
                console.log('Upload is canceled')
                break
              case 'storage/unknown':
                console.log('Unknown error occurred')
                break
            }
          },
          async () => {
            // Handle successful uploads on complete
            const download_url = await getDownloadURL(uploadTask.snapshot.ref)

            const docRef = await addDoc(songsCollection, {
              user_id: auth.currentUser.uid,
              user_display_name: auth.currentUser.displayName,
              original_name: uploadTask.snapshot.ref.name,
              modified_name: uploadTask.snapshot.ref.name,
              genre: '',
              path: `songs/${uploadTask.snapshot.ref.name}`,
              comment_count: 0,
              url: download_url,
            })

            this.stateSuccess(uploadIndex)

            const delay = (ms) => new Promise((res) => setTimeout(res, ms))

            await delay(1000)
            await this.addSong(docRef.id)
            this.removeUpload(uploadIndex)
          },
        )
      })
    },
    pauseTask(upload) {
      upload.uploadTask.pause()
      upload.variant = 'bg-yellow-400'
      upload.icon = 'fas fa-pause'
      upload.text_class = 'text-yellow-400'
    },
    resumeTask(upload) {
      upload.uploadTask.resume()
      upload.variant = 'bg-blue-400'
      upload.icon = 'fas fa-spinner fa-spin'
      upload.text_class = 'text-blue-400'
    },
    cancelTask(upload) {
      upload.uploadTask.cancel()
      upload.state = 'cancelled'
      upload.variant = 'bg-red-400'
      upload.icon = 'fas fa-xmark'
      upload.text_class = 'text-red-400'
    },
    // cancelUploads() {
    //   this.uploads.forEach((upload) => {
    //     upload.uploadTask.cancel()
    //   })
    // },
  },
  beforeUnmount() {
    this.uploads.forEach((upload) => {
      upload.uploadTask.cancel()
    })
  },
}
</script>

<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200" v-icon.right="'upload'">
      <span class="card-title">Upload</span>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'text-white bg-green-400 border-green-400 border-solid': is_dragover }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop="dragstart"
        @dragend.prevent.stop="dragend"
        @dragover.prevent.stop="is_dragover = true"
        @dragenter.prevent.stop="dragenter"
        @dragleave.prevent.stop="dragleave"
        @drop.prevent.stop="upload($event)"
      >
        <h5>{{ drag_text }}</h5>
      </div>
      <input
        type="file"
        multiple
        class="p-2 rounded text-center cursor-pointer border-gray-600 text-grey-600"
        @change="upload($event)"
      />
      <hr class="my-6" />
      <!-- Progess Bars -->
      <div class="mb-4" v-for="upload in uploads" :key="upload.name">
        <!-- File Name -->
        <div class="font-bold text-sm" :class="upload.text_class">
          <i :class="upload.icon" /> {{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar"
            :class="upload.variant"
            :style="{ width: upload.current_progress + '%' }"
          ></div>
        </div>
        <button
          v-show="upload.state === 'running'"
          class="p-2 rounded text-center cursor-pointer border-gray-600 text-grey-600 transition-duration-500 hover:text-white hover:bg-yellow-400 hover:border-yellow-400"
          @click="pauseTask(upload)"
        >
          Pause
        </button>
        <button
          v-show="upload.state === 'paused'"
          class="p-2 rounded text-center cursor-pointer border-gray-600 text-grey-600 transition-duration-500 hover:text-white hover:bg-green-400 hover:border-green-400"
          @click="resumeTask(upload)"
        >
          Resume
        </button>
        <button
          v-show="upload.state === 'paused' || upload.state === 'running'"
          class="p-2 rounded text-center cursor-pointer border-gray-600 text-grey-600 transition-duration-500 hover:text-white hover:bg-red-400 hover:border-red-400"
          @click="cancelTask(upload)"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>
