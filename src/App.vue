<!-- src/App.vue -->
<template>
  <div id="app">
    <!-- If user is null, nothing renders here because signIn() already redirected -->
    <div v-if="user">
      <!-- Header with Sign Out button -->
      <header class="header">
        <h1>Post Data Grid</h1>
        <button @click="signOut">Sign Out</button>
      </header>

      <!-- Date‐range picker + Load button -->
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

      <!-- Table area -->
      <section class="table-container">
        <table v-if="itemsFetched && items.length">
          <thead>
            <tr>
              <th>customerName</th>
              <th>uStopTime</th>
              <th>device</th>
              <th>duration</th>
              <th>lat</th>
              <th>lon</th>
              <th>rate</th>
              <th>sidNum</th>
              <th>siteName</th>
              <th>speed</th>
              <th>startDate</th>
              <th>statTime</th>
              <th>stopTime</th>
              <th>tons</th>
              <th>truck</th>
              <th>uStartTime</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in items"
              :key="item.uStopTime + '-' + item.customerName"
            >
              <td>{{ item.customerName }}</td>
              <td>{{ item.uStopTime }}</td>
              <td>{{ item.device }}</td>
              <td>{{ item.duration }}</td>
              <td>{{ item.lat }}</td>
              <td>{{ item.lon }}</td>
              <td>{{ item.rate }}</td>
              <td>{{ item.sidNum }}</td>
              <td>{{ item.siteName }}</td>
              <td>{{ item.speed }}</td>
              <td>{{ item.startDate }}</td>
              <td>{{ item.statTime }}</td>
              <td>{{ item.stopTime }}</td>
              <td>{{ item.tons }}</td>
              <td>{{ item.truck }}</td>
              <td>{{ item.uStartTime }}</td>
            </tr>
          </tbody>
        </table>

        <!-- When no items yet (but user is signed in), show prompt -->
        <div v-else-if="itemsFetched && !items.length" class="empty-prompt">
          Please Select a Date Range
        </div>

        <!-- Before first load (itemsFetched is still false), show prompt as well -->
        <div v-else class="empty-prompt">Please Select a Date Range</div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect, onMounted } from 'vue'
import { useAuth } from './composables/useAuth'
import { useDynamoDB } from './composables/useDynamoDB'

// ─── AUTH SETUP ───────────────────────────────────────────────────────────────
const { user, signIn, signOut } = useAuth()

// As soon as this component mounts, check if there's an authenticated user.
// If not, redirect to Cognito’s Hosted UI for manual login:
onMounted(() => {
  if (!user.value) {
    signIn()
    // After signIn(), Amplify will redirect to Cognito. This component won’t show anything
    // until the user finishes the Hosted UI flow and returns with tokens.
  }
})
// ────────────────────────────────────────────────────────────────────────────────

// ─── DYNAMODB SETUP ───────────────────────────────────────────────────────────
const { items, fetchError, itemsFetched, fetchItems } = useDynamoDB()

// Two reactive strings bound to <input type="date">:
//   e.g. "2021-10-01" → we will convert to UNIX seconds.
const startDateString = ref('')
const endDateString = ref('')

// isDateRangeValid is true only when both start+end are set and start<=end.
const isDateRangeValid = ref(false)
watchEffect(() => {
  if (startDateString.value && endDateString.value) {
    const start = new Date(startDateString.value).getTime()
    const end = new Date(endDateString.value).getTime()
    isDateRangeValid.value = start <= end
  } else {
    isDateRangeValid.value = false
  }
})

// Convert a YYYY-MM-DD string into a UNIX‐seconds string:
//   e.g. "2021-10-01" → Math.floor(Date.parse("2021-10-01")/1000).toString()
function toUnixString(isoDateStr) {
  return Math.floor(new Date(isoDateStr).getTime() / 1000).toString()
}

// When user clicks “Load Data”, call fetchItems() with dynamic KeyConditionExpression values.
// We need to override the hardcoded start/end in useDynamoDB, so we’ll patch them here.
// (In useDynamoDB.js, replace the fixed ExpressionAttributeValues with these variables.)
async function loadData() {
  if (!user.value) {
    // In case session expired mid-page, force signIn again:
    signIn()
    return
  }

  const unixStart = toUnixString(startDateString.value)
  const unixEnd = toUnixString(endDateString.value)

  // Temporarily override DynamoDB query parameters in useDynamoDB.
  // One way: modify useDynamoDB.fetchItems to accept (start, end).
  // Here, assume we've updated useDynamoDB to:
  //    async function fetchItems(startValue, endValue) { ... }
  // If you haven't updated useDynamoDB yet, see notes below.

  try {
    await fetchItems(unixStart, unixEnd)
  } catch (err) {
    console.error('Error fetching items:', err)
  }
}
// ────────────────────────────────────────────────────────────────────────────────
</script>

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
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 0.5rem;
  border: 1px solid #ccc;
  text-align: left;
}
.empty-prompt {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  padding: 2rem;
}
</style>
