<script>
import { mapActions, mapState } from 'pinia'
import { usePlayerStore } from '@/stores/player.js'

export default {
  name: 'SongHeader',
  props: {
    song: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState(usePlayerStore, { playing: 'playing', current_song: 'current_song' }),
    play_button() {
      return this.current_song.modified_name === this.song.modified_name ? this.playing : false
    },
  },
  methods: {
    ...mapActions(usePlayerStore, { newSong: 'newSong' }),
  },
}
</script>

<template>
  <!-- Music Header -->
  <section class="w-full mb-8 py-14 text-center text-white relative">
    <div
      class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
      style="background-image: url(../../public/assets/img/song-header.png)"
    ></div>
    <div class="container mx-auto flex items-center">
      <!-- Play/Pause Button -->
      <button
        id="play-btn"
        @click.prevent="newSong(song)"
        type="button"
        class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none cursor-pointer"
      >
        <i :class="{ 'fa fa-play': !play_button, 'fa fa-pause': play_button }"></i>
      </button>
      <div class="z-50 text-left ml-8">
        <!-- Song Info -->
        <div class="text-3xl font-bold">{{ song.modified_name }}</div>
        <div>{{ song.genre }}</div>
        <div class="song-price">{{ $n(0.69, 'currency') }}</div>
      </div>
    </div>
  </section>
</template>
