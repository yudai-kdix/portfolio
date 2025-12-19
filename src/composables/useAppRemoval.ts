import { ref } from 'vue';
import { useOSStore } from '../stores/osStore';

export function useAppRemoval() {
  const store = useOSStore();
  const showRemoveModal = ref(false);
  const itemToRemove = ref<any>(null);

  const promptRemove = (item: any) => {
    console.log('useAppRemoval: promptRemove', item);
    itemToRemove.value = item;
    showRemoveModal.value = true;
  };

  const executeRemove = () => {
    console.log('useAppRemoval: executeRemove', itemToRemove.value);
    if (itemToRemove.value) {
      store.removeApp(itemToRemove.value.id);
      itemToRemove.value = null;
    }
    showRemoveModal.value = false;
  };

  return {
    showRemoveModal,
    promptRemove,
    executeRemove
  };
}
