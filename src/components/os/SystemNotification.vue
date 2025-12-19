<script setup lang="ts">
import { useOSStore } from '../../stores/osStore';
import { PhCake } from '@phosphor-icons/vue';

const store = useOSStore();
</script>

<template>
  <div class="absolute top-4 left-0 right-0 z-[60] flex justify-center pointer-events-none">
    <div 
        v-if="store.notification?.visible"
        class="w-[90%] max-w-sm bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl rounded-2xl flex items-center p-3 gap-3 animate-notification-slide pointer-events-auto cursor-pointer"
        @click="store.notification.visible = false"
    >
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-red-400 flex items-center justify-center text-white shadow-sm shrink-0">
            <component :is="store.notification.icon || PhCake" :size="20" weight="fill" />
        </div>
        <div class="flex-1 min-w-0">
            <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wide opacity-80">{{ store.notification.title }}</h4>
            <p class="text-sm font-medium text-gray-900 leading-tight truncate">{{ store.notification.message }}</p>
        </div>
    </div>
  </div>
</template>

<style scoped>
.animate-notification-slide {
    animation: slideDown 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideDown {
    from { transform: translateY(-100px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}
</style>
