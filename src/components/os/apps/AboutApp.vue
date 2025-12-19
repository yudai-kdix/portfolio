<script setup lang="ts">
import { PhDesktop, PhCode, PhPaintBrush, PhDatabase, PhPuzzlePiece, PhRocket, PhCaretLeft } from '@phosphor-icons/vue';

const emit = defineEmits(['close']);

const techs = [
    { name: 'Astro', desc: 'Static Site Generator', icon: PhRocket, color: 'text-orange-500' },
    { name: 'Vue 3', desc: 'JavaScript Framework', icon: PhDesktop, color: 'text-green-500' },
    { name: 'TypeScript', desc: 'Type Safety', icon: PhCode, color: 'text-blue-500' },
    { name: 'Tailwind CSS', desc: 'Utility-first CSS', icon: PhPaintBrush, color: 'text-cyan-400' },
    { name: 'Pinia', desc: 'State Management', icon: PhDatabase, color: 'text-yellow-500' },
];
</script>

<template>
  <div class="h-full w-full bg-white overflow-y-auto relative">
    <!-- Header -->
    <div class="p-6 pb-2 text-center relative">
        <button 
            @click="emit('close')" 
            class="absolute top-6 left-6 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
        >
            <PhCaretLeft :size="24" />
        </button>
        
        <h2 class="text-2xl font-bold text-gray-800 mb-1 pt-2">Portfolio App</h2>
        <p class="text-sm text-gray-500">v1.0.0</p>
    </div>

    <!-- Tech List -->
    <div class="px-6 pb-8 max-w-2xl mx-auto">
        <h3 class="text-sm uppercase tracking-wider text-gray-400 font-bold mb-4 px-2">Tech Stack</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div 
                v-for="tech in techs" 
                :key="tech.name"
                class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-300"
            >
                <div class="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-100">
                    <component :is="tech.icon" :size="20" weight="duotone" :class="tech.color" />
                </div>
                <div>
                    <h4 class="font-bold text-gray-800 text-sm">{{ tech.name }}</h4>
                    <p class="text-xs text-gray-500">{{ tech.desc }}</p>
                </div>
            </div>
        </div>

        <div class="mt-8 text-center">
            <p class="text-xs text-gray-400">
                Created by Yudai Homma
            </p>
        </div>
    </div>
  </div>
</template>
