import { PhChartLineUp, PhEnvelope, PhGameController, PhGithubLogo, PhImages, PhUserList, PhXLogo } from '@phosphor-icons/vue';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export type AppId =
  | 'profile'
  | 'gallery'
  | 'experience'
  | 'playground'
  | 'widget-profile'
  | 'mail'
  | 'external-x'
  | 'external-github'
  | string;

export interface WindowInstance {
  instanceId: string;
  appId: AppId;
  state: 'opening' | 'open' | 'minimized' | 'closing';
  zIndex: number;
  params?: Record<string, string>;
}

export const useOSStore = defineStore('os', () => {
  // Initial Data Generators
  const generateDock = () => [
    { id: 'profile', type: 'app', icon: PhUserList, label: 'Profile' },
    { id: 'mail', type: 'app', icon: PhEnvelope, label: 'Mail' },  
    { id: 'external-x', type: 'app', icon: PhXLogo, label: 'X' },
    { id: 'external-github', type: 'app', icon: PhGithubLogo, label: 'GitHub' },
  ];

  const generateGrid = () => {
    const initialApps = [
      { id: 'widget-profile', type: 'widget' },
      { id: 'gallery', type: 'app', icon: PhImages, label: 'Gallery' },
      { id: 'experience', type: 'app', icon: PhChartLineUp, label: 'Exp' },
      { id: 'playground', type: 'app', icon: PhGameController, label: 'Playground' },
    ];
    
    const totalSlots = 20;
    const items = [...initialApps];
    
    // Fill remaining slots
    for (let i = items.length; i < totalSlots; i++) {
      items.push({ id: `empty-${i}`, type: 'empty' } as any);
    }
    
    return items;
  };

  // --- App State ---
  const dockItems = ref(generateDock());
  const gridItems = ref(generateGrid());

  const windows = ref<WindowInstance[]>([]);
  const activeWindowId = ref<string | null>(null);
  const isMultitaskOpen = ref(false);
  const isEditMode = ref(false);

  // Constants
  const BASE_Z_INDEX = 10;

  // Actions
  const focusApp = (instanceId: string) => {
    activeWindowId.value = instanceId;
    const win = windows.value.find((w) => w.instanceId === instanceId);
    if (win) {
      const maxZ = Math.max(BASE_Z_INDEX, ...windows.value.map((w) => w.zIndex));
      if (win.zIndex < maxZ) {
        win.zIndex = maxZ + 1;
      }
      if (win.state === 'minimized') {
        win.state = 'open';
      }
    }
  };

  const openApp = (appId: AppId, params?: Record<string, string>) => {
    const instanceId = `${appId}-${Date.now()}`;
    const maxZ = Math.max(BASE_Z_INDEX, ...windows.value.map((w) => w.zIndex));
    
    const newWindow: WindowInstance = {
      instanceId,
      appId,
      state: 'opening',
      zIndex: maxZ + 1,
      params
    };
    
    windows.value.push(newWindow);
    activeWindowId.value = instanceId;
    syncToHash();
  };

  const closeApp = (instanceId: string) => {
    const win = windows.value.find((w) => w.instanceId === instanceId);
    if (win) {
      win.state = 'closing';
    }
    syncToHash();
  };
  
  const removeWindow = (instanceId: string) => {
    windows.value = windows.value.filter(w => w.instanceId !== instanceId);
    if (activeWindowId.value === instanceId) {
      activeWindowId.value = null;
    }
    syncToHash();
  };

  const minimizeApp = (instanceId: string) => {
    const win = windows.value.find((w) => w.instanceId === instanceId);
    if (win) {
      win.state = 'minimized';
    }
    activeWindowId.value = null; 
    syncToHash();
  };
  
  const syncToHash = () => {
    if (isMultitaskOpen.value) {
      history.replaceState(null, '', '#multitask');
      return;
    }
    const active = windows.value.find(w => w.instanceId === activeWindowId.value);
    if (active && active.state !== 'minimized' && active.state !== 'closing') {
      const params = active.params ? `&${new URLSearchParams(active.params).toString()}` : '';
      history.replaceState(null, '', `#app=${active.appId}${params}`);
    } else {
      history.replaceState(null, '', '#home');
    }
  };

  const syncFromHash = () => {
    const hash = window.location.hash;
    if (hash === '#multitask') {
      isMultitaskOpen.value = true;
      return;
    }
    if (hash.startsWith('#app=')) {
      const query = new URLSearchParams(hash.slice(1)); 
      const appId = query.get('app') as AppId;
      if (appId) {
        openApp(appId);
      }
    }
  };

  const setEditMode = (value: boolean) => {
    isEditMode.value = value;
  };

  const removeApp = (id: string) => {
    const gridIndex = gridItems.value.findIndex(i => i.id === id);
    if (gridIndex !== -1) {
      gridItems.value.splice(gridIndex, 1);
      gridItems.value.push({ id: `empty-${Date.now()}`, type: 'empty' } as any);
      return;
    }
    const dockIndex = dockItems.value.findIndex(i => i.id === id);
    if (dockIndex !== -1) {
      dockItems.value.splice(dockIndex, 1);
    }
  };

  const resetApps = () => {
    dockItems.value = generateDock();
    gridItems.value = generateGrid();
    isEditMode.value = false;
  };

  // ... (rest of the file)
  
  return {
    windows,
    activeWindowId,
    isMultitaskOpen,
    isEditMode,
    dockItems,
    gridItems,
    focusApp,
    openApp,
    closeApp,
    removeWindow,
    minimizeApp,
    syncFromHash,
    syncToHash,
    setEditMode,
    removeApp,
    resetApps
  };
});
