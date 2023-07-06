<template>
  <div
    @click="to('Login')"
    class="text-center mb-4 text-3xl box-border p-4 rounded-lg bg-blue-300 hover:bg-blue-600 cursor-pointer"
  >
    Login
  </div>
  <div
    @click="to('Register')"
    class="text-center text-3xl box-border p-4 rounded-lg bg-blue-300 hover:bg-blue-600 cursor-pointer"
  >
    Register
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const to = (name: string) => {
  router.push({ name: name });
};
</script>
