<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import { useAuth } from './composables/useAuth'
import { useDynamoDB } from './composables/useDynamoDB'

const { user, signIn, signOut } = useAuth()
onMounted(() => {
  if (!user.value) signIn()
})

const { items, itemsFetched, fetchItems } = useDynamoDB()
const startDateString = ref('')
const endDateString = ref('')
const isDateRangeValid = ref(false)
watchEffect(() => {
  if (startDateString.value && endDateString.value) {
    const s = new Date(startDateString.value).getTime()
    const e = new Date(endDateString.value).getTime()
    isDateRangeValid.value = s <= e
  } else {
    isDateRangeValid.value = false
  }
})

function toUnixString(isoDate) {
  return Math.floor(new Date(isoDate).getTime() / 1000).toString()
}

async function loadData() {
  if (!user.value) {
    signIn()
    return
  }
  const unixStart = toUnixString(startDateString.value)
  const unixEnd = toUnixString(endDateString.value)
  try {
    await fetchItems(unixStart, unixEnd)
  } catch (err) {
    console.error('DynamoDB fetch error:', err)
  }
}
</script>

<template>
  <div id="app">
    <div v-if="user">
      <header class="header">
        <h1>Post Data Grid</h1>
        <button @click="signOut">Sign Out</button>
      </header>

      <section class="controls">
        <label>
          Start Date:
          <input type="date" v-model="startDateString" />
        </label>
        <label>
          End Date:
          <input type="date" v-model="endDateString" />
        </label>
        <button @click="loadData" :disabled="!isDateRangeValid">
          Load Data
        </button>
      </section>

      <section class="table-container">
        <SfGrid
          v-if="itemsFetched && items.length"
          :dataSource="items"
          :allowPaging="true"
          :pageSettings="{ pageSize: 10 }"
          :allowSorting="true"
          height="400px"
        >
          <e-columns>
            <e-column field="customerName" headerText="Customer" width="120" />
            <e-column field="uStopTime" headerText="Stop Time" width="120" />
            <e-column field="device" headerText="Device" width="100" />
            <e-column field="duration" headerText="Duration" width="100" />
            <e-column field="lat" headerText="Latitude" width="100" />
            <e-column field="lon" headerText="Longitude" width="100" />
            <e-column field="rate" headerText="Rate" width="100" />
            <e-column field="sidNum" headerText="SID" width="100" />
            <e-column field="siteName" headerText="Site" width="120" />
            <e-column field="speed" headerText="Speed" width="100" />
            <e-column field="startDate" headerText="Start Date" width="120" />
            <e-column field="statTime" headerText="Stat Time" width="100" />
            <e-column field="stopTime" headerText="Stop Date" width="120" />
            <e-column field="tons" headerText="Tons" width="100" />
            <e-column field="truck" headerText="Truck" width="100" />
            <e-column field="uStartTime" headerText="Start Unix" width="120" />
          </e-columns>
          <e-inject services="[Page, Sort]" />
        </SfGrid>

        <div v-else-if="itemsFetched && !items.length" class="empty-prompt">
          Please Select a Date Range
        </div>
        <div v-else class="empty-prompt">Please Select a Date Range</div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.controls {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
  justify-content: center;
}
.table-container {
  margin-top: 1rem;
}
.empty-prompt {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  padding: 2rem;
}
</style>
