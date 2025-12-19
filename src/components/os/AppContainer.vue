<script setup lang="ts">
import { computed } from 'vue';
import { useOSStore, type WindowInstance } from '../../stores/osStore';
import { PhXCircle } from '@phosphor-icons/vue';

const props = defineProps<{
  window: WindowInstance;
}>();

const store = useOSStore();

const isActive = computed(() => store.activeWindowId === props.window.instanceId);

const handleClose = (e: Event) => {
  e.stopPropagation();
  store.closeApp(props.window.instanceId);
};

const handleFocus = () => {
  store.focusApp(props.window.instanceId);
};
</script>

<template>
  <div
    class="absolute top-0 left-0 right-0 bottom-0 md:inset-4 md:bottom-24 bg-white md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] origin-center"
    :class="{
      'scale-90 opacity-0 pointer-events-none translate-y-10': window.state === 'minimized',
      'scale-100 opacity-100 translate-y-0': window.state === 'open' || window.state === 'opening',
      'scale-95 opacity-0 pointer-events-none': window.state === 'closing',
    }"
    :style="{ zIndex: window.zIndex }"
    @mousedown="handleFocus"
    @touchstart="handleFocus"
  >
    <!-- Content -->
    <div class="flex-1 w-full h-full relative overflow-hidden">
      <slot />
    </div>
    
  </div>
</template>
