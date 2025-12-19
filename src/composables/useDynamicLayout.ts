import { onMounted, onUnmounted, ref } from 'vue';

export function useDynamicLayout(iconSize = 60) {
  const gap = ref(20);

  const updateLayout = () => {
    // SSR Check
    if (typeof window === 'undefined') return;

    const width = window.innerWidth;
    // Calculate gap to fit 4 columns evenly with equal outer padding
    // 5 gaps (left, between*3, right) for 4 columns
    const calculated = (width - (4 * iconSize)) / 5;
    gap.value = Math.max(10, calculated); // Min 10px
  };

  onMounted(() => {
    updateLayout();
    window.addEventListener('resize', updateLayout);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateLayout);
  });

  return {
    gap
  };
}
