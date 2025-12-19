<script setup lang="ts">
import { PhBriefcase, PhGraduationCap, PhArrowLeft } from '@phosphor-icons/vue';

defineEmits<{
  (e: 'close'): void;
}>();

const experiences = [
  { 
    date: '2026年3月', 
    title: '近畿大学卒業見込み', 
    type: 'edu', 
    description: '情報学部' 
  },
  { 
    date: '2025年11月', 
    title: '技育展決勝進出！', 
    type: 'work', 
    description: '技術展示イベント' 
  },
  { 
    date: '2023年4月', 
    title: 'KINDAI Info-Tech HUB 運営join!', 
    type: 'work', 
    description: '技術コミュニティ運営' 
  },
  { 
    date: '2022年4月', 
    title: '近畿大学情報学部入学', 
    type: 'edu', 
    description: 'Department of Informatics' 
  },
];
</script>

<template>
  <div class="h-full w-full bg-[#1c1c1e] flex flex-col text-white font-sans">
    <!-- Header -->
    <div class="flex items-center justify-between px-5 pt-12 pb-4 bg-[#1c1c1e]/90 backdrop-blur-md sticky top-0 z-20 border-b border-white/10">
        <h1 class="text-2xl font-bold tracking-tight">Experience</h1>
        <button 
            @click="$emit('close')"
            class="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
            <PhArrowLeft size="18" weight="bold" />
        </button>
    </div>

    <!-- Timeline -->
    <div class="flex-1 overflow-y-auto px-6 pb-20 pt-6">
        <div class="relative pl-4 border-l-2 border-white/10 space-y-10">
            <div 
                v-for="(exp, index) in experiences" 
                :key="index"
                class="relative"
            >
                <!-- Dot -->
                <div 
                    class="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 border-[#1c1c1e]"
                    :class="exp.type === 'edu' ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'"
                ></div>

                <div class="flex flex-col gap-1">
                    <span class="text-sm font-mono text-white/50 mb-0.5">{{ exp.date }}</span>
                    <h3 class="text-lg font-bold">{{ exp.title }}</h3>
                    <p class="text-sm text-white/70">{{ exp.description }}</p>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>
