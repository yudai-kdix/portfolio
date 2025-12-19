<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { 
  PhWifiHigh, 
  PhWifiSlash,
  PhBatteryFull, 
  PhBatteryMedium, 
  PhBatteryLow, 
  PhBatteryWarning, 
  PhBatteryCharging,
  PhCellSignalFull,
  PhCellSignalX
} from '@phosphor-icons/vue';

// --- Time ---
const time = ref('');

const updateTime = () => {
  const now = new Date();
  time.value = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  });
};

// --- Battery ---
const batteryLevel = ref(1);
const isCharging = ref(false);
const isBatterySupported = ref(false);

const updateBatteryUI = (battery: any) => {
  batteryLevel.value = battery.level;
  isCharging.value = battery.charging;
};

// --- Network ---
const isOnline = ref(true);

const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine;
};

/* Icons based on state */
const BatteryIcon = computed(() => {
  if (isCharging.value) return PhBatteryCharging;
  if (batteryLevel.value > 0.8) return PhBatteryFull;
  if (batteryLevel.value > 0.4) return PhBatteryMedium;
  if (batteryLevel.value > 0.1) return PhBatteryLow;
  return PhBatteryWarning;
});

const WifiIcon = computed(() => isOnline.value ? PhWifiHigh : PhWifiSlash);
const SignalIcon = computed(() => isOnline.value ? PhCellSignalFull : PhCellSignalX);

let timer: ReturnType<typeof setInterval>;

onMounted(async () => {
  // Time
  updateTime();
  timer = setInterval(updateTime, 1000);

  // Battery
  if ('getBattery' in navigator) {
    try {
      isBatterySupported.value = true;
      const battery = await (navigator as any).getBattery();
      updateBatteryUI(battery);
      
      battery.addEventListener('levelchange', () => updateBatteryUI(battery));
      battery.addEventListener('chargingchange', () => updateBatteryUI(battery));
    } catch (e) {
      console.warn('Battery API failed', e);
    }
  }

  // Network
  if (typeof window !== 'undefined') {
    isOnline.value = navigator.onLine;
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
  }
});

onUnmounted(() => {
  clearInterval(timer);
  window.removeEventListener('online', updateOnlineStatus);
  window.removeEventListener('offline', updateOnlineStatus);
});
</script>

<template>
  <div class="fixed top-0 left-0 right-0 h-12 pt-2 px-6 flex items-start justify-between text-white text-xs font-semibold z-50 pointer-events-none mix-blend-difference">
    <!-- Left: Time -->
    <div class="w-20 text-center tracking-wide text-[14px]">
      {{ time }}
    </div>

    <!-- Right: Status Icons -->
    <div class="flex items-center justify-end gap-1.5 min-w-[80px]">
      <component :is="SignalIcon" :size="18" weight="fill" />
      <component :is="WifiIcon" :size="18" weight="bold" />
      
      <!-- Battery Text & Icon -->
      <div class="flex items-center ml-1">
         <span v-if="isBatterySupported && isCharging" class="text-[10px] mr-1">⚡</span>
         <span v-else-if="isBatterySupported" class="text-[10px] mr-1">{{ Math.round(batteryLevel * 100) }}%</span>
         <component 
            :is="BatteryIcon" 
            :size="24" 
            weight="fill" 
            :class="{'text-red-500': !isCharging && batteryLevel <= 0.2, 'text-green-400': isCharging}" 
         />
      </div>
    </div>
  </div>
</template>
