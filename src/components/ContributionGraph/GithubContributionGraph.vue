<script lang="ts" setup>
const squaresRef = ref<HTMLDivElement | null>(null)

onMounted(() => {
  if (squaresRef.value) {
    for (let i = 1; i < 365; i += 1) {
      const level = Math.floor(Math.random() * 3)
      squaresRef.value.insertAdjacentHTML('beforeend', `<li data-level="${level}"></li>`)
    }
  }
})
</script>

<template>
  <div class="github-contribution-graph">
    <ul class="github-contribution-graph__months github-contribution-graph__months--full">
      <li>Jan</li>
      <li>Feb</li>
      <li>Mar</li>
      <li>Apr</li>
      <li>May</li>
      <li>Jun</li>
      <li>Jul</li>
      <li>Aug</li>
      <li>Sep</li>
      <li>Oct</li>
      <li>Nov</li>
      <li>Dec</li>
    </ul>
    <ul class="github-contribution-graph__days">
      <li>Sun</li>
      <li>Mon</li>
      <li>Tue</li>
      <li>Wed</li>
      <li>Thu</li>
      <li>Fri</li>
      <li>Sat</li>
    </ul>
    <ul
      ref="squaresRef"
      class="github-contribution-graph__squares"
    />
  </div>
</template>

<style>
/* Article - https://bitsofco.de/github-contribution-graph-css-grid/ */

/* Grid-related CSS */

:root {
  --square-size: 15px;
  --square-gap: 5px;
  --week-width: calc(var(--square-size) + var(--square-gap));

  --month-size: calc(var(--week-width) * 4);
}

.github-contribution-graph {
  @apply inline-grid gap-2.5;
  grid-template-areas: "empty months"
                       "days squares";
  grid-template-columns: auto 1fr;

  @apply border-1 border-solid border-gray-500

  @apply p-5 m-5;
}

.github-contribution-graph__months {
  @apply grid;
  grid-area: months;
}

.github-contribution-graph__months--full {
  grid-template-columns: repeat(12, var(--month-size));
}

.github-contribution-graph__months--semester {
  grid-template-columns: repeat(6, var(--month-size));
}

.months__OLD {
  grid-area: months;
  display: grid;
  grid-template-columns:
    calc(var(--week-width) * 4) /* Jan */
    calc(var(--week-width) * 4) /* Feb */
    calc(var(--week-width) * 4) /* Mar */
    calc(var(--week-width) * 5) /* Apr */
    calc(var(--week-width) * 4) /* May */
    calc(var(--week-width) * 4) /* Jun */
    calc(var(--week-width) * 5) /* Jul */
    calc(var(--week-width) * 4) /* Aug */
    calc(var(--week-width) * 4) /* Sep */
    calc(var(--week-width) * 5) /* Oct */
    calc(var(--week-width) * 4) /* Nov */
    calc(var(--week-width) * 5) /* Dec */;
}

.github-contribution-graph__days, .github-contribution-graph__squares {
  display: grid;
  gap: var(--square-gap);
  grid-template-rows: repeat(7, var(--square-size));
}

.github-contribution-graph__days {
  grid-area: days;
}

.github-contribution-graph__days li:nth-child(odd) {
  @apply invisible;
}

.github-contribution-graph__squares {
  grid-area: squares;
  grid-auto-flow: column;
  grid-auto-columns: var(--square-size);
  /* grid-auto-columns: repeat(7, var(--square-size)); */
}

.github-contribution-graph__squares li {
  background-color: #ebedf0;
}

.github-contribution-graph__squares li[data-level="1"] {
  background-color: #c6e48b;
}

.github-contribution-graph__squares li[data-level="2"] {
  background-color: #7bc96f;
}

.github-contribution-graph__squares li[data-level="3"] {
  background-color: #196127;
}
</style>
