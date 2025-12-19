<script setup lang="ts">
import { useOSStore } from '../../stores/osStore';
import AppContainer from './AppContainer.vue';
import ProfileApp from './apps/ProfileApp.vue';
import GalleryApp from './apps/GalleryApp.vue';
import PlaygroundApp from './apps/PlaygroundApp.vue';
import RedirectApp from './apps/RedirectApp.vue';
import AboutApp from './apps/AboutApp.vue';
import { defineAsyncComponent } from 'vue';

const store = useOSStore();

// Redirect Configs
const redirects: Record<string, { url: string; label: string; isMail?: boolean }> = {
  'mail': { url: 'mailto:ydhm04222@gmail.com', label: 'Mail', isMail: true },
  'external-x': { url: 'https://x.com/yuuudaiiiiii', label: 'X' },
  'external-github': { url: 'https://github.com/yudai-kdix', label: 'GitHub' },
};

// Map app IDs to components
const apps: Record<string, any> = {
  profile: ProfileApp,
  gallery: GalleryApp,
  experience: defineAsyncComponent(() => import('./apps/ExperienceApp.vue')),
  playground: PlaygroundApp,
  about: AboutApp,
};

const getComponent = (appId: string) => {
  if (redirects[appId]) return RedirectApp;
  return apps[appId] || null;
};

const getProps = (appId: string) => {
  return redirects[appId] || {};
};
</script>

<template>
  <div class="absolute inset-0 z-10 pointer-events-none">
    <transition-group name="window">
      <AppContainer
        v-for="win in store.windows"
        :key="win.instanceId"
        :window="win"
        class="pointer-events-auto"
      >
        <component 
            :is="getComponent(win.appId)" 
            v-bind="getProps(win.appId)"
            @close="store.closeApp(win.instanceId)"
        />
      </AppContainer>
    </transition-group>
  </div>
</template>

<style scoped>
/* Basic transition if GSAP is not yet fully integrated, but component handles classing */
.window-enter-active,
.window-leave-active {
  transition: all 0.3s ease;
}
.window-enter-from,
.window-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
