<script setup lang="ts">
import { useOSStore } from '../../stores/osStore';

const props = defineProps<{
  app: any;
  isEditMode: boolean;
}>();

const store = useOSStore();

// Mock data for preview content
const profileData = {
  name: 'Yudai Homma',
  role: 'Web Engineer',
  image: '/portfolio/yudai.jpg'
};

const galleryPreviews = [
  '/portfolio/gallery/20250101.jpg',
  '/portfolio/gallery/20250504.jpg',
  '/portfolio/gallery/20250527.jpg',
  '/portfolio/gallery/20250721.jpg'
];
</script>

<template>
  <div 
    class="w-full h-full rounded-[24px] bg-white/40 backdrop-blur-xl border border-white/30 shadow-lg overflow-hidden relative group transition-all duration-300 hover:scale-[1.02] hover:bg-white/50 hover:shadow-xl cursor-url-pointer flex flex-col items-center justify-center p-2"
    :class="{ 'animate-jiggle': isEditMode }"
  >
    <!-- Profile Widget -->
    <div v-if="app.id === 'profile'" class="flex flex-col items-center justify-center h-full p-2 text-center w-full">
      <img :src="profileData.image" alt="Profile" class="w-14 h-14 rounded-full object-cover mb-2 shadow-md border-2 border-white/50" />
      <h3 class="text-gray-800 font-bold text-base leading-tight">{{ profileData.name }}</h3>
      <p class="text-gray-600 text-[10px] mt-1">{{ profileData.role }}</p>
    </div>

    <!-- Gallery Widget -->
    <div v-else-if="app.id === 'gallery'" class="grid grid-cols-2 gap-1 p-1 h-full w-full">
      <div v-for="(img, i) in galleryPreviews" :key="i" class="relative overflow-hidden rounded-md bg-gray-200 aspect-square">
        <img :src="img" class="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>

    <!-- Mail (Contact) Widget -->
    <div v-else-if="app.id === 'mail'" class="flex flex-col items-center justify-center h-full p-4 bg-gradient-to-br from-blue-100/50 to-blue-200/30 w-full">
        <component :is="app.icon" :size="40" weight="duotone" class="text-blue-500 mb-2 drop-shadow-sm" />
        <span class="text-blue-600 font-bold text-xs">Contact Me</span>
    </div>

    <!-- Default App Widget -->
    <div v-else class="flex flex-col items-center justify-center h-full p-4 w-full">
      <component :is="app.icon" :size="48" weight="fill" class="text-gray-700 drop-shadow-md mb-2" />
      <span class="text-gray-800 font-medium text-xs">{{ app.label }}</span>
    </div>

    <!-- Click Overlay -->
    <div v-if="!isEditMode" class="absolute inset-0 z-10" @click="store.openApp(app.id)"></div>
  </div>
</template>
