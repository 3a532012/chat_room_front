<template>
  <div class="relative">
    <h1 class="flex justify-center">GooBo</h1>
    <div
    tabindex="0"
    @focus="focus"
      ref="contentRef"
      class="relative h-[90vh] overflow-auto border-[1px] border-slate-200 pr-2"
    >
      <div v-for="(item, index) in message">
        <div class="flex justify-center">
          <div
            class="box-border p-1 rounded-lg bg-[rgba(79,79,79,0.2)] my-2"
            v-if="isShowDay(item.timestamp as string, message[index - 1]?.timestamp as string)"
          >
            {{
              isShowYear(
                item.timestamp as string,
                message[index - 1]?.timestamp as string,
              )
                ? `${formatTimestampToYYYYMMDD(item.timestamp as string)}`
                : `${formatTimestampToMMDD(item.timestamp as string)}`
            }}
          </div>
        </div>

        <div
          :class="
            item.sender === userInfo?.id ? 'justify-end' : 'justify-start'
          "
          class="flex w-full"
        >
          <div
            v-if="item.sender === userInfo?.id"
            class="mb-4 flex flex-col justify-end text-sm mr-1"
          >
            <div class="flex justify-end" v-if="item.sender === userInfo?.id">
              {{ item.isRead ? "Read" : "" }}
            </div>
            <div>
              {{ getTimeString(item.timestamp as string) }}
            </div>
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
            class="mb-4 flex flex-col justify-end text-sm ml-1"
          >
            <div class="flex justify-start" v-if="item.sender === userInfo?.id">
              {{ item.isRead ? "Read" : "" }}
            </div>
            <div>
              {{ getTimeString(item.timestamp as string) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-2 flex w-full relative">
      <div
        v-show="isShowHintMessage"
        @click="contentScrollToBottom"
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
import { formatTimestampToYYYYMMDD, formatTimestampToMMDD } from "@/utils/time";
import { useRoute,useRouter } from "vue-router";
import { useStore } from "@/store";
import { onMounted } from "vue";
const store = useStore();
const router = useRouter()
const { userInfo } = toRefs(store.state);
type EventType = "history" | "write" | "update";
type Message = {
  id?: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp?: string;
  isRead?: boolean;
};
type RoomEvent = {
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
    `ws://192.168.50.16:8005/socket/ws/room?token=${userInfo.value?.token}&id=${route.query.id}`,
  );
  roomSocket.value.onclose = closeSocket
  onUnmounted(() => {
    closeSocket();
  });
};
const newWiteMessage = (
  sender: string,
  receiver: string,
  content: string,
): Message => {
  return {
    sender: sender,
    receiver: receiver,
    content: content,
  };
};

const inputValue = ref<string>("");
const toBottom = () => {
  window.scrollTo(0, document.body.scrollHeight);
  focus()
};
const registerKeydown = () => {
  document.addEventListener('keydown',sendMessage)
}
const sendMessage = () => {
  if (inputValue.value) {
    let message = newWiteMessage(
      userInfo.value?.id as string,
      route.query.id as string,
      inputValue.value,
    );
    let roomEvent: RoomEvent = {
      eventType: "write",
      data: [message],
    };
    roomSocket!.value!.send(JSON.stringify(roomEvent));
    inputValue.value = "";
  }
};
const isShowDay = (
  firstTimestamp: string,
  secondTimestamp: string,
): boolean => {
  if (!secondTimestamp) {
    return true;
  }
  const date1 = new Date(firstTimestamp).setUTCHours(0, 0, 0, 0);
  const date2 = new Date(secondTimestamp).setUTCHours(0, 0, 0, 0);

  const diffInDays = Math.abs(date1 - date2) / (1000 * 60 * 60 * 24);
  return diffInDays >= 1;
};
const isShowYear = (
  firstTimestamp: string,
  secondTimestamp: string,
): boolean => {
  if (!secondTimestamp) {
    return true;
  }
  const year1 = new Date(firstTimestamp).getUTCFullYear();
  const year2 = new Date(secondTimestamp).getUTCFullYear();

  const diffInYears = Math.abs(year1 - year2);
  return diffInYears >= 1;
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
const dispatchEvent = (data: RoomEvent) => {
  switch (data.eventType) {
    case "history":
      initMessage(data.data);
      break;
    case "write":
      writeMessage(data.data);
      break;
    case "update":
      updateMessage(data.data);
      break;

    default:
      break;
  }
};
const initMessage = (data: Message[]) => {
  sentMessageToRead(data)
  Object.assign(message, data);
  contentScrollToBottom();
};
const sentMessageToRead = (data: Message[]) => {
  let unReadData = data.filter((item) => {
    return item.receiver === userInfo.value?.id && !item.isRead;
  });
  unReadData.forEach((item, index, array) => {
    array[index].isRead = true;
  });
  let roomEvent: RoomEvent = {
    eventType: "update",
    data: unReadData,
  };
  roomSocket.value?.send(JSON.stringify(roomEvent));
}
const focus = () => {
  sentMessageToRead(message)
}
const writeMessage = (data: Message[]) => {
  data.forEach((item) => {
    message.push(item);
  });
  detectShowHint()
  detectIsRead(data)
};
const detectIsRead = (data: Message[]) => {
  if(document.activeElement === contentRef.value || document.activeElement === textRef.value) {
    sentMessageToRead(data)
  }
}
const detectShowHint = () => {
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
}
const updateMessage = (data: Message[]) => {
  data.forEach((item) => {
    message.some((innerItem, index, array) => {
      if (item.id === innerItem.id) {
        array[index] = item;
        return true;
      }
    });
  });
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
  registerKeydown()
};

init();
</script>
