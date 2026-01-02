<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useOSStore } from '../../stores/osStore';
import { PhLockOpen } from '@phosphor-icons/vue';

const store = useOSStore();

// --- Time & Date ---
const time = ref('');
const date = ref('');

const updateTime = () => {
  const now = new Date();
  time.value = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', hour12: false });
  date.value = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
};

let timer: ReturnType<typeof setInterval>;
onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
});
onUnmounted(() => {
  clearInterval(timer);
});

// --- View State ---
const showPasscode = ref(false); // false = clock view, true = passcode view

const onScreenClick = () => {
    if (!showPasscode.value) {
        showPasscode.value = true;
        startHintAnimation();
    }
};

// --- Passcode Logic ---
const input = ref<number[]>([]);
const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

// Hint Logic
const hintSequence = [0, 2, 2, 2];
const activeHintKey = ref<number | null>(null);

const startHintAnimation = () => {
    let index = 0;
    const interval = setInterval(() => {
        if (!store.isLocked || !showPasscode.value) {
            clearInterval(interval);
            activeHintKey.value = null;
            return;
        }
        
        // Highlight current hint key
        activeHintKey.value = hintSequence[index];
        
        // Move to next after short delay
        setTimeout(() => {
            activeHintKey.value = null;
        }, 600); // Highlight duration

        index = (index + 1) % hintSequence.length;
    }, 1200); // Interval between highlights
};

const handleKeyClick = (num: number) => {
    if (input.value.length < 4) {
        input.value.push(num);
        
        if (input.value.length === 4) {
            const pass = input.value.join('');
            if (pass === '0222') {
                store.showNotification('Calendar', "2/22はゆうだいの誕生日！", null);
            }
            // Check pass (Always valid as per user req)
            setTimeout(() => {
                unlock();
            }, 300);
        }
    }
};

const handleDelete = () => {
    input.value.pop();
};

const unlock = () => {
    store.isLocked = false;
};
</script>

<template>
  <div 
    class="absolute inset-0 z-50 flex flex-col items-center justify-center text-white transition-all duration-500 overflow-hidden"
    :class="showPasscode ? 'bg-black/40 backdrop-blur-xl' : 'bg-transparent backdrop-blur-sm'"
    @click.self="onScreenClick"
  >
    <!-- Clock View -->
    <div 
        v-if="!showPasscode" 
        class="w-full h-full relative cursor-pointer animate-fade-in-up"
        @click="onScreenClick"
    >
        <div class="absolute top-16 left-0 right-0 flex flex-col items-center">
            <PhLockOpen :size="24" weight="fill" class="mb-2 opacity-60" />
            <h1 class="text-6xl font-light tracking-tighter drop-shadow-md font-mono opacity-80">{{ time }}</h1>
            <p class="text-lg font-normal tracking-wide opacity-80">{{ date }}</p>
        </div>
        
        <div class="absolute bottom-24 left-0 right-0 flex justify-center">
            <div class="animate-bounce text-base font-bold tracking-widest drop-shadow-md">
                TAP TO UNLOCK
            </div>
        </div>
    </div>

    <!-- Passcode View -->
    <div v-else class="flex flex-col items-center animate-fade-in w-full max-w-sm">
        <div class="mb-4 text-sm font-light tracking-widest opacity-70">Any Passcode OK</div>
        <div class="mb-12 flex gap-4">
            <div 
                v-for="i in 4" 
                :key="i"
                class="w-4 h-4 rounded-full border border-white/50 transition-all duration-200"
                :class="input.length >= i ? 'bg-white' : 'bg-transparent'"
            ></div>
        </div>

        <div class="grid grid-cols-3 gap-x-8 gap-y-6 w-full px-8">
            <button 
                v-for="key in [1,2,3,4,5,6,7,8,9]" 
                :key="key"
                @click="handleKeyClick(key)"
                class="w-20 h-20 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-3xl font-light transition-all duration-200 active:scale-95"
                :class="{ 'ring-4 ring-blue-400/50 bg-white/30': activeHintKey === key }"
            >
                {{ key }}
            </button>
            <div class="w-20"></div> <!-- Placeholder for alignment -->
            <button 
                @click="handleKeyClick(0)"
                class="w-20 h-20 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-3xl font-light transition-all duration-200 active:scale-95"
                :class="{ 'ring-4 ring-blue-400/50 bg-white/30': activeHintKey === 0 }"
            >
                0
            </button>
            <button 
                v-if="input.length > 0"
                @click="handleDelete"
                class="w-20 h-20 flex items-center justify-center text-sm font-medium transition-opacity active:opacity-50"
            >
                Cancel
            </button>
        </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out;
}
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
