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
import { listSocketKey } from "@/utils/provide"


const listSocket = inject(listSocketKey)
const registerList = () => {
  listSocket!.value!.onmessage = function (event) {
    var message = event.data;
    console.log("Received List:", message);
    // Add your logic to display the message in the chat interface
  };
};

const init = () => {
  registerList();
};

init();
</script>
