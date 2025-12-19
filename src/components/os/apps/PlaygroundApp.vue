<script setup lang="ts">
import { PhGameController, PhArrowLeft } from '@phosphor-icons/vue';

defineEmits<{
  (e: 'close'): void;
}>();
</script>

<template>
  <div class="h-full w-full bg-[#1c1c1e] flex flex-col items-center justify-center text-white font-sans">
     <div class="absolute top-0 w-full flex items-center px-5 pt-12 pb-4">
        <button 
            @click="$emit('close')"
            class="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
            <PhArrowLeft size="18" weight="bold" />
        </button>
    </div>
    
    <div class="flex flex-col items-center gap-4">
        <div class="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-500">
            <PhGameController size="48" weight="duotone" />
        </div>
        <h1 class="text-2xl font-bold">Playground</h1>
        <p class="text-white/50 text-sm">Coming Soon</p>
    </div>
  </div>
</template>
