<script>
export default {
  name: 'CommentItem',
  props: {
    comment: {
      type: Object,
    },
  },
  computed: {
    comment_date() {
      const current_time = new Date().getTime() / 1000
      const time_delta = Math.round(current_time - this.comment.creation_time / 1000)
      if (time_delta < 60) {
        return `< 1min temu>`
      } else if (time_delta < 3600) {
        return `${Math.round(time_delta / 60)}min temu`
      } else if (time_delta < 86400) {
        return `${Math.round(time_delta / 3600)}godz. temu`
      } else {
        return 'dawno temu'
      }
    },
  },
}
</script>

<template>
  <!-- Comment Author -->
  <div class="mb-5">
    <div class="font-bold">{{ comment.author }}</div>
    <p>
      <i>{{ comment_date }}</i>
    </p>
    <time>{{ comment.date_posted }}</time>
  </div>

  <p>
    {{ comment.content }}
  </p>
</template>
