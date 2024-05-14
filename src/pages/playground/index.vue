<!-- eslint-disable unused-imports/no-unused-vars -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const data = [
  {
    name: 'Jero',
  },
  {
    name: 'Mathias',
  },
]

interface User {
  name: string
}

const router = useRouter()

const list = ref<User[] | undefined>(undefined)
const isLoading = ref(false)

const myValue = ref('')
const myModelValue = ref('')

function handleModelValue(val: string) {
  myValue.value = val
}

function fetchData(): Promise<User[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data)
    }, 5000)
  })
}

// async function go() {
//   setTimeout(async () => {
//     await router.push('/')
//   }, 2000)
// }

onMounted(async () => {
  try {
    // await go()
    isLoading.value = true
    const result = await fetchData()
    // console.log('yeah!!!!!!!!!!!!')
    list.value = result
    isLoading.value = false
  } catch (error) {

  }
})
</script>

<template>
  <div>
    <!-- <span v-if="isLoading">loading..</span>
    <div v-if="!isLoading && list">
      <ul
        v-for="user of list"
        :key="user.name"
      >
        <li>{{ user.name }}</li>
      </ul>
    </div> -->

    myValue: {{ myValue }}
    <form>
      <DummyInput
        :model-value="myValue"
        @update:model-value="handleModelValue"
      />
    </form>
    myModelValue: {{ myModelValue }}
    <form>
      <DummyInput
        v-model="myModelValue"
      />
    </form>
  </div>
</template>

<route lang="yaml">
meta:
  layout: SidebarLayout
</route>
