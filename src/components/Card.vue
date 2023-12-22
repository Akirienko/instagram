<script setup>

const props = defineProps(['post']);
const {VITE_BASE_PHOTO_URl} = import.meta.env


</script>

<template>
  <ACard hoverable style="width: 240px" class="card">
    <template #cover>
      <img alt="example" :src="`${VITE_BASE_PHOTO_URl}${post.url}`" />
    </template>
    <ACardMeta :title="post.username">
      <template #description>{{ post.caption }}</template>
    </ACardMeta>
  </ACard>
</template>

<style scoped>
.card {
  margin-bottom: 30px;
}
</style>