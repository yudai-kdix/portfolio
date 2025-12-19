import { ref, watch } from 'vue';
import { useOSStore } from '../stores/osStore';

export function useEasterEgg() {
  const store = useOSStore();
  const showResetModal = ref(false);

  const executeReset = () => {
    store.resetApps();
    showResetModal.value = false;
  };

  watch(
    [() => store.gridItems, () => store.dockItems],
    ([grid, dock]) => {
      const hasGridApps = grid.some((item: any) => item.type !== 'empty');
      if (!hasGridApps && dock.length === 0) {
        showResetModal.value = true;
      }
    },
    { deep: true }
  );

  return {
    showResetModal,
    executeReset
  };
}
