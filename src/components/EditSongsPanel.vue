<script>
import { songsCollection, storage } from '@/includes/firebase.js'
import { doc, deleteDoc } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'

export default {
  name: 'editSongsPanel',
  props: {
    songs: {
      type: Array,
    },
    editSong: {
      type: Function,
    },
    deleteSong: {
      type: Function,
    },
    updateUnsavedFlag: {
      type: Function,
    },
  },
  methods: {
    editModeOn(song) {
      song.showForm = true
      song.in_submission = false
      song.show_alert = false
      this.updateUnsavedFlag(true)
    },
    editModeOff(song) {
      song.showForm = false
      song.in_submission = false
      song.show_alert = false
      this.updateUnsavedFlag(false)
    },
    async edit(values) {
      await this.editSong(values)
    },
    async deleteS(song) {
      this.updateUnsavedFlag(true)
      song.state = 'edited'
      song.show_alert = true
      song.alert_variant = 'bg-blue-500'
      song.alert_message = 'Poczkaj, usuwamy utwór z bazy.'

      try {
        await deleteObject(ref(storage, song.path))
        await deleteDoc(doc(songsCollection, song.docID))
      } catch (e) {
        song.alert_variant = 'bg-red-500'
        song.alert_message = `No masz... ${e.message}`
        return
      }

      const delay = (ms) => new Promise((res) => setTimeout(res, ms))
      this.updateUnsavedFlag(false)
      song.state = 'deleted'
      song.deleted = true
      song.alert_variant = 'bg-green-500'
      song.alert_message = 'Utwór usunięty! Jak gdyby nigdy go nie było... (3s)'
      await delay(1000)
      song.alert_message = 'Utwór usunięty! Jak gdyby nigdy go nie było... (2s)'
      await delay(1000)
      song.alert_message = 'Utwór usunięty! Jak gdyby nigdy go nie było... (1s)'

      await delay(1000)
      song.show_alert = false
      this.deleteSong(song.docID)
    },
  },
}
</script>

<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div
      class="px-6 pt-6 pb-5 font-bold border-b border-gray-200"
      v-icon.right.yellow="'compact-disc'"
    >
      <span class="card-title">My Songs</span>
    </div>
    <div class="p-6">
      <!-- Composition Items -->
      <div class="border border-gray-200 p-3 mb-4 rounded" v-for="song in songs" :key="song.docID">
        <div v-show="!song.showForm">
          <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
          <button
            class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-400 float-right cursor-pointer"
            @click.prevent="deleteS(song)"
            v-show="!song.deleted"
          >
            <i class="fa fa-times"></i>
          </button>
          <button
            class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-400 float-right cursor-pointer"
            @click.prevent="editModeOn(song)"
            v-show="!song.deleted"
          >
            <i class="fa fa-pencil-alt"></i>
          </button>
        </div>
        <div>
          <div
            v-show="song.show_alert"
            class="text-white text-center font-bold p-4 mb-4"
            :class="song.alert_variant"
          >
            {{ song.alert_message }}
          </div>
          <vee-form v-show="song.showForm" :initial-values="song" @submit="edit">
            <div class="mb-3">
              <label class="inline-block mb-2">Song Title</label>
              <vee-field
                name="modified_name"
                type="text"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Song Title"
                rules="song_title_req|min:3|max:50"
                @input="updateUnsavedFlag(true)"
              />
              <error-message class="text-red-600" name="modified_name" />
            </div>
            <div class="mb-3">
              <label class="inline-block mb-2">Genre</label>
              <vee-field
                name="genre"
                type="text"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Genre"
                rules="min:3|max:25|alpha_spaces"
                @input="updateUnsavedFlag(true)"
              />
              <error-message class="text-red-600" name="genre" />
            </div>
            <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 cursor-pointer"
              :disabled="song.in_submission"
            >
              Submit
            </button>
            <button
              type="button"
              class="py-1.5 px-3 rounded text-white bg-gray-600 cursor-pointer"
              @click.prevent="editModeOff(song)"
              :disabled="song.in_submission"
            >
              Go Back
            </button>
          </vee-form>
        </div>
      </div>
    </div>
  </div>
</template>
