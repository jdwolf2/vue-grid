<template>
  <div class="page-container">
    <div class="flex-container">
      <div class="logo">
        <img src="./assets/tableLogo.jpg" alt="AccuSalt Logo" class="logo" />
      </div>
      <div class="dateRangePicker">
        <ejs-daterangepicker
          v-model="selectedDateRange"
          format="MMM d, yyyy"
          separator=" to "
          :allowEdit="false"
          :openOnFocus="false"
          placeholder="Select a Date Range"
          :showClearButton="true"
          :value="value"
          :autoFit="true"
          :responsive="true"
          :fullScreenMode="false"
        ></ejs-daterangepicker>
      </div>
    </div>
    <div id="table-container">
      <div id="table-div">
        <EjsGrid
          ref="gridRef"
          id="gridcomp"
          :allowlScrolling="true"
          :scrollingSettings="{ scrollMode: 'Normal' }"
          :allowResizing="false"
          :dataSource="data"
          :allowPaging="false"
          :allowGrouping="true"
          :allowSorting="true"
          :showColumnMenu="true"
          :groupSettings="groupOptions"
          :allowFiltering="true"
          :adaptiveUIMode="true"
          :filterSettings="filterSettings"
          padding-right="0"
          :frozenRows="0"
          :height="400"
          :adaptiveDlgMode="true"
          :enableAdaptiveUI="true"
          :width="'auto'"
          @headerCellInfo="onHeaderCellInfo"
        >
          <EColumns>
            <EColumn
              v-for="col in displayedColumns"
              :key="col.field"
              :field="col.field"
              :headerText="col.headerText"
              :textAlign="col.textAlign"
              :width="col.width"
            />
          </EColumns>
        </EjsGrid>
        <div style="position: relative">
          <div
            class="e-checkboxfilter e-filter-popup e-control e-dialog e-lib e-popup e-col-menu e-popup-open custom-filter-popup"
            id="gridcompstring_excelDlg"
            uid="grid-column0"
            aria-label="Checkbox filter"
            role="dialog"
            aria-describedby="gridcompstring_excelDlg_dialog-content"
            aria-modal="false"
            tabindex="-1"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, provide } from 'vue'
import { data } from './assets/data.js'
import { columns } from './assets/columns.js'
import {
  GridComponent as EjsGrid,
  ColumnDirective as EColumn,
  ColumnsDirective as EColumns,
  Group,
  Sort,
  Resize,
  ColumnMenu,
  Filter,
} from '@syncfusion/ej2-vue-grids'

const groupOptions = { showGroupedColumn: true }
const filterSettings = { type: 'CheckBox' }
provide('grid', [Group, Sort, Resize, ColumnMenu, Filter])

import { DateRangePickerComponent as EjsDaterangepicker } from '@syncfusion/ej2-vue-calendars'

const selectedColumns = ref(columns.map((col) => col.field))
const displayedColumns = ref(columns)
const gridRef = ref(null) // Add a reference to the Grid component

const updateColumns = () => {
  displayedColumns.value = columns.filter((col) =>
    selectedColumns.value.includes(col.field)
  )
}

// const autoFitAllColumns = () => {
//   if (gridRef.value) {
//     gridRef.value.autoFitColumns()
//   }
// }

// onMounted(() => {
//   autoFitAllColumns()
// })

watch(selectedColumns, updateColumns)

const onHeaderCellInfo = (args) => {
  const columnField = args.cell.column.field
  const headerCell = args.node
  headerCell.style.padding = '0 10px 0 6px'
  headerCell.style.borderColor = 'white'
  headerCell.style.borderRight = '1px solid white'
  switch (columnField) {
    case 'Site':
      headerCell.style.background = 'black'
      break
    case 'Truck':
      headerCell.showColumnMenu = 'false'

      headerCell.style.background = 'black'
      break
    case 'Route':
      headerCell.style.background = 'black'
      break
    case 'StartDate':
      headerCell.style.background = 'rgb(0,0, 150)'
      break
    case 'StartTime':
      headerCell.style.background = 'rgb(0,0, 150)'
      break
    case 'StopTime':
      headerCell.style.background = 'rgb(0,0, 150)'
      break
    case 'Duration':
      headerCell.style.background = 'rgb(0,0, 150)'
      break
    case 'Total':
      headerCell.style.background = 'darkgreen'
      break
    case 'Rate':
      headerCell.style.background = 'darkgreen'
      break
    case 'Lat':
      headerCell.style.background = 'rgb(100,0, 0)'
      break
    case 'Lon':
      headerCell.style.background = 'rgb(100,0, 0)'
      break
    case 'Temp':
      headerCell.style.background = 'lightblue'
      break
  }
}
</script>

