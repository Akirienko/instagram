import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '../supabase'

export const useUserStore = defineStore('users', () => {
  const user = ref(null)
  const errMessage = ref("")
  const loading =ref(false)
  const loadingUser = ref(false)

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleLogin = async (credentials) => {

    const {email, password} = credentials

    if(!validateEmail(email)){
      return errMessage.value = "Email is invalid"
    }

    if(!password.length){
      return errMessage.value = "Password cannot be empty"
    }

    loading.value = true

    const {data, error} = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if(error){
      loading.value = false
      return errMessage.value = error.message
    }

    const { data: existingUser } = await supabase
      .from("users")
      .select()
      .eq("email", email)
      .single()

      user.value = {
        email: existingUser.email,
        username: existingUser.username,
        id: existingUser.id
      }

      loading.value = false
      return errMessage.value = ""
  }

  const handleSignup = async (credentials) => {
    const {email, password, username} = credentials

    if(password.length < 6){
      return errMessage.value = "Password is too short min 6 symbol"
    }

    if(username.length < 4){
      return errMessage.value = "Username is too short mix 4 leter"
    }

    if(!validateEmail(email)){
      return errMessage.value = "Email is invalid"
    }

    loading.value = true

    // Validate username
    const { data: userWithUsername } = await supabase.from("users").select().eq("username", username).single()

    if(userWithUsername) {
      loading.value = false
      return errMessage.value =  "Username already exists"
    }

    errMessage.value = ""

    // Cach error from supabase
    const {error} = await supabase.auth.signUp({
      email,
      password
    })

    if(error) {
      loading.value = false
      return errMessage.value = error.message
    }


    // Add user info to database
    await supabase.from("users").insert({
      username,
      email
    })

    const { data: newUser } = await supabase
      .from("users")
      .select()
      .eq("email", email)
      .single()

    user.value = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username
    }

    loading.value = false
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    user.value = null
  }

  const getUser = async () => {
    loading.value = true
    loadingUser.value = true;
    const {data} = await supabase.auth.getUser();

    if(!data.user) {
      loading.value = false
      return user.value = null
    }

    if (!data.user) {
      loading.value = false
      return user.value = null
    }

    const {data: userWithEmail} = await supabase
      .from("users")
      .select()
      .eq("email", data.user.email)
      .single()

      user.value = {
        username: userWithEmail.username,
        email: userWithEmail.email,
        id: userWithEmail.id
      }

    loading.value = false
    loadingUser.value = false;
  }

  const clearErrorMessage = () => {
    errMessage.value = ""
  }


  return {
    user,
    errMessage,
    loading,
    loadingUser,
    handleLogin,
    handleLogout,
    handleSignup,
    getUser,
    clearErrorMessage,
  }
})
