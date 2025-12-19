import { PhChartLineUp, PhEnvelope, PhGameController, PhGithubLogo, PhImages, PhInfo, PhUserList, PhXLogo } from '@phosphor-icons/vue';
import { defineStore } from 'pinia';
import { markRaw, ref } from 'vue';

export type AppId =
  | 'profile'
  | 'gallery'
  | 'experience'
  | 'playground'
  | 'widget-profile'
  | 'mail'
  | 'external-x'
  | 'external-github'
  | 'about'
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
    { id: 'profile', type: 'app', icon: markRaw(PhUserList), label: 'Profile' },
    { id: 'mail', type: 'app', icon: markRaw(PhEnvelope), label: 'Mail' },  
    { id: 'external-x', type: 'app', icon: markRaw(PhXLogo), label: 'X' },
    { id: 'external-github', type: 'app', icon: markRaw(PhGithubLogo), label: 'GitHub' },
  ];

  const generateGrid = () => {
    const initialApps = [
      { id: 'widget-profile', type: 'widget' },
      { id: 'gallery', type: 'app', icon: markRaw(PhImages), label: 'Gallery' },
      { id: 'experience', type: 'app', icon: markRaw(PhChartLineUp), label: 'Exp' },
      { id: 'playground', type: 'app', icon: markRaw(PhGameController), label: 'Playground' },
      { id: 'about', type: 'app', icon: markRaw(PhInfo), label: 'About' },
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
  const isLocked = ref(true);
  const notification = ref<{ title: string; message: string; icon?: any; visible: boolean } | null>(null);

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

  const openApp = (appId: AppId, params?: Record<string, string>, options?: { fromHash?: boolean }) => {
    const instanceId = `${appId}-${Date.now()}`;
    const maxZ = Math.max(BASE_Z_INDEX, ...windows.value.map((w) => w.zIndex));
    
    // Check if already open? Use existing if single instance desired?
    // Current logic always opens new window for some reason, but let's keep it.
    
    const newWindow: WindowInstance = {
      instanceId,
      appId,
      state: 'opening',
      zIndex: maxZ + 1,
      params
    };
    
    windows.value.push(newWindow);
    activeWindowId.value = instanceId;
    
    if (!options?.fromHash) {
        // Push new history entry if opened from UI
        const query = params ? `&${new URLSearchParams(params).toString()}` : '';
        history.pushState(null, '', `#app=${appId}${query}`);
    }
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
         // Check if already active to avoid duplicates if possible, or just open
         // Current logic opens new.
         openApp(appId, undefined, { fromHash: true });
      }
    } else {
        // Home or empty
        activeWindowId.value = null;
        isMultitaskOpen.value = false;
        // Optionally close windows or just minimize/deselect
        // If we want "Back" to close the app visually:
        windows.value.forEach(w => {
            if (w.state === 'open' || w.state === 'opening') w.state = 'minimized'; // Or closing?
        });
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
  
  const showNotification = (title: string, message: string, icon?: any) => {
    notification.value = { title, message, icon, visible: true };
    setTimeout(() => {
        if (notification.value) notification.value.visible = false;
    }, 2500);
  };

  return {
    windows,
    activeWindowId,
    isMultitaskOpen,
    isEditMode,
    isLocked,
    notification,
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
    resetApps,
    showNotification
  };
});
