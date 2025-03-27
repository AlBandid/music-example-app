<script>
export default {
  name: 'SongItem',
  props: {
    song: {
      type: Object,
    },
  },
}
</script>

<template>
  <div>
    <router-link
      :to="{ name: 'song', params: { id: song.docID } }"
      class="font-bold block text-gray-600 composition-name"
    >
      {{ song.modified_name }}
    </router-link>
    <span class="text-gray-500 text-sm">{{ song.user_display_name }}</span>
  </div>

  <div class="text-gray-600 text-lg">
    <router-link
      custom
      :to="{ name: 'song', params: { id: song.docID }, hash: '#comments' }"
      v-slot="{ navigate }"
    >
      <span class="comments" @click="navigate">
        <i class="fa fa-comments text-gray-600 hover:text-green-500"></i>
        {{ song.comment_count }}
      </span>
    </router-link>
  </div>
</template>
