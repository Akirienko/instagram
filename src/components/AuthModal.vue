<script setup>
import { ref, defineProps, reactive } from 'vue';
import {useUserStore} from "../stores/user"
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const visible = ref(false);

const { errMessage, loading, user } = storeToRefs(userStore)

const showModal = () => {
  visible.value = true;
};

const userCredentials = reactive({
  email: "",
  password: "",
  username: ""
})

const clearUserCredentialsInput = () => {
  userCredentials.email = ""
  userCredentials.password = ""
  userCredentials.username = ""
  userStore.clearErrorMessage()
}

const handleOk = async (e) => {
  if(props.isLogin) {
    await userStore.handleLogin({
      email: userCredentials.email,
      password: userCredentials.password
    })
  }
  else {
    await userStore.handleSignup(userCredentials)
  }

  if (user.value) {
    clearUserCredentialsInput()
    visible.value = false
  }
};

const props = defineProps(['isLogin']);

const title = props.isLogin ? 'Login' : 'Signup';

const handleCancel = () => {
  clearUserCredentialsInput()
  visible.value = false
}

</script>

<template>
  <div>
    <AButton type="primary" @click="showModal" class="btn">{{ title }}</AButton>
    <AModal v-model:visible="visible" :title="title" @ok="handleOk">
      <div v-if="!loading" class="input-container">
        <AInput class="input" v-if="!isLogin" v-model:value="userCredentials.username" placeholder="Username" />
        <AInput class="input" v-model:value="userCredentials.email" placeholder="Email" />
        <AInput v-model:value="userCredentials.password" placeholder="Password" type="password" />
      </div>
      <div v-else class="spiner">
        <ASpin />
      </div>
      <ATypographyText v-if="errMessage" type="danger"> {{ errMessage }} </ATypographyText>
      <template #footer>
        <AButton key="back" @click="handleCancel">Cancel</AButton>
        <AButton
          :disablet="loading"
          key="submit"
          type="primary"
          :loading="loading"
          @click="handleOk"
        >
          Submit
        </AButton>
      </template>
    </AModal>
  </div>
</template>

<style scoped>
.btn {
  margin-left: 10px;
}
.input {
  margin-bottom: 10px;
}
.input-container {
  height: 120px;
}
.spiner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
}
</style>