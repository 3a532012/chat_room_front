<script setup lang="ts">
import { provide, ref } from "vue";
import { getLocalStorage } from "@/utils/localStorage";
import { roomSocketKey,listSocketKey } from "@/utils/provide"
const roomSocket = ref<WebSocket | null>(null);
const initSocket = () => {
  let token = getLocalStorage("token");
  roomSocket.value = new WebSocket(
    `ws://localhost:8005/socket/ws/room?token=${token}`,
  );
};

const listSocket = ref<WebSocket | null>(null);
const initListSocket = () => {
  let token = getLocalStorage("token");
  listSocket.value = new WebSocket(
    `ws://localhost:8005/socket/ws/list?token=${token}`,
  );
};

provide(roomSocketKey, roomSocket)
provide(listSocketKey, listSocket)

const init = () => {
  initSocket();
  initListSocket();
};

init();
</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" />
    </transition>
  </router-view>
</template>
