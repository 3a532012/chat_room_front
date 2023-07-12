<template>
  <div class="flex justify-center text-4xl mb-4">Online List</div>
  <div class="grid grid-cols-4 gap-1">
    <div
      @click="toRoom(item)"
      v-for="item in onlineList"
      :key="item.user.id"
      :class="
        item.isOnline
          ? 'bg-blue-600 hover:bg-blue-300'
          : 'bg-zinc-600 hover:bg-zinc-300'
      "
      class="box-border break-all p-4 relative cursor-pointer text-white rounded-lg flex justify-center items-center min-h-10"
    >
      <div
        v-show="item.user.unReadCount !== 0"
        class="text-center w-8 absolute left-[-0.5rem] top-[-0.5rem] bg-green-600 rounded-xl text-white"
      >
        {{ item.user.unReadCount > 99 ? "99+" : item.user.unReadCount }}
      </div>
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
    unReadCount: number;
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
    `ws://192.168.101.169:8005/socket/ws/list?token=${userInfo.value?.token}`,
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

const dispatchEvent = (data: any) => {
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
    case "updateUnReadCount":
      updateUnReadCount(data.data);
      break;
    case "logout":
      toLogin();
    default:
      break;
  }
};
type UpdateUnReadCountEvent = {
  eventType: string;
  data: UpdateUnReadCountEventData[];
};
type UpdateUnReadCountEventData = {
  id: string;
  unReadCount: number;
};
const updateUnReadCount = (data: UpdateUnReadCountEventData[]) => {
  data.forEach((item) => {
    onlineList.some((subItem, subIndex, subArray) => {
      if (subItem.user.id === item.id) {
        subArray[subIndex].user.unReadCount = item.unReadCount;
        return true;
      }
    });
  });
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
