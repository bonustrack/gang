<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { state } from '@/helpers/state';
import { getSpreadsheet, shorten } from '@/helpers/utils';

const route = useRoute();
const id = route.params.id || 'home';
const current = state.gangs[id];
const gangs = Object.fromEntries(
  Object.entries(state.gangs).filter(gang => gang[1].parent === id)
);
const loading = ref(false);
const missions = ref([]);

onMounted(async () => {
  if (current.missions) {
    loading.value = true;
    const gid = current.missions.slice(1);
    const sheetId = '1f4ldYQlU-2a8YD4Ap8bpLoEpz-e0DtaBJCYdsrtmwp0';
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&tq=SELECT%20*&gid=${gid}`;
    missions.value = await getSpreadsheet(url);
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <div class="mr-[440px] mb-6">
      <div
        v-if="current?.parent"
        class="block border-b p-4 space-x-3 h-[140px]"
      >
        <router-link
          v-if="id"
          :to="{
            name: 'home',
            params: { id: current.parent === 'home' ? '' : current.parent }
          }"
        >
          <UiButton class="!px-0 w-[46px]"><Icon name="back" /></UiButton>
        </router-link>
        <h2 class="inline-block">#{{ current.name }}</h2>
      </div>
      <div v-else class="block border-b p-4 space-x-3 h-[140px]">
        <h1 class="mono">{{ current.about }}</h1>
      </div>

      <div v-if="Object.keys(gangs).length > 0">
        <div class="border-b eyebrow px-4 py-1">Gang(s)</div>
        <router-link
          :to="{ name: 'home', params: { id: gang.name } }"
          v-for="(gang, i) in gangs"
          :key="i"
          class="block border-b px-4 py-3 leading-6"
        >
          <h3>#{{ gang.name }}</h3>
          <span class="text-skin-text">{{ gang.about || '-' }}</span>
        </router-link>
      </div>

      <div v-if="current.missions">
        <div class="border-b eyebrow px-4 py-1">Mission(s)</div>
        <UiLoading v-if="loading" class="block p-4" />
        <div
          v-else
          v-for="(mission, i) in missions"
          :key="i"
          class="block border-b px-4 py-3 leading-6"
        >
          <h3>{{ mission.about }}</h3>
          <span class="text-skin-text">{{ mission.type }}</span>
        </div>
      </div>
    </div>

    <div
      class="p-4 border-l w-[440px] fixed right-0 bottom-0 top-[79px] space-y-3"
    >
      <div>
        <h4 class="mb-2">
          <Icon name="user" class="mr-1" />
          Soldiers
          <UiCounter :counter="current.soldiers.length" class="ml-1" />
        </h4>
        <div>
          <div v-if="current.soldiers.length === 0">
            There isn't any soldier here yet.
          </div>
          <div
            v-else
            v-for="(soldier, i) in current.soldiers"
            :key="i"
            class="inline-block text-center mb-2"
          >
            <Stamp
              :id="
                state.soldiers[soldier].address || state.soldiers[soldier].name
              "
              :size="44"
              class="mx-2"
            />
            <div class="text-sm">{{ state.soldiers[soldier].name }}</div>
          </div>
        </div>
      </div>

      <div v-if="current.discord">
        <h4 class="mb-2">
          <Icon name="discord" class="mr-1" />
          Discord
        </h4>
        <a :href="current.discord" target="_blank">
          {{ shorten(current.discord, 44) }}
        </a>
      </div>

      <div v-if="current.github">
        <h4 class="mb-2">
          <Icon name="github" class="mr-1" />
          GitHub
        </h4>
        <a :href="current.github" target="_blank">
          {{ current.github }}
        </a>
      </div>
    </div>
  </div>
</template>
