<script lang="ts" setup>
function getDaysInMonth(month: number, year: number) {
  // Check if month is valid
  if (month < 0 || month > 11) {
    // return 'Invalid month'
    return []
  }

  // Get the last day of the month
  const lastDay = new Date(year, month + 1, 0).getDate()

  // Create an array to store the days of the month
  const daysOfMonth = []

  // Loop through each day of the month and add it to the array
  for (let day = 1; day <= lastDay; day++) {
    daysOfMonth.push(day)
  }

  return daysOfMonth
}

const january = getDaysInMonth(0, 2023)

function transformArray<T>(originalArray: T[], rows: number, columns: number) {
  const newArray = []
  let index = 0

  for (let i = 0; i < columns; i += 1) {
    const column = []

    for (let j = 0; j < rows; j += 1) {
      column.push(originalArray[index])
      index += 1
    }

    newArray.push(column)
  }

  return newArray
}

// eslint-disable-next-line unused-imports/no-unused-vars
const transformed = transformArray(january, 6, 7)

// function monthGridFilled(month: number[]) {
//   if (month.length === 28) {
//     return month.push()
//   }
// }
</script>

<template>
  <!-- <div class="calendar-heatmap__month-grid">
    <div
      v-for="day of january"
      :key="day"
      class="calendar-heatmap__square"
    >
      {{ day }}
    </div>
  </div> -->
  <!-- <pre>

    {{ JSON.stringify(hm.calendar, null, 2) }}
  </pre> -->

  <div class="calendar-heatmap__month-grid">
    <!-- <div
      v-for="(days, idx) of transformed"
      :key="`outer-${idx}`"
    >
      <div
        v-for="day of days"
        :key="`outer-${day}`"
        class="calendar-heatmap__square"
      >
        {{ day }}
      </div>
    </div> -->
    <!-- <div
      v-for="(days, idx) of transformed"
      :key="`outer-${idx}`"
      class="calendar-heatmap__square"
    >
      {{ days }}
    </div> -->
    <div
      v-for="day of january"
      :key="day"
      class="calendar-heatmap__square"
    >
      {{ day }}
    </div>
  </div>
</template>

<style>
:root {
  --square-size: 15px;
  --square-gap: 5px;
  --week-width: calc(var(--square-size) + var(--square-gap));

  --month-size: calc(var(--week-width) * 4);
}

.calendar-heatmap__month-grid {

  grid-template-columns: repeat(7, 15px);
  grid-template-rows: repeat(6, 15px);
  @apply grid gap-2.5;

  width: 200px;
  height: 200px;
}

.calendar-heatmap__square {
  height: var(--square-size);
  width: var(--square-size);
  @apply bg-green;
}
</style>
