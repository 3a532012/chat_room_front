<template>
  <div class="relative">
    <h1 class="flex justify-center">Chat Room</h1>
    <div
      ref="contentRef"
      class="relative h-[90vh] overflow-auto border-[1px] border-slate-200 pr-2"
    >
      <div
        v-for="item in message"
        :class="item.sender === userInfo?.id ? 'justify-end' : 'justify-start'"
        class="flex w-full"
      >
        <div
          v-if="item.sender === userInfo?.id"
          class="mb-4 flex items-end text-sm mr-1"
        >
          {{ getTimeString(item.timestamp) }}
        </div>
        <div
          :class="
            item.sender === userInfo?.id ? 'bg-green-300' : 'bg-slate-300'
          "
          class="max-w-[80%] break-all box-border p-2 rounded-lg mb-4 text-black"
        >
          {{ item.content }}
        </div>
        <div
          v-if="item.sender !== userInfo?.id"
          class="mb-4 flex items-end text-sm ml-1"
        >
          {{ getTimeString(item.timestamp) }}
        </div>
      </div>
    </div>
    <div class="mt-2 flex w-full relative">
      <div
        v-show="isShowHintMessage"
        class="bg-[rgba(201,199,201,0.5)] truncate w-full absolute top-[-1.5rem]"
      >
        {{ `${route.query.name}: ${lastReceiverMessage?.content}` }}
      </div>
      <textarea
        @focus="toBottom()"
        ref="textRef"
        class="mr-12 h-7 p-[2px] overflow-auto container resize-y flex-[1] focus:border-green-600 outline-0 border-solid border-2 border-green-300 rounded-md hover:border-green-600"
        v-model="inputValue"
        type="text"
        placeholder="Enter message"
      />
      <div
        class="cursor-pointer absolute bottom-0 right-0 h-7 ml-1 text-white box-border p-1 rounded-lg bg-slate-600 hover:bg-slate-300"
        @click="sendMessage"
      >
        Send
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onUnmounted,
  reactive,
  toRefs,
  watch,
  nextTick,
  computed,
} from "vue";
import { useRoute } from "vue-router";
import { useStore } from "@/store";
import { onMounted } from "vue";
const store = useStore();
const { userInfo } = toRefs(store.state);
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
const contentRef = ref<HTMLDivElement | null>(null);
const closeSocket = () => {
  roomSocket!.value!.close();
};
const lastReceiverMessage = computed(() => {
  let result = message.filter((item) => item.sender === route.query.id);
  return result[result.length - 1];
});
const initSocket = () => {
  roomSocket.value = new WebSocket(
    `ws://192.168.101.169:8005/socket/ws/room?token=${userInfo.value?.token}&id=${route.query.id}`,
  );
  onUnmounted(() => {
    closeSocket();
  });
};
const inputValue = ref<string>("");
const toBottom = () => {
  window.scrollTo(0, document.body.scrollHeight);
};
const sendMessage = () => {
  if (inputValue.value) {
    roomSocket!.value!.send(inputValue.value);
    inputValue.value = "";
  }
};
const maxRows = 4; // Maximum number of rows
const minRows = 1; // Minimum number of rows
const textRef = ref<HTMLTextAreaElement | null>(null);
watch(inputValue, () => {
  if (textRef.value) {
    const lineHeight = parseInt(getComputedStyle(textRef.value).lineHeight);
    const minHeight = lineHeight * minRows;
    const maxHeight = lineHeight * maxRows;
    textRef.value.style.height = "1.75rem";
    textRef.value.style.height =
      Math.max(minHeight, Math.min(maxHeight, textRef.value.scrollHeight)) +
      "px";
  }
  window.scrollTo(0, document.body.scrollHeight);
});

const getTimeString = (IOSTimestamp: string) => {
  const date = new Date(IOSTimestamp);
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleString("en-US", options);
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
  contentScrollToBottom();
};
const writeMessage = (data: Message[]) => {
  data.forEach((item) => {
    message.push(item);
  });
  if (contentRef.value) {
    const isScrolledToBottom =
      contentRef.value.scrollTop >=
      contentRef.value.scrollHeight - contentRef.value.clientHeight;
    if (isScrolledToBottom) {
      contentScrollToBottom();
    } else {
      if (message[message.length - 1].sender !== userInfo.value?.id) {
        showHintMessage();
      }
    }
  }
};
onMounted(() => {
  registerScrollToBottomEvent();
});
const registerScrollToBottomEvent = () => {
  contentRef.value?.addEventListener("scroll", () => {
    if (contentRef.value) {
      const isScrolledToBottom =
        contentRef.value.scrollTop >=
        contentRef.value.scrollHeight - contentRef.value.clientHeight;
      if (isScrolledToBottom) {
        closeHintMessage();
      }
    }
  });
};
const isShowHintMessage = ref<boolean>(false);
const showHintMessage = () => {
  isShowHintMessage.value = true;
};
const closeHintMessage = () => {
  isShowHintMessage.value = false;
};

const contentScrollToBottom = () => {
  nextTick(() => {
    contentRef.value?.scrollTo(0, contentRef.value?.scrollHeight);
  });
};
const init = () => {
  initSocket();
  registerMessage();
};

init();
</script>
