<script setup lang="ts">
import { PhMusicNote } from '@phosphor-icons/vue';
</script>

<template>
  <div class="h-full w-full bg-gradient-to-br from-pink-500 to-purple-600 flex flex-col items-center justify-center text-white">
    <div class="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 animate-pulse">
        <PhMusicNote :size="40" weight="fill" />
    </div>
    <h2 class="text-xl font-bold mb-1">Music</h2>
    <p class="text-sm opacity-80">Coming Soon...</p>
  </div>
</template>
