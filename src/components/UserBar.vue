<script setup>
import UploadPhotoModalVue from './UploadPhotoModal.vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { supabase } from '@/supabase';

const route = useRoute();
const userStore = useUserStore();

const {user} = storeToRefs(userStore)
const {username: profileUsername} = route.params;

const props = defineProps(["user", "userInfo", "addNewPost", "isFollowing", "updateIsFollowing"]);

const followUser = async () => {
  props.updateIsFollowing(true)

  await supabase.from("followers_following").insert({
    follower_id: user.value.id,
    following_id: props.user.id
  })
}

const unFollowUser = async () => {
  props.updateIsFollowing(false)

  await supabase
    .from("followers_following")
    .delete()
    .eq("follower_id", user.value.id)
    .eq("following_id", props.user.id)
}
</script>

<template>
  <div class="userbar-container" v-if="props.user">
    <div class="top-content">
      <ATypographyTitle :level="2">{{ props.user.username }}</ATypographyTitle>
      <div v-if="user">
        <UploadPhotoModalVue
        v-if="profileUsername.toLocaleLowerCase() === user.username.toLocaleLowerCase()"
        :addNewPost="addNewPost"
        />
        <div v-else>
          <AButton v-if="!props.isFollowing" @click="followUser">Follow</AButton>
          <AButton v-else @click="unFollowUser">Unfollow</AButton>
        </div>
      </div>
    </div>
    <div class="buttom-content">
      <ATypographyTitle :level="5">{{ props.userInfo.posts }} Posts</ATypographyTitle>
      <ATypographyTitle :level="5">{{ props.userInfo.followers }} followers</ATypographyTitle>
      <ATypographyTitle :level="5">{{ props.userInfo.following }} following</ATypographyTitle>

    </div>
  </div>
  <div class="userbar-container" v-else>
    <div class="top-content">
      <ATypographyTitle :level="2">User not found</ATypographyTitle>
    </div>
  </div>
</template>

<style scoped>
.userbar-container {
  padding-bottom: 75px;
}

.buttom-content {
  display: flex;
  align-items: center;
}

.top-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.buttom-content h5 {
  margin: 0 !important;
  padding: 0;
  margin-right: 30px !important;
}
</style>