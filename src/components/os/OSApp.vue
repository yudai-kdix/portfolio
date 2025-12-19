<script setup lang="ts">
import { onMounted } from 'vue';
import { useOSStore } from '../../stores/osStore';
import HomeScreen from './HomeScreen.vue';
import WindowManager from './WindowManager.vue';
import StatusBar from './StatusBar.vue';
import LockScreen from './LockScreen.vue';
import SystemNotification from './SystemNotification.vue';

const store = useOSStore();

onMounted(() => {
  store.syncFromHash();
  
  const handleHashChange = () => {
    store.syncFromHash();
  };

  window.addEventListener('hashchange', handleHashChange);
  window.addEventListener('popstate', handleHashChange); // Handle History Back
});
</script>

<template>
  <div class="fixed inset-0 w-full h-full overflow-hidden bg-black text-gray-900 font-sans select-none antialiased">
    <!-- Background Layer: iOS 17-ish inspired mesh gradient -->
    <div class="absolute inset-0 z-0 bg-[#ffd1ff]">
        <div class="absolute top-0 -left-4 w-72 h-72 bg-[#845ec2] rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-blob"></div>
        <div class="absolute top-0 -right-4 w-72 h-72 bg-[#ff6f91] rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-blob animation-delay-2000"></div>
        <div class="absolute -bottom-8 left-20 w-72 h-72 bg-[#f9f871] rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-blob animation-delay-4000"></div>
        <div class="absolute bottom-0 right-20 w-72 h-72 bg-[#00c9a7] rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-blob animation-delay-6000"></div>
        <!-- Noise overlay for texture -->
        <div class="absolute inset-0 opacity-20 pointer-events-none" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%221%22/%3E%3C/svg%3E');"></div>
    </div>

    <!-- UI Layer -->
    <div class="relative z-10 w-full h-full flex flex-col transition-all duration-500" :class="{ 'scale-105 blur-md': store.isLocked }">
      <StatusBar />
      <div class="flex-1 relative w-full max-w-screen-xl mx-auto">
        <HomeScreen />
        <WindowManager />
      </div>
    </div>

    <!-- Lock Screen -->
    <transition name="unlock">
        <LockScreen v-if="store.isLocked" />
    </transition>

    <!-- Notification -->
    <SystemNotification />
  </div>
</template>

<style>
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob {
  animation: blob 10s infinite;
}
/* Unlock Transition */
.unlock-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.unlock-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}
.animation-delay-6000 {
  animation-delay: 6s;
}
</style>
