<script setup>
import Container from "./Container.vue";
import ImageGallary from "./ImageGallary.vue";
import UserBar from "./UserBar.vue";
import { ref, onMounted, watch, reactive } from 'vue';
import { supabase } from "@/supabase";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from 'pinia';

const userStore = useUserStore()
const route = useRoute();
const {username} = route.params;
const {user: loggedInUser} = storeToRefs(userStore);

const user = ref(null)
const posts = ref([])
const loading = ref(false)
const isFollowing = ref(false)
const userInfo = reactive({
  posts: null,
  following: null,
  followers: null
})

const addNewPost = (post) => {
  posts.value.unshift(post)
}

const updateIsFollowing = (follow) => {
  isFollowing.value = follow
}

const fetchData = async () => {
  loading.value = true

  const {data: userData} = await supabase
    .from("users")
    .select()
    .eq("username", username)
    .single()

  if(!userData){
      loading.value = false
      return user.value = null
  }

  user.value = userData

  const {data: postsData} = await supabase
    .from("posts")
    .select()
    .eq("owner_id", user.value.id )

  posts.value = postsData;

  await fetchIsFollowing()

  const followerCount = await fetchFollowersCount()
  const followingCount = await fetchFollowingCount()

  userInfo.followers = followerCount
  userInfo.following = followingCount
  userInfo.posts = posts.value.length

  loading.value = false
}

const fetchIsFollowing = async () => {
  if(loggedInUser.value && (loggedInUser.value.id !== user.value.id)) {
    const {data} = await supabase
      .from("followers_following")
      .select()
      .eq("follower_id", loggedInUser.value.id)
      .eq("following_id", user.value.id)
      .single()

    if(data) isFollowing.value = true
  }
}

const fetchFollowersCount = async () => {
  const {count} = await supabase
    .from("followers_following")
    .select("*", {count: "exact"})
    .eq("following_id", user.value.id)

    return count
}

const fetchFollowingCount = async () => {
  const {count} = await supabase
    .from("followers_following")
    .select("*", {count: "exact"})
    .eq("follower_id", user.value.id)

    return count
}

watch(loggedInUser, ()=>{
  fetchIsFollowing()
})

onMounted(() => {
  fetchData()
})

</script>

<template>
  <Container>
    <div class="profile-container" v-if="!loading">
      <UserBar
        :key="$route.params.username"
        :user="user"
        :userInfo="userInfo"
        :addNewPost="addNewPost"
        :isFollowing="isFollowing"
        :updateIsFollowing="updateIsFollowing"
      />
      <ImageGallary :posts="posts" />
    </div>
    <div v-else class="spinner">
        <ASpin />
    </div>
  </Container>
</template>


<style scoped>
.profile-container {
  /* display: flex;
  align-items: center; */
  padding: 20px 0;
}

.spinner {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 85vh
}
</style>