<style>
@import '~@syncfusion/ej2-base/styles/material.css';
@import '~@syncfusion/ej2-buttons/styles/material.css';
@import '~@syncfusion/ej2-calendars/styles/material.css';
@import '~@syncfusion/ej2-dropdowns/styles/material.css';
@import '~@syncfusion/ej2-inputs/styles/material.css';
@import '~@syncfusion/ej2-navigations/styles/material.css';
@import '~@syncfusion/ej2-popups/styles/material.css';
@import '~@syncfusion/ej2-splitbuttons/styles/material.css';
@import '~@syncfusion/ej2-vue-grids/styles/material.css';
body {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
  margin: 0;
  padding: 20px;
  background-color: rgb(50, 50, 50);
}
.e-grid .e-headercelldiv {
  font-size: 16px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: normal;
  color: white;
}
.page-container {
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}
@media (max-width: 800px) {
  .e-daterangepicker.e-popup {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    margin-right: auto;
    margin-bottom: auto;
  }

  .custom-filter-popup {
    max-height: 800px;
    z-index: 2147483647;
    width: 255px;
    top: -69.2533px;
    display: block;
    visibility: visible;
    position: absolute; /* Ensure it can float */
    left: 0px; /* Align to the left */
  }
}

.e-gridheader {
  padding-right: 0 !important;
}

.flex-container {
  display: flex;
  flex-direction: column;
  align-items: baseline;
  gap: 0;
  background-color: white;
}

.logo {
  width: auto;
  height: 20px;
  padding: 5px 0 0 0;
  margin-bottom: 10px;
}

.dateRangePicker {
  display: flex;
  width: 300px;
  background-color: white;
  font-family: Arial, Helvetica, sans-serif;
  margin-left: 15px;
  padding-bottom: 5px;
}

.e-hide {
  display: none;
}
.e-grid .e-gridheader {
  border: 1px solid black;
}

.e-grid .e-headercell {
  color: white;
  /* background-color: lightsteelblue; */
}

/* .e-grid .e-headercelldiv {
  font-size: 16px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: normal;
  color: black;
}.e-grid .e-headercelldiv {
  font-size: 16px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: normal;
  color: black;
} */

.e-grid .e-columnselection {
  background-color: white;
}

/* .e-input-group input.e-input,
.e-input-group.e-control-wrapper input.e-input {
  font-size: 20px;
} */

.e-input-group .e-input-group-icon:last-child,
.e-input-group.e-control-wrapper .e-input-group-icon:last-child {
  font-size: 12px;
  margin-right: 0;
  background-color: white;
}

/* .e-calendar .e-content td:hover span.e-day,
.e-calendar .e-content td:focus span.e-day,
.e-bigger.e-small .e-calendar .e-content td:hover span.e-day,
.e-bigger.e-small .e-calendar .e-content td:focus span.e-day {
  background-color: red;
  border: 2px solid;
  padding-right: 0;
  margin-right: 0;
  color: #212529;
} */

.e-calendar .e-header .e-title,
.e-bigger.e-small .e-calendar .e-header .e-title {
  font-size: 16px;
}

.e-calendar .e-header span,
.e-bigger.e-small .e-calendar .e-header span {
  border: 1px solid;
  color: chocolate;
}

/* .e-calendar .e-content thead {
  background: black;
} */

.e-grid
  .e-gridheader
  .e-icons:not(.e-icon-hide):not(.e-check):not(.e-stop):not(
    .e-icon-reorderuparrow
  ):not(.e-icon-reorderdownarrow) {
  color: #ffffff;
}
/* SEARCH ARROW COLOR */
.e-grid
  th.e-headercell[aria-sort='ascending']:not(.e-columnselection)
  .e-headertext,
.e-grid
  th.e-headercell[aria-sort='descending']:not(.e-columnselection)
  .e-headertext,
.e-grid th.e-headercell[aria-sort='ascending'] .e-sortfilterdiv,
.e-grid th.e-headercell[aria-sort='descending'] .e-sortfilterdiv {
  color: #ffffff;
}

.e-grid .e-gridcontent {
  overflow-x: auto;
}

.e-grid .e-headercontent {
  overflow-x: auto;
}
</style>
