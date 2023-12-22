<script  setup>
import { ref } from 'vue';
import { supabase } from '@/supabase';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';

const userStore = useUserStore()

const {user} = storeToRefs(userStore)
const loading = ref(false)

const props = defineProps(["addNewPost"])
const errorMessage = ref("")
const visible = ref(false);
const caption = ref("")
const file = ref(null);
const errMessage = ref("")

const showModal = () => {
  visible.value = true;
};

const handleOk = async () => {
  loading.value = true;

  const fileName = Math.floor(Math.random() * 1000000000000)
  if (file.value) {
    const {data, error} = await supabase.storage.from("images").upload('public/'+ fileName, file.value)

    if (error) {
      loading.value = false;
      return errorMessage.value = "Unable to upload image"
    }

    await supabase.from("posts").insert({
      url: data.path,
      caption: caption.value,
      owner_id: user.value.id
    });

    loading.value = false;
    visible.value = false;
    caption.value = "";
    props.addNewPost({
      url: data.path,
      caption: caption.value,
    })
  }
};

const handleUploadChange = (e) => {
  if(e.target.files[0]) {
    file.value = e.target.files[0]
  }
}
</script>

<template>
  <div>
    <AButton  @click="showModal">Upload photo</AButton>
    <AModal v-model:visible="visible" title="Basic Modal" @ok="handleOk">
      <div v-if="!loading">
        <input type="file" accept=".jpeg,.png" @change="handleUploadChange">
        <AInput
          v-model:value="caption"
          placeholder="Caption..."
          :maxLength="50"
        />
        <ATypographyText v-if="errMessage" type="danger"> {{ errMessage }} </ATypographyText>
      </div>
      <div class="spiner" v-else>
        <ASpin />
      </div>
    </AModal>
  </div>
</template>

<style scoped>
  input {
    margin-bottom: 10px;
  }

  .spiner {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>