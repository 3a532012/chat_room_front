<template>
  <div class="grid grid-cols-4 gap-9">
    <div
      class="cursor-pointer text-white rounded-lg hover:bg-green-300 flex justify-center items-center bg-green-600 w-[200px] h-[50px]"
    >
      123
    </div>
    <div
      class="cursor-pointer text-white rounded-lg hover:bg-green-300 flex justify-center items-center bg-green-600 w-[200px] h-[50px]"
    >
      123
    </div>
    <div
      class="cursor-pointer text-white rounded-lg hover:bg-green-300 flex justify-center items-center bg-green-600 w-[200px] h-[50px]"
    >
      123
    </div>
    <div
      class="cursor-pointer text-white rounded-lg hover:bg-green-300 flex justify-center items-center bg-green-600 w-[200px] h-[50px]"
    >
      123
    </div>
    <div
      class="cursor-pointer text-white rounded-lg hover:bg-green-300 flex justify-center items-center bg-green-600 w-[200px] h-[50px]"
    >
      123
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from "vue";
import { listSocketKey } from "@/utils/provide";
type EventType = "list" | "delete" | "create" | "update";
type EventData = {
  EventType: EventType;
  Data: any;
};
const listSocket = inject(listSocketKey);
const registerList = () => {
  listSocket!.value!.onmessage = function (event) {
    dispatchEvent(event.data);
  };
};

const dispatchEvent = (data: EventData) => {
  switch (data.EventType) {
    case "list":
      break;
    case "create":
      break;

    case "update":
      break;
    case "delete":
      break;
    default:
      break;
  }
};

const init = () => {
  registerList();
};

init();
</script>
