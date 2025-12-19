<script setup lang="ts">
import { ref } from 'vue';
import Icon from './Icon.vue';
import { useOSStore } from '../../stores/osStore';
import draggable from 'vuedraggable';
import SystemModal from './SystemModal.vue';

const store = useOSStore();

// Remove local dockApps, use store.dockItems

let longPressTimer: ReturnType<typeof setTimeout>;

const startLongPress = () => {
  longPressTimer = setTimeout(() => {
    store.setEditMode(true);
  }, 800);
};

const cancelLongPress = () => {
  clearTimeout(longPressTimer);
};

const checkDockPut = (to: any, from: any, dragEl: HTMLElement) => {
  if (to.el === from.el) return true;
  if (store.dockItems.length >= 4) return false;
  if (dragEl.dataset.type === 'widget') return false;
  return true;
};

// --- App Removal Logic ---
const showRemoveModal = ref(false);
const itemToRemove = ref<any>(null);

const promptRemove = (item: any) => {
  console.log('Dock: promptRemove', item);
  itemToRemove.value = item;
  showRemoveModal.value = true;
};

const executeRemove = () => {
  console.log('Dock: executeRemove', itemToRemove.value);
  if (itemToRemove.value) {
    store.removeApp(itemToRemove.value.id);
    itemToRemove.value = null;
  }
  showRemoveModal.value = false;
};
</script>

<template>
  <div class="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
    <draggable 
        v-model="store.dockItems"
        class="flex items-end justify-center gap-5 px-5 py-4 bg-white/20 backdrop-blur-2xl rounded-[30px] border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.2)] dock-container w-[335px]"
        item-key="id"
        :animation="250"
        :group="{ name: 'apps', put: checkDockPut }"
        :disabled="!store.isEditMode"
        :force-fallback="true"
        :fallback-tolerance="3"
        :touch-start-threshold="5"
        :fallback-on-body="true"
        fallback-class="dock-sortable-fallback"
    >
      <template #item="{ element }">
        <div 
          class="relative"
          :data-type="element.type"
          @mousedown="startLongPress" 
          @touchstart="startLongPress" 
          @mouseup="cancelLongPress" 
          @mouseleave="cancelLongPress"
          @touchend="cancelLongPress"
          :class="{ 'animate-jiggle': store.isEditMode }"
        >
            <Icon
                :icon="element.icon"
                :label="element.label"
                size="md"
                @click="!store.isEditMode && store.openApp(element.id)"
                class="dock-icon"
                :class="{ 'pointer-events-none': store.isEditMode }"
            />
            
            <!-- Remove Button -->
             <div 
                v-if="store.isEditMode" 
                @click.stop="promptRemove(element)"
                @mousedown.stop
                @touchstart.stop
                class="absolute -top-2 -left-2 z-20 bg-gray-400 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg opacity-90 animate-none cursor-pointer hover:bg-gray-500 active:scale-95 transition-colors"
             >
                 <span class="text-xs font-bold leading-none">-</span>
             </div>
        </div>
      </template>
    </draggable>
    
    <!-- Confirm Modal -->
    <SystemModal
      :is-open="showRemoveModal"
      title="ホーム画面から取り除く"
      message="アプリケーションを非表示にしますか？&#13;&#10;※リロードを行うとリセットされます。"
      confirm-text="非表示"
      @confirm="executeRemove"
      @cancel="showRemoveModal = false"
    />
  </div>
</template>

<style scoped>
:deep(.dock-icon span.text-\[11px\]) {
    display: none;
}
@keyframes jiggle {
  0% { transform: rotate(-1deg); }
  50% { transform: rotate(1.5deg); }
  100% { transform: rotate(-1.5deg); }
}
.animate-jiggle {
  animation: jiggle 0.25s infinite alternate ease-in-out;
}
.animate-jiggle:nth-child(even) {
  animation-delay: 0.1s;
}
</style>

<style>
/* Dock Drag Visuals - Global */
.dock-sortable-fallback {
    opacity: 1 !important;
    z-index: 9999 !important;
    cursor: grabbing;
    pointer-events: none;
    display: block !important;
    visibility: visible !important;
    animation: none !important;
    transition: none !important;
}
/* Re-hide label in fallback if needed, but deep scoped selector might not apply to fallback in body */
.dock-sortable-fallback span.text-\[11px\] {
    display: none !important;
}
</style>
