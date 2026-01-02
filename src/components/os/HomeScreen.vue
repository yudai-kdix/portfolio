<script setup lang="ts">
import { ref } from 'vue';
import draggable from 'vuedraggable';
import { useAppRemoval } from '../../composables/useAppRemoval';
import { useDynamicLayout } from '../../composables/useDynamicLayout';
import { useEasterEgg } from '../../composables/useEasterEgg';
import { useOSStore } from '../../stores/osStore';
import Dock from './Dock.vue';
import Icon from './Icon.vue';
import PhotoWidget from './PhotoWidget.vue';
import SystemModal from './SystemModal.vue';

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

const handleBackgroundClick = (e: MouseEvent | TouchEvent) => {
  // If clicking on 'empty' slot, we treat it as background
  if (store.isEditMode && (e.target === e.currentTarget || (e.target as HTMLElement).closest('.empty-slot'))) {
    store.setEditMode(false);
  }
};

const handleItemClick = (item: any) => {
  if (store.isEditMode) return; 
  store.openApp(item.id);
};

// --- Mobile Pagination Helpers ---
import { computed } from 'vue';
const pageSize = 16;

const createPageComputed = (pageIndex: number) => {
    return computed({
        get: () => {
            const start = pageIndex * pageSize;
            return store.gridItems.slice(start, start + pageSize);
        },
        set: (newVal) => {
            // Prevent Reflow Logic
            const updatedPage = [...newVal];
            
            // 1. If item removed (dragged out), fill with empty slots
            while (updatedPage.length < pageSize) {
                updatedPage.push({ 
                    id: `empty-${Date.now()}-${Math.random()}`, 
                    type: 'empty' 
                });
            }
            
            // 2. If item added (dragged in), remove empty slots to fit
            while (updatedPage.length > pageSize) {
                // Find last empty slot to remove
                const emptyIndex = updatedPage.map(x => x.type).lastIndexOf('empty');
                if (emptyIndex !== -1) {
                    updatedPage.splice(emptyIndex, 1);
                } else {
                    // No empty slots? Remove the last item (overflow protection)
                    updatedPage.pop();
                }
            }
            
            const current = [...store.gridItems];
            const start = pageIndex * pageSize;
            
            // We now have exactly 'pageSize' items.
            // But we must be careful: if we splice into 'current' blindly, does it affect other pages?
            // Since we enforce updatedPage.length === pageSize, splicing it in REPLACE mode (deleteCount=pageSize)
            // ensures the total length of gridItems remains unchanged.
            // Thus, indices of subsequent pages remain unchanged.
            
            current.splice(start, pageSize, ...updatedPage);
            store.gridItems = current;
        }
    });
};

const pages = [
    createPageComputed(0),
    createPageComputed(1)
];

const currentPage = ref(0);
const scrollContainer = ref<HTMLElement | null>(null);
const isDragging = ref(false);

const onScroll = (e: Event) => {
    const target = e.target as HTMLElement;
    const width = target.clientWidth;
    const scroll = target.scrollLeft;
    currentPage.value = Math.round(scroll / width);
};

// --- Auto Scroll Logic ---
let autoScrollRaf: number;
let pointerX = 0;

const updatePointerPosition = (e: MouseEvent | TouchEvent) => {
    if (e instanceof MouseEvent) {
        pointerX = e.clientX;
    } else if (e.touches && e.touches.length > 0) {
        pointerX = e.touches[0].clientX;
    }
};

const startAutoScroll = () => {
    if (!scrollContainer.value) return;
    
    const container = scrollContainer.value;
    const threshold = 80; // px from edge
    const speed = 25; // scroll speed
    
    const loop = () => {
        if (!isDragging.value) return;
        
        const rect = container.getBoundingClientRect();
        
        // Right Edge
        if (pointerX > rect.right - threshold) {
            container.scrollLeft += speed;
        }
        // Left Edge
        else if (pointerX < rect.left + threshold) {
            container.scrollLeft -= speed;
        }
        
        autoScrollRaf = requestAnimationFrame(loop);
    };
    loop();
};

const onDragStart = () => {
    isDragging.value = true;
    window.addEventListener('mousemove', updatePointerPosition);
    window.addEventListener('touchmove', updatePointerPosition);
    startAutoScroll();
};

