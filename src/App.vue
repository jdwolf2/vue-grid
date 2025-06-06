<template>
  <div id="app">
    <!-- Only show content once `user` is non-null (i.e. after login) -->
    <div v-if="user">
      <!-- ─── HEADER & SIGN-OUT ─────────────────────────────────────── -->
      <header class="header">
        <h1>Post Data Grid</h1>
        <button @click="signOut">Sign Out</button>
      </header>

      <!-- ─── DATE PICKERS & LOAD BUTTON ─────────────────────────────── -->
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

      <!-- ─── GRID OR EMPTY PROMPT ──────────────────────────────────── -->
      <section class="table-container">
        <!-- If we've fetched data AND there are rows → show Syncfusion Grid -->
        <SfGrid
          v-if="itemsFetched && items.length"
          :dataSource="items"
          :allowPaging="true"
          :pageSettings="{ pageSize: 10 }"
          :allowSorting="true"
          height="400px"
        >
          <!-- Adjust these columns to match the attributes in your `postData` table -->
          <e-columns>
            <e-column field="customerName" headerText="Customer" width="120" />
            <e-column field="uStopTime" headerText="Stop Time" width="120" />
            <e-column field="device" headerText="Device" width="100" />
            <e-column field="duration" headerText="Duration" width="100" />
            <e-column field="lat" headerText="Latitude" width="100" />
            <e-column field="lon" headerText="Longitude" width="100" />
            <e-column field="rate" headerText="Rate" width="100" />
            <e-column field="sidNum" headerText="SID" width="100" />
            <e-column field="siteName" headerText="Site" width="100" />
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

        <!-- If we’ve fetched but got zero rows → show prompt -->
        <div v-else-if="itemsFetched && !items.length" class="empty-prompt">
          Please Select a Date Range
        </div>

        <!-- Before first load (itemsFetched === false) → also show prompt -->
        <div v-else class="empty-prompt">Please Select a Date Range</div>
      </section>
    </div>
  </div>
</template>
