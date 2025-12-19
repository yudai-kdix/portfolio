<script setup lang="ts">
import { useOSStore } from '../../stores/osStore';

const store = useOSStore();
const profileImage = import.meta.env.BASE_URL + 'yudai.jpg';

const handleClick = () => {
  store.openApp('profile');
};
</script>

<template>
  <div
    class="col-span-2 row-span-2 aspect-square relative rounded-[30px] overflow-hidden shadow-lg cursor-pointer group active:scale-95 transition-transform duration-200"
    @click="handleClick"
  >
    <!-- Photo Content -->
    <img
      :src="profileImage"
      alt="Profile Photo"
      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    />
    
    <!-- Gradient Overlay -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

    <!-- Text/Label -->
    <div class="absolute bottom-4 left-4 text-white">
      <h3 class="font-bold text-lg leading-tight">Yudai<br>Homma</h3>
      <p class="text-xs opacity-80 mt-1">Tap for Profile</p>
    </div>
  </div>
</template>
