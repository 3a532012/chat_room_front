<template>
  <div class="flex justify-center text-4xl mb-4">Online List</div>
  <div class="grid grid-cols-4 gap-1">
    <div
      @click="toRoom(item)"
      v-for="item in onlineList"
      :key="item.user.id"
      :class="
        item.isOnline
          ? 'bg-green-600 hover:bg-green-300'
          : 'bg-zinc-600 hover:bg-zinc-300'
      "
      class="cursor-pointer text-white rounded-lg flex justify-center items-center h-10"
    >
      {{ item.user.userName }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, toRefs } from "vue";
import { useStore } from "@/store";
import { reactive } from "vue";
import { useRouter } from "vue-router";

const store = useStore();
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
const { userInfo } = toRefs(store.state);
const listSocket = ref<WebSocket | null>(null);
const initListSocket = () => {
  listSocket.value = new WebSocket(
    `ws://192.168.50.16:8005/socket/ws/list?token=${userInfo.value?.token}`,
  );
};
const router = useRouter();
const onlineList: OnlineUserData[] = reactive([]);
const toRoom = (data: OnlineUserData) => {
  router.push({
    name: "Room",
    query: {
      id: data.user.id,
      name: data.user.userName,
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
  data.forEach((item) => {
    onlineList.some((innerItem, index, array) => {
      if (item.user.id === innerItem.user.id) {
        array[index] = item;
        return true;
      }
    });
  });
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
