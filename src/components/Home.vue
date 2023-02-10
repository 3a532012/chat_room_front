<script setup lang="ts">
</script>

<template>
  <div>
    <div></div>
  </div>
</template>

<script setup>
import { io } from "socket.io-client";
const socket = io("127.0.0.1:3000", {
  path: '/chat_room'
});
// client-side
socket.on("connect", () => {
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});

socket.on("disconnect", () => {
  console.log(socket.id); // undefined
});
</script>
