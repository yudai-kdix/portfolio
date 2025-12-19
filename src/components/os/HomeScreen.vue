<script setup lang="ts">
import { ref } from 'vue';
import Icon from './Icon.vue';
import Dock from './Dock.vue';
import PhotoWidget from './PhotoWidget.vue';
import SystemModal from './SystemModal.vue';
import { useOSStore } from '../../stores/osStore';
import draggable from 'vuedraggable';
import { useDynamicLayout } from '../../composables/useDynamicLayout';
import { useAppRemoval } from '../../composables/useAppRemoval';
import { useEasterEgg } from '../../composables/useEasterEgg';

import AppWidget from './AppWidget.vue';

const store = useOSStore();

// --- Composables ---
const { gap, isDesktop } = useDynamicLayout();
const { showRemoveModal, promptRemove, executeRemove } = useAppRemoval();
const { showResetModal, executeReset } = useEasterEgg();

// Edit Mode (Jiggle)
// const isEditMode = ref(false); // Using store
let longPressTimer: ReturnType<typeof setTimeout>;

const startLongPress = () => {
  longPressTimer = setTimeout(() => {
    store.setEditMode(true);
  }, 800);
};

const cancelLongPress = () => {
  clearTimeout(longPressTimer);
};

const handleBackgroundClick = (e: MouseEvent) => {
  // If clicking on 'empty' slot, we treat it as background
  if (store.isEditMode && (e.target === e.currentTarget || (e.target as HTMLElement).closest('.empty-slot'))) {
    store.setEditMode(false);
  }
};

const handleItemClick = (item: any) => {
  if (store.isEditMode) return; 
  store.openApp(item.id);
};
</script>
<template>
  <div 
    class="absolute inset-0 z-0 pt-12"
    @mousedown="handleBackgroundClick"
    @touchstart="handleBackgroundClick"
  >
    <!-- Grid -->
    <draggable
      v-model="store.gridItems"
      class="grid"
      :class="isDesktop ? 'grid-cols-6' : 'grid-cols-4'"
      :style="{ 
          columnGap: gap + 'px', 
          rowGap: gap + 'px',
          paddingLeft: gap + 'px', 
          paddingRight: gap + 'px', 
          paddingBottom: '140px' 
      }"
      item-key="id"
      :animation="250"
      :group="{ name: 'apps', put: true }"
      :disabled="!store.isEditMode"
      :force-fallback="true"
      :fallback-tolerance="3"
      :delay="0"
      :touch-start-threshold="5"
      :fallback-on-body="true"
      fallback-class="sortable-fallback"
    >
      <template #item="{ element }">
        <div
            :data-type="element.type"
            @mousedown="startLongPress" 
            @touchstart="startLongPress" 
            @mouseup="cancelLongPress" 
            @mouseleave="cancelLongPress"
            @touchend="cancelLongPress"
            class="relative flex items-center justify-center transition-all duration-300"
            :class="[
              { 'animate-jiggle': store.isEditMode && element.type !== 'empty' },
              element.type === 'widget' ? 'col-span-2 row-span-2 aspect-auto' : 'aspect-square',
              element.type === 'empty' ? 'empty-slot' : ''
            ]"
        >
            <PhotoWidget 
                v-if="element.type === 'widget'" 
                :class="{ 'pointer-events-none': store.isEditMode }" 
            />
            
            <AppWidget
                v-else-if="element.type === 'app' && isDesktop"
                :app="element"
                :is-edit-mode="store.isEditMode"
                :class="{ 'pointer-events-none': store.isEditMode }"
            />

            <Icon
                v-else-if="element.type === 'app'"
                :icon="element.icon"
                :label="element.label"
                @click="!store.isEditMode && store.openApp(element.id)"
                :class="{ 'pointer-events-none': store.isEditMode }"
            />
            
            <!-- Empty Slot -->
            <div v-else class="w-full h-full"></div>

            <!-- Remove Button -->
             <div 
                v-if="store.isEditMode && element.type !== 'empty'" 
                @click.stop="promptRemove(element)"

                @mousedown.stop
                @touchstart.stop
                class="absolute -top-2 -left-2 z-20 bg-gray-400 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg opacity-90 animate-none cursor-pointer hover:bg-gray-500 active:scale-95 transition-colors"
                title="非表示にする"
             >
                 <span class="text-xs font-bold leading-none">-</span>
             </div>
        </div>
      </template>
    </draggable>

    <!-- Dock -->
    <Dock />
    
    <!-- Confirm Remove Modal -->
    <SystemModal
      :is-open="showRemoveModal"
      title="ホーム画面から取り除く"
      message="アプリケーションを非表示にしますか？&#13;&#10;※リロードを行うとリセットされます。"
      confirm-text="非表示"
      @confirm="executeRemove"
      @cancel="showRemoveModal = false"
    />

    <!-- Easter Egg Modal (All Apps Removed) -->
    <SystemModal
      :is-open="showResetModal"
      title="警告"
      message="全部消したの……？ひどい……"
      confirm-text="リセットする"
      :show-cancel="false"
      @confirm="executeReset"
    />
  </div>
</template>


<style scoped>
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
/* Drag Visuals - Global Scope */
.sortable-fallback {
    opacity: 1 !important;
    z-index: 9999 !important;
    cursor: grabbing;
    pointer-events: none;
    display: block !important;
    visibility: visible !important;
    animation: none !important;
    transition: none !important;
}
/* Hide the original element while dragging (the placeholder) */
.sortable-ghost {
    opacity: 0 !important;
    visibility: hidden !important; 
}
</style>
