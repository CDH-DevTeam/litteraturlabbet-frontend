<template>
  <div class="reuse-list-label">
    <div class="reuse-label">
      <div v-if="authorSelected && !workSelected">
        I verk av
        <span class="author-name">{{ authorSelected?.name }}</span> finner vi
        {{ clusterCount }} grupper av likartade stycken, så kallade återbruk.
      </div>
      <div v-if="workSelected && authorSelected">
        I verket
        <span class="work-title">{{ workTitle }}</span>
        av <span class="author-name">{{ authorSelected?.name }}</span> finner vi
        {{ clusterCount }} grupper av återbruk.
      </div>
    </div>
    <v-pagination
      v-model="page"
      :pages="pages"
      :range-size="1"
      active-color="white"
      @update:modelValue="onPageChange"
    />
  </div>

  <div class="card-container">
    <div v-for="cluster in clusters" v-bind:key="cluster.id">
      <cluster-card :cluster="cluster"></cluster-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";
import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { list, get } from "@/services/diana";
import ClusterCard from "@/components/ClusterCard.vue";
import type { Author, Cluster, Work } from "@/types/litteraturlabbet";

const props = defineProps<{
  author?: number;
  work?: number;
}>();

// const store = searchStore();
const route = useRoute();
const authorSelected = ref<Author>();
const workSelected = ref<Work>();
const workTitle = ref<string>("");
const clusters = ref<Array<Cluster>>([]);
const clusterCount = ref<number>(0);
const page = ref(1);
const pages = computed(() => {
  return Math.floor(clusterCount.value / 25) + 1;
});

await fetchData();

async function fetchData() {
  if (props.author) {
    authorSelected.value = await get<Author>(props.author, "author");
    workSelected.value = undefined;
  }

  if (props.work) {
    workSelected.value = await get<Work>(props.work, "work");
    workTitle.value = workSelected.value.short_title
      ? workSelected.value.short_title
      : workSelected.value.title;
  }

  if (props.author) {
    fetchClusters(page.value, authorSelected.value?.id, workSelected.value?.id);
  }
}

function fetchClusters(
  page: number,
  authorID: number | undefined,
  workID: number | undefined
) {
  const params = {
    has_author: authorID,
    work: workID,
    limit: 10,
    offset: 10 * (page - 1),
  };

  list<Cluster>("cluster", params).then((d) => {
    clusters.value = d.results;
    clusterCount.value = d.count;
  });
}

function onPageChange() {
  fetchClusters(page.value, authorSelected.value?.id, workSelected.value?.id);
}

watch(
  () => [route.params, props.author],
  async (params) => {
    fetchData();
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>

<style scoped>
.card-container {
  height: 100%;
}

.reuse-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.reuse-list-label {
  display: flex;
  margin-left: 0rem;
  margin-bottom: 2rem;
  background-color: white;
  color: black;
  padding: 1rem 1.5rem 1rem 1.5rem;
  border-radius: 0px;
  flex-direction: row;
  justify-content: space-between;
}

.reuse-label {
  line-height: 2.5rem;
  max-width: 85%;
  font-size: 17px;
}

.author-name,
.work-title {
  background-color: rgb(182, 82, 139);
  color: white;
  padding: 0.5rem 0.5rem 0.5rem 0.5rem;
  border-radius: 8px;
}
</style>