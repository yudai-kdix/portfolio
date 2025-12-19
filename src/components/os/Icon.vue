<script setup lang="ts">
import type { Component } from 'vue';

interface Props {
  icon: String | Component;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  isDark?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  isDark: false,
});

const emit = defineEmits<{
  (e: 'click'): void;
}>();
</script>

<template>
  <div
    class="flex flex-col items-center gap-1 cursor-pointer group active:scale-95 transition-transform duration-200"
    @click="emit('click')"
  >
    <div
      class="relative flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 shadow-md group-hover:brightness-105 transition-all text-gray-700"
      :class="[
        {
          'w-[50px] h-[50px] rounded-[11px]': size === 'sm',
          'w-[60px] h-[60px] rounded-[13px]': size === 'md',
          'w-[70px] h-[70px] rounded-[16px]': size === 'lg',
        },
      ]"
    >
        <!-- Icon Content -->
         <component 
            v-if="typeof icon !== 'string'" 
            :is="icon" 
            :size="32" 
            weight="duotone"
            class="filter drop-shadow-sm" 
         />
         <span v-else class="text-3xl select-none filter drop-shadow-sm">{{ icon }}</span>
    </div>
    <span 
        class="text-[11px] font-medium tracking-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] text-center w-full px-1 truncate leading-tight"
    >
      {{ label }}
    </span>
  </div>
</template>
