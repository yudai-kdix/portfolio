import { onMounted, onUnmounted, ref } from 'vue';

export function useDynamicLayout(iconSize = 60) {
  const gap = ref(20);
  const isDesktop = ref(false);

  const updateLayout = () => {
    // SSR Check
    if (typeof window === 'undefined') return;

    const width = window.innerWidth;
    isDesktop.value = width >= 768; // Desktop/Tablet breakpoint

    if (isDesktop.value) {
      // Desktop: Fixed reasonable gap, let widgets expand in grid
      gap.value = 24; 
    } else {
      // Mobile: Fixed icon size (60px), expand gap to fit 4 columns
      const columns = 4;
      const calculated = (width - (columns * iconSize)) / (columns + 1);
      gap.value = Math.max(10, calculated);
    }
  };

  onMounted(() => {
    updateLayout();
    window.addEventListener('resize', updateLayout);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateLayout);
  });

  return {
    gap,
    isDesktop
  };
}
