<script setup>
import { storeToRefs } from "pinia";
import Cards from "./Cards.vue";
import Container from "./Container.vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();

const {user, loadingUser} = storeToRefs(userStore)


</script>

<template>
  <Container>
    <div v-if="!loadingUser">
      <Cards v-if="user" />
      <div v-else class="timeline-container">
        <h2>Login to see posts</h2>
      </div>
    </div>
    <div v-else class="spiner">
      <ASpin />
    </div>
  </Container>
</template>


<style scoped>
.spiner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
}
</style>