const onDragEnd = () => {
    isDragging.value = false;
    window.removeEventListener('mousemove', updatePointerPosition);
    window.removeEventListener('touchmove', updatePointerPosition);
    cancelAnimationFrame(autoScrollRaf);
};
</script>
<template>
  <div 
    class="absolute inset-0 z-0 pt-12"
    @mousedown="handleBackgroundClick"
    @touchstart="handleBackgroundClick"
  >
    <!-- Grid -->
    <!-- Unified Paged Grid -->
    <div 
        class="w-full h-full flex overflow-x-auto scrollbar-hide pb-[140px]"
        :class="[
            { 'snap-x snap-mandatory': !isDragging },
            isDesktop ? 'pt-0' : 'pt-3'
        ]"
        ref="scrollContainer"
        @scroll="onScroll"
    >
        <div 
            v-for="(page, i) in pages" 
            :key="i"
            class="w-full h-full shrink-0 snap-center px-4"
        >
             <draggable
                v-model="page.value"
                class="grid"
                :class="isDesktop ? 'grid-cols-6' : 'grid-cols-4'"
                :style="{ columnGap: gap + 'px', rowGap: gap + 'px' }"
                item-key="id"
                :animation="250"
                :group="{ name: 'apps', put: true }"
                :disabled="!store.isEditMode"
                :force-fallback="true"
                fallback-class="sortable-fallback"
                :delay="isDesktop ? 0 : 200"
                :delay-on-touch-only="true"
                @start="onDragStart"
                @end="onDragEnd"
             >
                 <template #item="{ element }">
                    <div
                        :data-type="element.type"
                        @mousedown="startLongPress"
                        @touchstart="startLongPress" 
                        @touchend="cancelLongPress"
                        @contextmenu.prevent="startLongPress"
                        class="relative flex items-center justify-center transition-all duration-300"
                        :class="[
                            { 'animate-jiggle': store.isEditMode && element.type !== 'empty' },
                            element.type === 'widget' ? 'col-span-2 row-span-2 aspect-auto' : 'aspect-square',
                            element.type === 'empty' ? 'empty-slot' : ''
                        ]"
                    >
                        <!-- Widget (Profile) -->
                        <PhotoWidget 
                            v-if="element.type === 'widget'" 
                            :class="{ 'pointer-events-none': store.isEditMode }" 
                        />
                        
                        <!-- Desktop Card App -->
                        <AppWidget
                            v-else-if="element.type === 'app' && isDesktop"
                            :app="element"
                            :is-edit-mode="store.isEditMode"
                            :class="{ 'pointer-events-none': store.isEditMode }"
                        />

                        <!-- Mobile Icon App -->
                         <Icon
                            v-else-if="element.type === 'app'"
                            :icon="element.icon"
                            :label="element.label"
                            @click="!store.isEditMode && store.openApp(element.id)"
                            :class="{ 'pointer-events-none': store.isEditMode }"
                        />
                        
                        <!-- Empty Slot -->
                        <div v-else class="w-full h-full pointer-events-none"></div>

                         <!-- Remove Button -->
                         <div 
                            v-if="store.isEditMode && element.type !== 'empty'" 
                            @click.stop="promptRemove(element)"
                            @touchstart.stop
                            class="absolute -top-2 -left-2 z-20 bg-gray-400 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg opacity-90 animate-none cursor-pointer hover:bg-gray-500 active:scale-95 transition-colors"
                         >
                             <span class="text-xs font-bold leading-none">-</span>
                         </div>
                    </div>
                 </template>
             </draggable>
        </div>
    </div>
    
    <!-- Mobile Pagination Dots -->
    <div v-if="!isDesktop" class="absolute bottom-[115px] left-0 right-0 flex justify-center gap-2 pointer-events-none z-10 transition-opacity duration-300">
        <div 
            v-for="i in 2" 
            :key="i" 
            class="w-2 h-2 rounded-full transition-colors duration-300 shadow-sm backdrop-blur-sm"
            :class="currentPage === (i-1) ? 'bg-white' : 'bg-white/40'"
        ></div>
    </div>

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

/* Cross-browser no-scrollbar */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
