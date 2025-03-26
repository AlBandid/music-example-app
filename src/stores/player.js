import { defineStore } from 'pinia'
import { Howl } from 'howler'
import helper from '@/includes/helper.js'
export const usePlayerStore = defineStore('player', {
  state: () => ({
    current_song: {},
    sound: {},
    seek: '00:00',
    duration: '00:00',
    player_progress: '0%',
    player_volume: '100%',
    sound_on: true,
  }),
  actions: {
    async newSong(song) {
      let vol = 1
      if (this.sound instanceof Howl) {
        vol = this.sound.volume()
        this.sound.unload()
      }
      this.current_song = song
      this.sound = new Howl({
        src: [song.url],
        html5: true,
      })
      this.sound.volume(vol)
      this.sound.play()

      this.sound.on('play', () => {
        requestAnimationFrame(this.progress)
      })
    },
    async toggleAudio() {
      if (!this.sound.playing) {
        return
      }

      if (this.sound.playing()) {
        this.sound.pause()
      } else {
        this.sound.play()
      }
    },
    async toggleVolume() {
      if (!this.sound.playing) {
        return
      }

      if (this.sound_on) {
        this.sound.mute(true)
        this.sound_on = false
      } else {
        this.sound.mute(false)
        this.sound_on = true
      }
    },
    progress() {
      this.seek = helper.formatTime(this.sound.seek())
      this.duration = helper.formatTime(this.sound.duration())
      this.player_progress = `${(this.sound.seek() / this.sound.duration()) * 100}%`

      if (this.sound.playing()) {
        requestAnimationFrame(this.progress)
      }
    },
    updateSeek(event) {
      if (!this.sound.playing) {
        return
      }
      //current target to element interfejsu z nałożonym click eventem, wyciagamy jego polozenie x i szerokosc,
      //poniewaz event.clientX to miejsce klikniecia wzgledem calej strony a nie tego elementu
      const { x, width } = event.currentTarget.getBoundingClientRect()
      const clickX = event.clientX - x
      const percentage = clickX / width
      const seconds = this.sound.duration() * percentage

      this.sound.seek(seconds)
      this.sound.once('seek', this.progress)
    },
    updateVolume(event) {
      if (!this.sound.playing) {
        return
      }

      const { x, width } = event.currentTarget.getBoundingClientRect()
      const clickX = event.clientX - x
      let percentage = 0
      if (clickX > 0) {
        percentage = clickX / width
        this.sound_on = true
      } else {
        this.sound_on = false
      }
      this.player_volume = `${percentage * 100}%`
      this.sound.volume(percentage)
    },
  },
  getters: {
    playing: (state) => {
      if (state.sound.playing) {
        return state.sound.playing()
      }
      return false
    },
  },
})
