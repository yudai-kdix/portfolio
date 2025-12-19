<script setup lang="ts">
import { PhUserCircle, PhEnvelopeSimple, PhGithubLogo, PhXLogo, PhGlobe, PhArrowLeft } from '@phosphor-icons/vue';

defineEmits<{
  (e: 'close'): void;
}>();

const skills = ['Next.js', 'Go', 'Ruby on Rails', 'Python'];
const links = [
  { label: 'Mail', url: 'mailto:ydhm04222@gmail.com', icon: PhEnvelopeSimple },
  { label: 'GitHub', url: 'https://github.com/yudai-kdix', icon: PhGithubLogo },
  { label: 'X (Twitter)', url: 'https://x.com/yuuudaiiiiii', icon: PhXLogo },
  { label: 'KINDAI Info-Tech HUB', url: 'https://kithub.jp/contact', icon: PhGlobe }, 
];
const profileImage = import.meta.env.BASE_URL + 'yudai.jpg';
</script>

<template>
  <div class="h-full w-full bg-white flex flex-col text-gray-900 font-sans overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between px-5 pt-12 pb-4 bg-white/90 backdrop-blur-md sticky top-0 z-20 border-b border-gray-100">
        <h1 class="text-2xl font-bold tracking-tight">Profile</h1>
        <button 
            @click="$emit('close')"
            class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
            <PhArrowLeft size="18" weight="bold" />
        </button>
    </div>

    <!-- Scroll Content -->
    <div class="flex-1 overflow-y-auto px-6 pb-20">
        <div class="flex flex-col items-center mt-8 mb-8">
            <div class="w-32 h-32 rounded-full overflow-hidden shadow-xl mb-6 ring-4 ring-gray-50 border-4 border-white">
                <img :src="profileImage" alt="Yudai Homma" class="w-full h-full object-cover" />
            </div>
            
            <h2 class="text-3xl font-bold mb-1">Yudai Homma</h2>
            <span class="text-gray-500 font-medium">なんでも屋さん</span>
        </div>

        <section class="mb-10">
            <h3 class="text-lg font-bold mb-3 border-b border-gray-100 pb-2">自己紹介</h3>
            <p class="text-gray-600 leading-relaxed text-sm">
                Webに関して色々やってる紅茶が趣味のえんじにあです！<br>
                コミュニティの運営なども学生の間やってきたので今後も運営系に関われたらと考えています！
            </p>
        </section>

        <section class="mb-10">
            <h3 class="text-lg font-bold mb-4 border-b border-gray-100 pb-2">Skill</h3>
            <div class="flex flex-wrap gap-2">
                <span 
                    v-for="skill in skills" 
                    :key="skill"
                    class="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                    {{ skill }}
                </span>
            </div>
        </section>

        <section class="mb-10">
            <h3 class="text-lg font-bold mb-4 border-b border-gray-100 pb-2">Connect</h3>
            <div class="grid grid-cols-1 gap-3">
                <a 
                    v-for="link in links" 
                    :key="link.label"
                    :href="link.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-200"
                >
                    <component :is="link.icon" size="24" class="text-gray-400 group-hover:text-blue-500 transition-colors" />
                    <span class="font-medium flex-1">{{ link.label }}</span>
                    <span class="text-xs text-gray-400">Open</span>
                </a>
            </div>
        </section>
    </div>
  </div>
</template>
