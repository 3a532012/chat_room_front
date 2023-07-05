<template>
  <div class="grid grid-cols-4 gap-9">
    <div
      @click="toRoom(item.user.id)"
      v-for="item in onlineList"
      :key="item.user.id"
      :class="
        item.isOnline
          ? 'bg-green-600 hover:bg-green-300'
          : 'bg-zinc-600 hover:bg-zinc-300'
      "
      class="cursor-pointer text-white rounded-lg flex justify-center items-center w-20 h-10"
    >
      {{ item.user.userName }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from "vue";
import { getLocalStorage } from "@/utils/localStorage";
import { reactive } from "vue";
import { useRouter } from "vue-router";
type EventType = "list" | "delete" | "create" | "update" | "logout";
type OnlineUserData = {
  isOnline: boolean;
  user: {
    id: string;
    userName: string;
  };
};
type EventData = {
  eventType: EventType;
  data: OnlineUserData[];
};
const listSocket = ref<WebSocket | null>(null);
const initListSocket = () => {
  let { token } = JSON.parse(getLocalStorage("userInfo"));
  listSocket.value = new WebSocket(
    `ws://192.168.50.16:8005/socket/ws/list?token=${token}`,
  );
};
const router = useRouter();
const onlineList: OnlineUserData[] = reactive([]);
const toRoom = (id: string) => {
  router.push({
    name: "Room",
    query: {
      id: id,
    },
  });
};
const closeSocket = () => {
  listSocket!.value!.close();
};
const registerList = () => {
  listSocket!.value!.onmessage = function (event) {
    dispatchEvent(JSON.parse(event.data));
  };
  onUnmounted(() => {
    closeSocket();
  });
};

const dispatchEvent = (data: EventData) => {
  switch (data.eventType) {
    case "list":
      initOnlineList(data.data);
      break;
    case "create":
      createUser(data.data);
      break;

    case "update":
      updateUser(data.data);
      break;
    case "delete":
      deleteUser(data.data);
      break;
    case "logout":
      toLogin();
    default:
      break;
  }
};
const toLogin = () => {
  closeSocket();
  router.push({ name: "Login" });
};
const initOnlineList = (data: OnlineUserData[]) => {
  Object.assign(onlineList, data);
};
const updateUser = (data: OnlineUserData[]) => {
  Object.assign(onlineList, data);
};
const createUser = (data: OnlineUserData[]) => {
  data.forEach((item) => {
    onlineList.push(item);
  });
};
const deleteUser = (data: OnlineUserData[]) => {
  data.forEach((target) => {
    let result = onlineList.some((item, index, array) => {
      if (target.user.id === item.user.id) {
        array.splice(index, 1);
        return true;
      }
    });
    if (!result) {
      throw "fail to delete";
    }
  });
};
const init = () => {
  initListSocket();
  registerList();
};

init();
</script>
