<script setup lang="ts">
import { PhArrowLeft, PhFrameCorners } from '@phosphor-icons/vue';

// Gallery Data from public/gallery
// Gallery Data from public/gallery
const photos = [
  { date: '2025/01/01', title: '近所の駐車場', src: '/gallery/20250101.jpg' },
  { date: '2025/05/04', title: '京都のどこか', src: '/gallery/20250504.jpg' },
  { date: '2025/05/27', title: '万博', src: '/gallery/20250527.jpg' },
  { date: '2025/07/21', title: '万博', src: '/gallery/20250721.jpg' },
  { date: '2025/11/10', title: '万博記念公園 (1)', src: '/gallery/20251110_1.jpg' },
  { date: '2025/11/10', title: '万博記念公園 (2)', src: '/gallery/20251110_2.jpg' },
  { date: '2025/11/23', title: '京都 (1)', src: '/gallery/20251123_1.jpg' },
  { date: '2025/11/23', title: '京都 (2)', src: '/gallery/20251123_2.jpg' },
  { date: '2025/11/23', title: '京都 (3)', src: '/gallery/20251123_3.jpg' },
  { date: '2025/11/23', title: '京都 (4)', src: '/gallery/20251123_4.jpg' },
  { date: '2025/11/30', title: '東京', src: '/gallery/20251130.jpg' },
].map(p => ({
  ...p,
  src: import.meta.env.BASE_URL + p.src
}));

defineEmits<{
  (e: 'close'): void;
}>();
</script>

<template>
  <div class="h-full w-full bg-[#4A3627] flex flex-col text-white font-sans selection:bg-white/20">
    <!-- Header -->
    <div class="flex items-center justify-between px-5 pt-12 pb-4 bg-[#4A3627]/90 backdrop-blur-md sticky top-0 z-20 border-b border-white/10">
        <h1 class="text-2xl font-bold tracking-tight">Gallery</h1>
        <button 
            @click="$emit('close')"
            class="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
            <PhArrowLeft size="18" weight="bold" />
        </button>
    </div>

    <!-- Scroll Content -->
    <div class="flex-1 overflow-y-auto px-5 pb-20">
        <p class="mt-4 mb-8 text-white/60 text-sm leading-relaxed max-w-lg">
            風景が好きです。自然が好きです。<br>
            それらを切り取れる写真が好きです。<br><br>

            全部iPhoneSEで撮っています。<br>
            本格的なカメラも欲しいですね。
        </p>

        <!-- Masonry-ish Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
                v-for="(photo, index) in photos" 
                :key="index"
                class="group flex flex-col gap-3"
            >
                <div class="relative overflow-hidden rounded-lg shadow-lg aspect-auto bg-[#2a2a2a] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300">
                    <!-- Frame Effect -->
                    <div class="absolute inset-0 border-[10px] border-white/5 pointer-events-none z-10 group-hover:border-white/10 transition-colors"></div>
                    
                    <img 
                        :src="photo.src" 
                        :alt="photo.title"
                        class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    <!-- Overlay Info -->
                    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-between items-end z-20">
                         <span class="text-sm font-medium text-white/90">{{ photo.title }}</span>
                         <span class="text-xs font-light text-white/60 font-mono">{{ photo.date }}</span>
                    </div>
                </div>
                
                <!-- Explicit Info (Mobile friendly) -->
                <div class="flex justify-between items-baseline px-1 md:hidden">
                    <h3 class="font-medium text-sm text-gray-200">{{ photo.title }}</h3>
                    <span class="text-xs text-gray-500 font-mono">{{ photo.date }}</span>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>
