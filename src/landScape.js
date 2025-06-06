<template>
  <div class="flex-container">
    <div class="dateRangePicker">
      <ejs-daterangepicker
        ref="daterangepicker"
        v-model="selectedDateRange"
        :format="'MMM d, yyyy'"
        :separator="' to '"
        :allowEdit="false"
        :openOnFocus="true"
        :placeholder="'Select a Date Range'"
        :showClearButton="true"
        :value="value"
        :width="250"
      ></ejs-daterangepicker>
    </div>
    <div class="logo">
      <img src="./assets/tableLogo.jpg" alt="AccuSalt Logo" class="logo" />
    </div>
  </div>
</template>



<script setup>
import { ref, onMounted } from 'vue';
import { DateRangePickerComponent as EjsDaterangepicker } from '@syncfusion/ej2-vue-calendars';

const selectedDateRange = ref([]);
const value = ref(null);

onMounted(() => {
  const dateRangePicker = document.querySelector('.e-daterangepicker');
  if (dateRangePicker) {
    adjustDateRangePickerLayout();
    window.addEventListener('resize', adjustDateRangePickerLayout);
    window.addEventListener('orientationchange', adjustDateRangePickerLayout);
  }
});

const adjustDateRangePickerLayout = () => {
  const dateRangePicker = document.querySelector('.e-daterangepicker');
  if (window.matchMedia("(orientation: landscape)").matches) {
    dateRangePicker.style.position = 'absolute';
    dateRangePicker.style.top = '50%';
    dateRangePicker.style.left = '50%';
    dateRangePicker.style.transform = 'translate(-50%, -50%)';
    dateRangePicker.style.width = '90%';
    dateRangePicker.style.height = 'auto';
    dateRangePicker.style.zIndex = '1000';
  } else {
    dateRangePicker.style.position = 'static';
    dateRangePicker.style.transform = 'none';
    dateRangePicker.style.width = 'auto';
    dateRangePicker.style.height = 'auto';
    dateRangePicker.style.zIndex = 'initial';
  }
};
</script>


.flex-container {
  display: flex; 
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 10px;
}

.logo {
  width: auto;
  height: 30px;
  margin: 10px 0;
}

.dateRangePicker {
  width: 100%;
  max-width: 350px;
  padding: 10px;
  background-color: white;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
}

.e-input-group input.e-input,
.e-input-group.e-control-wrapper input.e-input {
  font-size: 14px;
  height: 30px;
}

#table-container {
  width: 100%;
  padding: 0 10px;
}

#table-div {
  width: 100%;
  overflow-x: auto;
}

.e-grid .e-gridheader {
  border: 1px solid #ddd;
}

.e-grid .e-headercell {
  color: #ffffff;
  background-color: lightgray;
}

.e-grid .e-headercelldiv {
  font-size: 14px;
  font-weight: bold;
  color: black;
}

#gridcomp {
  width: 100%;
}

.landscape-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 24px;
  text-align: center;
  padding-top: 40%;
  z-index: 9999;
}

@media (orientation: landscape) {
  .landscape-overlay {
    display: block;
  }

  /* Hide main content in landscape mode */
  #app {
    display: none;
  }
}

/* Ensure filter checkboxes are left-aligned */
.e-grid .e-filterbarcell {
  display: flex;
  justify-content: flex-start; /* Align items to the left */
  align-items: center;
  padding-left: 5px; /* Adjust as necessary */
}
