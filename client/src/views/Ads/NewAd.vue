<template>
  <v-flex>
    <v-layout>
      <v-flex xs12 sm6 md4>
        <v-dialog
          v-model="menuStart"
          :close-on-content-click="false"
          :nudge-right="40"
          lazy
          persistent
          transition="scale-transition"
          offset-y
          full-width
          width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="dateStart"
              label="Picker without buttons"
              prepend-icon="event"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="dateStartPick">
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="cancelMenuStart">Cancel</v-btn>
            <v-btn flat color="primary" @click="setDateStart">OK</v-btn>
          </v-date-picker>
        </v-dialog>
      </v-flex>
      <v-flex xs12 sm6 md4>
        <v-dialog
          v-model="menuEnd"
          :close-on-content-click="false"
          :nudge-right="40"
          lazy
          persistent
          transition="scale-transition"
          offset-y
          full-width
          width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="dateEnd"
              label="Picker without buttons"
              prepend-icon="event"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="dateEndPick" >
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="cancelMenuEnd">Cancel</v-btn>
            <v-btn flat color="primary" @click="setDateEnd">OK</v-btn>
          </v-date-picker>
        </v-dialog>
      </v-flex>
      <v-flex>
        <p>{{ new Date(dateStart) }} - {{ dateEnd }}</p>
      </v-flex>
    </v-layout>
    <v-layout
      v-show="haveErrInTable[0].statusError"
      class="white mb-2 elevation-4"
    >
      <v-flex md12 col pa-0>
        <v-card>
          <v-toolbar color="red" dark>
            <v-toolbar-title>Ошибки в таблице заказов:</v-toolbar-title>

            <v-spacer></v-spacer>
          </v-toolbar>
          <v-list>
            <template v-for="(item, index) in haveErrInTable[0].error">
              <v-list-tile
                v-if="!!item.list.length"
                :key="item.name"
                ripple
                @click=""
              >
                <v-list-tile-content>
                  <v-list-tile-sub-title class="text--primary font-weight-bold">
                    {{ item.name }}:
                    <span v-for="(element, index) in item.list">
                      <span v-if="index != 0">, </span>
                      <span class="error--text "> {{ element }}</span>
                    </span>
                  </v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout v-if="headers.length" column class="elevation-4">
      <!--todo блок с названием закупки годом валютой и т. д.-->

      <my-table
        :config="table_conf"
        name-of-table="Таблица отписок об оплате!!!"
        :table="table"
        :headers="headers"
        :err="haveErrInTable[0]"
        :optionsOfSale="{
          yearOfSale,
          currency,
          exchange,
          exchangeOfDelivery,
          unitForDelivery,
          pricePerUnit,
          priceCategory,
          calculate: true
        }"
      ></my-table>
    </v-layout>

    <!--    <p v-html="headers"></p>
    <p v-html="table_conf"></p>
    <p v-html="tableImportFromGoogle"></p>
    <p v-html="table"></p>-->
  </v-flex>
</template>

