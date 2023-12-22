<script setup>
const props = defineProps(["posts"])
const {VITE_BASE_PHOTO_URl} = import.meta.env

</script>

<template>
  <div class="image-gallary-container">
    <img
      v-for="post in props.posts"
      :key="post.id"
      :src="`${VITE_BASE_PHOTO_URl}${post.url}`"
    >
  </div>
</template>

<style scoped>
.image-gallary-container {
  display: flex;
  justify-content: start;
  flex-wrap: wrap;
}

img {
  margin: 5px;
  width: 200px;
}
</style>