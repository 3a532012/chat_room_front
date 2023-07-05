<template>
  <div>
    <h1>Chat Room</h1>
    <input
      class="focus:border-green-600 outline-0 border-solid border-2 border-green-300 rounded-md hover:border-green-600"
      v-model="inputValue"
      type="text"
      id="messageInput"
      placeholder="Enter message"
    />
    <button @click="sendMessage">Send</button>
    <div
      v-for="item in message"
      :class="item.sender === id ? 'justify-end' : 'justify-start'"
      class="flex w-full"
    >
      <div
        :class="item.sender === id ? 'bg-green-300' : 'bg-slate-300'"
        class="box-border p-2 rounded-lg mb-4 text-black"
      >
        {{ item.content }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, reactive, toRefs } from "vue";
import { getLocalStorage } from "@/utils/localStorage";
import { useRoute } from "vue-router";

type EventType = "history" | "write";
type Message = {
  id: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp: string;
};
type EventData = {
  eventType: EventType;
  data: Message[];
};
const message: Message[] = reactive([]);
const route = useRoute();
const roomSocket = ref<WebSocket | null>(null);
const closeSocket = () => {
  roomSocket!.value!.close();
};
const { token, id, userName } = toRefs(JSON.parse(getLocalStorage("userInfo")));
const initSocket = () => {
  roomSocket.value = new WebSocket(
    `ws://192.168.50.16:8005/socket/ws/room?token=${token.value}&id=${route.query.id}`,
  );
  onUnmounted(() => {
    closeSocket();
  });
};

const registerMessage = () => {
  roomSocket!.value!.onmessage = function (event) {
    var message = event.data;
    dispatchEvent(JSON.parse(message));
  };
};
const dispatchEvent = (data: EventData) => {
  switch (data.eventType) {
    case "history":
      initMessage(data.data);
      break;
    case "write":
      writeMessage(data.data);
      break;

    default:
      break;
  }
};
const initMessage = (data: Message[]) => {
  Object.assign(message, data);
};
const writeMessage = (data: Message[]) => {
  data.forEach((item) => {
    message.push(item);
  });
};
const inputValue = ref<string>("");
const sendMessage = () => {
  roomSocket!.value!.send(inputValue.value);
  inputValue.value = "";
};

const init = () => {
  initSocket();
  registerMessage();
};

init();
</script>
