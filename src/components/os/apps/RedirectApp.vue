<script setup lang="ts">
import { onMounted } from 'vue';
import { PhArrowSquareOut } from '@phosphor-icons/vue';

const props = defineProps<{
  url: string;
  label: string;
  isMail?: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

onMounted(() => {
  setTimeout(() => {
    if (props.isMail) {
      window.location.href = props.url;
    } else {
      window.open(props.url, '_blank');
    }
    
    // Optional: Close app after redirecting?
    // User said "アニメーションだけいれてそのあとそれぞれのリンク先を開く"
    // Usually on mobile, the app stays "open" in background or transitions to the other app.
    // But since this is a "Redirect" app in a portfolio, better to close it so user returns to clean state.
    // Let's give it a slight delay so user sees "Opening..." then it closes.
    setTimeout(() => {
      emit('close');
    }, 500);
  }, 800); // Wait for open animation (approx 500ms) + buffer
});
</script>

<template>
  <div class="h-full w-full bg-gray-100 flex flex-col items-center justify-center text-gray-500 font-sans">
    <div class="flex flex-col items-center gap-4 animate-pulse">
        <PhArrowSquareOut size="48" />
        <p class="text-sm font-medium">Opening {{ label }}...</p>
    </div>
  </div>
</template>
