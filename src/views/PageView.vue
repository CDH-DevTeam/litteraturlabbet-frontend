<template>
  <div class="card-container">
    <div class="back-button" onclick="history.back()">Tillbaka</div>
    <div class="page-container">
      <div class="title-container">
        <div class="title">
          {{ work.title }}
        </div>
        <div class="author">{{ author.name }}, {{ work.sort_year }}</div>
      </div>
      <div class="page-text" v-html="text"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { get } from "@/services/diana";
import type {
  Author,
  Page,
  Work,
  Segment,
} from "@/types/litteraturlabbet";

const props = defineProps<{
  id: number;
  segment: number;
}>();

const page = await get<Page>(props.id, "page");
const work = await get<Work>(page.work as number, "work");
const author = await get<Author>(work.main_author as number, "author");
let text = page.text;
console.log(props.segment);
if (props.segment) {
  const segment = await get<Segment>(props.segment, "segment");

  console.log(segment.text);

  text = text.replace(
    segment.text,
    `<span class="highlight">${segment.text}</span>`
  );

  console.log(text);
}
</script>

<style>
.highlight {
  font-weight: 800;
}
</style>

<style scoped>
.card-container {
  height: 80%;
}

.back-button {
  padding: 5px;
  font-size: 16px;
  text-align: center;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  height: auto;
  width: 80px;
  margin: 20px;
  margin-left: 3em;
  background-color: rgb(182, 82, 139);
}

.page-container {
  margin-left: 3rem;
  margin-right: 3rem;
  margin-bottom: 3rem;
  line-height: 2rem;
}

.page-text {
  font-size: 20px;
}

.title-container {
  margin-bottom: 2rem;
}

.title {
  font-family: "Cormorant Garamond", serif;
  letter-spacing: -3px;
  margin-top: 30px;
  font-size: 30px;
  line-height: 0.9;
  color: rgb(182, 82, 139);
}

.author {
  font-size: 20px;
}

.back-button:hover {
  background-color: rgb(202, 102, 159);
  color: black;
}

@media screen and (max-width: 950px) {
  .back-button {
    margin-top: 40px;
    margin-left: 50px;
    font-size: 28px;
    width: 120px;
  }
}
</style>
