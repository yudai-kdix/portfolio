<script setup lang="ts">


interface Props {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isOpen: boolean;
  showCancel?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showCancel: true,
});

const emit = defineEmits(['confirm', 'cancel']);

const onConfirm = () => {
    console.log('SystemModal: confirm clicked');
    emit('confirm');
};

const onCancel = () => {
    console.log('SystemModal: cancel clicked');
    emit('cancel');
};
</script>

<template>
  <Teleport to="body">
    <div 
      v-if="isOpen"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity"
      @click.self="showCancel !== false ? emit('cancel') : null"
    >
      <div class="bg-white/80 backdrop-blur-xl w-[270px] rounded-[14px] overflow-hidden text-center shadow-2xl scale-100 animate-popIn">
        <div class="p-4 pt-5">
          <h3 v-if="title" class="text-[17px] font-semibold text-gray-900 mb-1">{{ title }}</h3>
          <p class="text-[13px] leading-tight text-gray-900 whitespace-pre-wrap">{{ message }}</p>
        </div>
        
        <div class="flex border-t border-gray-300/50">
          <button 
            v-if="showCancel !== false"
            @click="onCancel"
            class="flex-1 py-3 text-[17px] text-[#007AFF] font-normal hover:bg-gray-200/50 active:bg-gray-300/50 transition-colors border-r border-gray-300/50"
          >
            {{ cancelText || 'キャンセル' }}
          </button>
          <button 
            @click="onConfirm"
            class="flex-1 py-3 text-[17px] text-[#007AFF] font-bold hover:bg-gray-200/50 active:bg-gray-300/50 transition-colors"
          >
            {{ confirmText || 'OK' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
@keyframes popIn {
  0% { transform: scale(1.1); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
.animate-popIn {
  animation: popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
</style>
