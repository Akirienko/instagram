<script setup>
import { RouterLink, useRouter } from 'vue-router';
import Container from "./Container.vue"
import AuthModal from './AuthModal.vue';
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();

const {user} = storeToRefs(userStore);
const searchUserName = ref("");
const router = useRouter();


const onSearch = () => {
  if(searchUserName.value){
    router.push(`/profile/${searchUserName.value.toLocaleLowerCase()}`)
    searchUserName.value = ""
  }
}

const handleLogout = async () => {
  await userStore.handleLogout()
}

const goToUserProfile = () => {
  router.push(`/profile/${user.value.username}`)
}

</script>

<template>
  <div>
    <ALayoutHeader>
      <Container>
        <div class="nav-container">
          <div class="right-content">
            <RouterLink to="/">Instagram</RouterLink>
            <AInputSearch
              v-model:value="searchUserName"
              placeholder="User Name..."
              style="width: 200px"
              @search="onSearch"
            />
          </div>
          <div class="left-content" v-if="!user">
            <AuthModal :is-login="0" />
            <AuthModal :is-login="1" />
          </div>
          <div class="left-content" v-else>
            <AButton @click="goToUserProfile" type="primary"> Profile </AButton>
            <AButton @click="handleLogout" type="primary"> Logout </AButton>
          </div>
        </div>
      </Container>
    </ALayoutHeader>
  </div>
</template>

<style scoped>
.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.right-content, .left-content {
  display: flex;
  align-items: center;
}

.right-content a {
  margin-right: 10px;
}

.left-content button:first-child {
  margin-right: 10px;
}
</style>