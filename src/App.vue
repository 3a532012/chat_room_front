<script setup lang="ts"></script>

<template>
  <div
    class="box-border px-[10%] py-[10%] w-full h-full flex flex-col justify-center"
  >
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>
