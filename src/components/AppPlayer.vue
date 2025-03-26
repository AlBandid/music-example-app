<script>
import { mapState, mapActions } from 'pinia'
import { usePlayerStore } from '@/stores/player.js'

export default {
  name: 'AppPlayer',
  computed: {
    ...mapState(usePlayerStore, {
      current_song: 'current_song',
      playing: 'playing',
      duration: 'duration',
      seek: 'seek',
      player_progress: 'player_progress',
      player_volume: 'player_volume',
      sound_on: 'sound_on',
    }),
  },
  methods: {
    ...mapActions(usePlayerStore, {
      toggleAudio: 'toggleAudio',
      toggleVolume: 'toggleVolume',
      updateSeek: 'updateSeek',
      updateVolume: 'updateVolume',
    }),
  },
}
</script>

<template>
  <div class="fixed bottom-0 left-0 bg-white p-5 pb-4 text-left align-top w-full h-16">
    <div class="relative">
      <!-- Play/Pause Button -->
      <div class="float-left w-7 h-7 leading-3">
        <button type="button" @click.prevent="toggleAudio">
          <i
            class="text-gray-500 text-xl cursor-pointer"
            :class="{ 'fa fa-play': !playing, 'fa fa-pause': playing }"
          />
        </button>
      </div>
      <!-- Current Position -->
      <div class="float-left w-7 h-7 leading-3 text-gray-400 mt-0 text-lg w-14 ml-5 mt-1">
        <span class="player-currenttime">{{ seek }}</span>
      </div>
      <!-- Scrub -->
      <div class="float-left w-7 h-7 leading-3 ml-7 mt-2 player-scrub">
        <div
          v-if="current_song.modified_name"
          class="absolute left-0 right-0 text-lg text-center mx-auto player-song-info"
        >
          <span class="song-title font-bold">{{ current_song.modified_name }}</span> by
          <span class="song-artist">{{ current_song.user_display_name }}</span>
        </div>
        <!-- Scrub Container  -->
        <span
          @click.prevent="updateSeek"
          class="block w-full h-2 rounded m-1 mt-2 bg-gray-200 relative cursor-pointer"
        >
          <!-- Player Ball -->
          <span class="absolute top-neg-8 text-gray-800 text-lg" :style="{ left: player_progress }">
            <i class="fas fa-circle"></i>
          </span>
          <!-- Player Progress Bar-->
          <span
            class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400"
            :style="{ width: player_progress }"
          ></span>
        </span>
      </div>
      <!-- Duration -->
      <div class="float-left w-7 h-7 leading-3 text-gray-400 mt-0 text-lg w-14 ml-8 mt-1">
        <span class="player-duration">{{ duration }}</span>
      </div>
      <!--Volume-->
      <div class="float-left w-7 h-7 leading-3">
        <button type="button" @click.prevent="toggleVolume">
          <i
            class="text-gray-500 text-xl cursor-pointer"
            :class="{ 'fa fa-volume-high': sound_on, 'fa fa-volume-xmark': !sound_on }"
          />
        </button>
      </div>
      <div class="float-left w-7 h-7 leading-3 player-volume">
        <span
          @click.prevent="updateVolume"
          class="block w-20 h-2 rounded m-1 bg-gray-200 cursor-pointer"
        >
          <span
            class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400"
            :style="{ width: player_volume }"
          ></span>
        </span>
      </div>
    </div>
  </div>
</template>
