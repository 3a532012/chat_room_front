<template>
  <div class="flex flex-col justify-center items-center">
    <h1>Login</h1>
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
        @click="login"
        class="mt-4 text-center cursor-pointer rounded-md bg-slate-600 text-white hover:bg-slate-400"
      >
        Confirm
      </div>
      <div
        @click="to('Register')"
        class="mt-4 text-center cursor-pointer rounded-md bg-blue-600 text-white hover:bg-blue-400"
      >
        Register
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElLoading } from "element-plus";
import { loginRequest } from "@/api/request";
import { useRouter } from "vue-router";
import { useStore } from "@/store";

const to = (name: string) => {
  router.push({ name: name });
};
const account = ref<string | null>(null);
const password = ref<string | null>(null);
const router = useRouter();
const store = useStore();
const config: LoginConfig = reactive({ username: "", password: "" });
type LoginConfig = {
  username: string;
  password: string;
};
const setConfig = () => {
  config.username = account.value as string;
  config.password = password.value as string;
};
type LoginSuccess = {
  token: string;
  userName: string;
  id: string;
};
const login = () => {
  const loadingInstance = ElLoading.service({ fullscreen: true });
  setConfig();
  loginRequest<LoginSuccess, LoginConfig>(config)
    .then((resp) => {
      if (resp.data.code == 0) {
        store.commit("updateUserInfo", resp.data.data);
        router.push({ name: "OnlineList" });
      }
      loadingInstance.close();
    })
    .catch((error) => {
      console.log("error", error);
      loadingInstance.close();
    });
};
</script>