<script>
import GoogleSheets from "../../services/GoogleSheets";
import TableHeaders from "../../services/TableHeaders";
export default {
  data() {
    return {
      maxDate: null,
      minDate: null,
      dateStartPick: new Date("01-01-2019").toISOString().substr(0, 10),
      dateEndPick: new Date().toISOString().substr(0, 10),
      dateStart: this.dateStartPick,
      dateEnd: this.dateEndPick,

      menuStart: false,
      menuEnd: false,

      headers: [],
      table: [],
      table_conf: {},
      tableImportFromGoogle: "",
      haveErrInTable: [{ statusError: false, error: [] }],
      yearOfSale: null,
      currency: null,
      exchange: null,
      exchangeOfDelivery: null,
      unitForDelivery: null,
      pricePerUnit: null,
      priceCategory: [],
      calculate: false,
      tableView: true
    };
  },
  beforeMount: async function() {
    Date.prototype.format = function(format = "dd-mm-yyyy") {
      const replaces = {
        yyyy: this.getFullYear(),
        mm: ("0" + (this.getMonth() + 1)).slice(-2),
        dd: ("0" + this.getDate()).slice(-2),
        hh: ("0" + this.getHours()).slice(-2),
        MM: ("0" + this.getMinutes()).slice(-2),
        ss: ("0" + this.getSeconds()).slice(-2)
      };
      let result = format;
      for (const replace in replaces) {
        result = result.replace(replace, replaces[replace]);
      }
      return result;
    };
    this.tableImportFromGoogle = await GoogleSheets.fetchGoogleSheetsPost({
      spreadsheetId: "1dc1Xw5C_YTBN5nHrR_f33lvckRw8OH_WAmrmdCiNarc",
      range: "A2:h",
      valueRenderOption: "UNFORMATTED_VALUE",
      dateTimeRenderOption: "SERIAL_NUMBER"
    });
    this.table_conf = await TableHeaders.fetchHeadersGoogleSheetsWithRepliesAboutPayments();
  },
  watch: {
    haveErrInTable: {
      handler: function() {
        console.log("WATCH_HAVE_ERROR");
        console.log(this.haveErrInTable[0]);
      },
      deep: true
    },
    table_conf: {
      handler: async function() {
        console.log("watch table_conf");
        this.headers = await this.setHeaders();
        this.setTable();
      },
      deep: true
    },
    // dateStartPick: function() {
    //   if (Date.parse(this.dateStartPick) < Date.parse(this.minDate)) {
    //     this.dateStart = this.minDate;
    //   } else if (Date.parse(this.dateStartPick) > Date.parse(this.dateEnd)) {
    //     this.dateStart = this.dateEnd;
    //   } else if (Date.parse(this.dateStartPick) > Date.parse(this.maxDate)) {
    //     this.dateStart = this.maxDate;
    //   } else {
    //     this.dateStart = this.dateStartPick;
    //   }
    //   this.setTable();
    // },
    // dateEndPick: function() {
    //   if (Date.parse(this.dateEndPick) > Date.parse(this.maxDate)) {
    //     this.dateEnd = this.maxDate;
    //   } else if (Date.parse(this.dateEndPick) < Date.parse(this.dateStart)) {
    //     this.dateEnd = this.dateStart;
    //   } else if (Date.parse(this.dateEndPick) < Date.parse(this.minDate)) {
    //     this.dateEnd = this.minDate;
    //   } else {
    //     this.dateEnd = this.dateEndPick;
    //   }
    //   this.setTable();
    // },
    dateEnd: function() {
      this.setTable();
    }
  },
  methods: {
    setDateStart: function() {
      if (Date.parse(this.dateStartPick) < Date.parse(this.minDate)) {
        this.dateStart = this.minDate;
      } else if (Date.parse(this.dateStartPick) > Date.parse(this.dateEnd)) {
        this.dateStart = this.dateEnd;
      } else if (Date.parse(this.dateStartPick) > Date.parse(this.maxDate)) {
        this.dateStart = this.maxDate;
      } else {
        this.dateStart = this.dateStartPick;
      }
      this.closeMenuStart();
      this.setTable();
    },
    cancelMenuStart: function() {
      this.closeMenuStart();
    },
    closeMenuStart: function() {
      this.menuStart = false;
      this.dateStartPick = this.dateStart;
    },
    setDateEnd: function() {
      if (Date.parse(this.dateEndPick) > Date.parse(this.maxDate)) {
        this.dateEnd = this.maxDate;
      } else if (Date.parse(this.dateEndPick) < Date.parse(this.dateStart)) {
        this.dateEnd = this.dateStart;
      } else if (Date.parse(this.dateEndPick) < Date.parse(this.minDate)) {
        this.dateEnd = this.minDate;
      } else {
        this.dateEnd = this.dateEndPick;
      }
      this.closeMenuEnd();
      this.setTable();
    },
    cancelMenuEnd: function() {
      this.closeMenuEnd();
    },
    closeMenuEnd: function() {
      this.menuEnd = false;
      this.dateEndPick = this.dateEnd;
    },
    setTable: async function() {
      console.log("SET_TABLE!!!");
      let headersCopy = this.headers;
      let headers = this.table_conf.headersOfTable;

      this.table = this.tableImportFromGoogle.map((row, i) => {
        let newRow = {};
        newRow["№"] = i + 1;
        row.forEach(function(el, index) {
          if (headers[headersCopy[index + 1].value].content === "date") {
            newRow[headersCopy[index + 1].value] = new Date(
              (el - 25569) * 24 * 60 * 60 * 1000 - 3 * 60 * 60 * 1000
            );
          } else if (
            headers[headersCopy[index + 1].value].content === "number" &&
            typeof el === "string"
          ) {
            let elChecked = el.replace(/[^\d.,]/g, "").replace(",", ".");
            newRow[headersCopy[index + 1].value] = isNaN(+elChecked)
              ? el
              : elChecked;
          } else if (
            headers[headersCopy[index + 1].value].content === "string"
          ) {
            newRow[headersCopy[index + 1].value] = el + "";
          } else {
            newRow[headersCopy[index + 1].value] = el;
          }
        });
        return newRow;
      });
      if (this.minDate === null) {
        this.minDate = this.table[0]["Отметка времени"]
          .toISOString()
          .substr(0, 10);
        this.maxDate = this.table[this.table.length - 1]["Отметка времени"]
          .toISOString()
          .substr(0, 10);
        this.dateEndPick = this.maxDate;
        this.dateStartPick = this.minDate;
        this.dateStart = this.minDate;
        this.dateEnd = this.maxDate;
      }
      let endDate = Date.parse(this.dateEnd);
      let strtDate = Date.parse(this.dateStart);
      this.table = this.table.filter(function(elem) {
        let date = Date.parse(elem["Отметка времени"]);
        return date >= strtDate && date <= endDate + 24 * 60 * 60 * 1000;
      });
      this.tableView = this.table_conf.depForChangeValueHeaders !== undefined;
    },
    setHeaders: function() {
      let headers = [];
      Object.keys(this.table_conf.headersOfTable).forEach(key => {
        headers.push({
          text: key,
          value: key,
          sortable: false
        });
      });
      headers.sort(function(a, b) {
        return a.index < b.index ? -1 : 1;
      });
      return headers;
    }
  }
};
</script>

<style scoped></style>
