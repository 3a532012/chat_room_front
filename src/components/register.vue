<template>
  <div class="flex flex-col justify-center items-center">
    <h1>Register</h1>
    <div class="mt-10">
      <div class="flex">
        <div>Account：</div>
        <input placeholder="please enter account" v-model.trim="account" />
      </div>
      <div class="flex mt-3">
        <div>Password：</div>
        <input
          placeholder="please enter password"
          type="password"
          v-model="password"
        />
      </div>
      <div
        @click="register"
        class="mt-4 text-center cursor-pointer rounded-md bg-slate-600 text-white hover:bg-slate-400"
      >
        Confirm
      </div>
      <div
        @click="to('Login')"
        class="mt-4 text-center cursor-pointer rounded-md bg-blue-600 text-white hover:bg-blue-400"
      >
        Login
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElLoading } from "element-plus";
import { registerRequest } from "@/api/request";
import { useRouter } from "vue-router";
const to = (name: string) => {
  router.push({ name: name });
};
const account = ref<string | null>(null);
const password = ref<string | null>(null);
const router = useRouter();
const config: RegisterConfig = reactive({ username: "", password: "" });
type RegisterConfig = {
  username: string;
  password: string;
};
const setConfig = () => {
  config.username = account.value as string;
  config.password = password.value as string;
};

const register = () => {
  const loadingInstance = ElLoading.service({ fullscreen: true });
  setConfig();
  registerRequest(config)
    .then((resp) => {
      if (resp.data.code == 0) {
        router.push({ name: "Login" });
      }
      loadingInstance.close();
    })
    .catch((error) => {
      console.log("error", error);
      loadingInstance.close();
    });
};
</script>
