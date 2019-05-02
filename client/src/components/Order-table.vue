<template>
  <v-flex>
    <!--todo блок с ошибками-->
    <v-layout v-if="haveError" elevation-4 class="white mb-2">
      <v-flex md12 col pa-0>
        <v-card>
          <v-toolbar color="red" dark>
            <v-toolbar-title>Ошибки:</v-toolbar-title>

            <v-spacer></v-spacer>
          </v-toolbar>
          <v-list>
            <template v-for="(item, index) in errorList">
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
    <!--todo блок с таблицей-->
    <v-layout elevation-4 class="white">
      <v-flex md12 col pa-0>
        <v-toolbar color="primary" dark>
          <v-toolbar-title>{{ nameOfTable }}</v-toolbar-title>
          <v-divider class="mx-2" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            dark
            class="mb-2"
            @click="editActivator = !editActivator"
            >Open Edit
          </v-btn>

          <v-dialog v-model="dialogAddCols" max-width="700px">
            <template v-slot:activator="{ on }">
              <v-btn color="success" dark class="mb-2" v-on="on"
                >New Column
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12 sm6 md4 v-for="(val, key) in colsTemplate">
                      <v-combobox
                        v-if="val.name === 'Имя'"
                        :search-input.sync="createdItem[val.name]"
                        :v-model="createdItem[val.name]"
                        :items="headersNameNotUse"
                        :label="val.name"
                      ></v-combobox>
                      <v-text-field
                        v-else-if="val.value === undefined"
                        v-model="createdItem[val.name]"
                        :label="val.name"
                      ></v-text-field>
                      <v-select
                        v-else
                        :items="val.value"
                        v-model="createdItem[val.name]"
                        :label="val.name"
                      ></v-select>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click="closeCreateCol"
                  >Cancel
                </v-btn>
                <v-btn color="blue darken-1" flat @click="saveCreateCol"
                  >Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!--todo Кнопка "Add default value"-->
          <v-dialog persistent v-model="addDefaultValue" max-width="400px">
            <template v-slot:activator="{ on }">
              <v-btn color="success" dark class="mb-2" v-on="on"
                >Add default value
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Добавить значение в столбец</span>
              </v-card-title>

              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12 sm12 md12 row>
                      <v-select
                        v-model="colForFill"
                        :items="headersAccessedForChange"
                        label="Header Name"
                      ></v-select>
                      <v-text-field
                        v-model="defaultFillCol"
                        label="Значение"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click="closeAddDefaultValue"
                  >Cancel
                </v-btn>
                <v-btn color="blue darken-1" flat @click="saveAddDefaultValue"
                  >Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-divider class="mx-2" inset vertical></v-divider>
          <v-dialog v-model="dialog" max-width="700px">
            <template v-slot:activator="{ on }">
              <v-btn color="warning" dark class="mb-2" v-on="on"
                >New Item</v-btn
              >
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12 sm6 md4 v-for="(val, key) in headers">
                      <v-text-field
                        v-if="val.value !== '№'"
                        v-model="editedItem[val.value]"
                        :label="val.text"
                      ></v-text-field>
                      <v-text-field
                        v-if="val.value === '№'"
                        v-model="editedItem[val.value]"
                        :label="val.text"
                        disabled
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" flat @click="saveCrud">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>

        <v-data-table
          :headers="headers"
          :items="table"
          class="elevation-4"
          :rows-per-page-items="[
            5,
            10,
            25,
            {
              text: '$vuetify.dataIterator.rowsPerPageAll',
              value: -1
            }
          ]"
        >
          <template v-slot:headers="props">
            <tr>
              <th>
                Actions
              </th>

              <th
                v-for="(header, index) in props.headers"
                :key="header.value"
                v-bind:class="[
                  text_color(headersFlag[header.value], classForCells)
                ]"
              >
                <v-expand-transition>
                  <div v-show="editActivator && index !== 0">
                    <v-btn
                      flat
                      icon
                      color="black"
                      @click="changePositionOfCol(index, -1)"
                    >
                      <v-icon small>keyboard_arrow_left</v-icon>
                    </v-btn>
                    <v-btn flat icon color="black" @click="deleteCol(index)">
                      <v-icon small>clear</v-icon>
                    </v-btn>

                    <v-btn
                      flat
                      icon
                      color="black"
                      @click="changePositionOfCol(index, 1)"
                    >
                      <v-icon small>keyboard_arrow_right</v-icon>
                    </v-btn>
                  </div>
                </v-expand-transition>
                <!--todo  РЕДАКТИРОВАНИЕ ЗАГОЛОВКОв-->
                <v-edit-dialog
                  :return-value.sync="header.text"
                  large
                  lazy
                  @close="change"
                >
                  <div
                    v-bind:class="[
                      text_color(headersFlag[header.value], classForHeaders)
                    ]"
                  >
                    {{ header.value }}
                  </div>

                  <template v-slot:input>
                    <div class="mt-3 title">Change header</div>
                    <v-select
                      v-model="header.text"
                      :items="headersNameNotUse"
                      :label="header.text"
                      single-line
                      autofocus
                    ></v-select>
                  </template>
                </v-edit-dialog>
              </th>
            </tr>
          </template>

          <template v-slot:items="props">
            <tr
              class="tableRow"
              :class="{ rowWithErrorStyle: checkErrRow(props.item['№']) }"
            >
              <td class="justify-center px-0">
                <v-icon small class="mr-2" @click="editItem(props.item)">
                  edit
                </v-icon>
                <v-icon small @click="deleteItem(props.item)">
                  delete
                </v-icon>
              </td>

              <td
                v-for="header in headers"
                v-bind:key="header.value"
                :nowrap="
                  checkCurrencyTextNeed(header.value, props.item[header.value])
                "
              >
                <span>
                  <!--style="white-space: nowrap"-->
                  <span
                    :class="[
                      {
                        textWithError: !validCell(
                          header.value,
                          props.item[header.value]
                        )
                      },
                      {
                        textNotImport: headersFlag[header.value]['notImport']
                      }
                    ]"
                  >
                    {{ props.item[header.value] }}
                  </span>
                  <span
                    v-if="
                      ['Итого', 'Доставка', 'К оплате'].includes(
                        header.value
                      ) &&
                        props.item[header.value] !== '' &&
                        checkCurrencyTextNeed(
                          header.value,
                          props.item[header.value]
                        )
                    "
                  >
                    {{ " руб." }}
                  </span>
                  <span
                    v-else-if="
                      !['Итого', 'Доставка', 'К оплате'].includes(
                        header.value
                      ) &&
                        checkCurrencyTextNeed(
                          header.value,
                          props.item[header.value]
                        )
                    "
                  >
                    {{ " " + optionsOfSale.currency }}
                  </span>
                </span>
              </td>
            </tr>
          </template>
          <!--todo блок обработки пустой таблицы-->
          <template v-slot:no-data>
            <!--todo кнопка ресет ненужная пока-->
            <v-btn color="primary" @click="initialize">Reset</v-btn>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script>
import TableHeaders from "../services/TableHeaders";

export default {
  name: "my-table",
  props: {
    config: Object,
    nameOfTable: String,
    table: Array,
    headers: Array,
    optionsOfSale: Object
  },
  data: () => ({
    exchangeCourse: 1,
    exchangeCourseShipping: 1,
    priceWeight: 0,
    priceCategoryInner: [],
    headersOfTable: {},
    depForChangeValueHeaders: [],
    headersFlag: {},
    editActivator: false, // активация поля удаления и перемещения столбцов
    dialogAddCols: false, // добавление столбца
    dialog: false, //добавление строки

    editedIndex: -1, // индекс редактируемой строки (-1 новая строка)
    editedItem: {}, // редактируемая строка

    classForHeaders: ["textNotImport", "textDoubleValue", "textWithError"],
    classForCells: ["grey lighten-2", "yellow lighten-4", "red lighten-4"],

    createdItem: {
      Имя: "",
      "Значение по умолчанию": "",
      "Номер столбца": 2,
      "Тип данных": "string"
    },
    createdItemDefault: {
      Имя: "",
      "Значение по умолчанию": "",
      "Номер столбца": 2,
      "Тип данных": "string"
    },

    addDefaultValue: false, // диалог заполнения столбца значениями
    defaultFillCol: "", // чем заполнять
    colForFill: "", // столбец для заполнения
    colsTemplate: [
      { name: "Имя", defValue: "New header" },
      { name: "Значение по умолчанию", defValue: "" },
      { name: "Номер столбца", defValue: 2 },
      { name: "Тип данных", defValue: "string", value: ["string", "number"] }
    ],
    // todo поля таблицы запрещенные для заполнения значениями по умолчанию
    //depForChangeValueHeaders: ["№", "Ник", "Итого"],

    // todo переменные для ошибок в таблице
    missReqHeaders: [],
    depHeaders: [],
    doubleHeaders: [],
    stateOfHeaders: true,

    // todo таблица ошибок
    cellsByRow: [],
    //todo массив строк с ошибками
    rowWithError: []
  }),
  beforeMount() {
    this.depForChangeValueHeaders = this.config.depForChangeValueHeaders;
    this.headersOfTable = this.config.headersOfTable;
    this.checkHeaders();
    this.markNumberCol();
    //todo this.validateAllCells();
    this.calculateCells();
    // this.calcAllTotal();
    // this.calcAllDelivery();
  },
  mounted() {
    this.editedItem = this.headersForEditAndCreateItems();

    console.log(this.optionsOfSale);
  },
  computed: {
    haveError: function() {
      console.log("haveError");
      let statusError = !!this.errorList.filter(e => e.list.length !== 0)
        .length;
      this.$emit("tableErrorStatus", statusError);
      return statusError;
    },
    errorList: function() {
      return [
        { name: "Ошибки в строках", list: this.rowWithError },
        { name: "Необходимые заголовки", list: this.missReqHeaders },
        { name: "Дублирующиеся заголовки", list: this.doubleHeaders },
        { name: "Ошибочные заголовки", list: this.depHeaders }
      ];
    },
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    defaultItem() {
      return this.headersForEditAndCreateItems();
    },
    headersName: function() {
      return Object.keys(this.headersOfTable);
    },
    headersAlreadyUse: function() {
      return this.headers.map(e => e.value);
    },
    headersAccessedForChange: function() {
      return this.headersAlreadyUse.filter(
        e => !this.depForChangeValueHeaders.includes(e)
      );
    },
    headersNameNotUse: function() {
      return this.headersName.filter(e => !this.headersAlreadyUse.includes(e));
    }
  },
  watch: {
    optionsOfSale: {
      handler: function() {
        console.log("optionsOfSale_watch");
        this.exchangeCourse = +this.optionsOfSale.exchange || 1;
        this.exchangeCourseShipping = +this.optionsOfSale.exchangeShipping || 1;
        this.priceWeight = +this.optionsOfSale.pricePerKg || 0;
        this.priceCategoryInner = this.optionsOfSale.priceCategory.map(
          e => +e || 0
        );
        this.calculateCells();
        // this.calcAllTotal();
        // this.calcAllDelivery();
      },
      deep: true
    },
    dialog(val) {
      val || this.close();
    },
    dialogAddCols(val) {
      val || this.closeCreateCol();
    },
    table: {
      handler: function() {
        console.log("table_change");
        //this.validateAllCells();
      },
      deep: true
    },
    headers: {
      handler: function() {
        console.log("headers_change");
        this.checkHeaders();
        //todo this.validateAllCells();
        this.calculateCells();
        // this.calcAllTotal();
        // this.calcAllDelivery();
        this.createdItemDefault["Номер столбца"] = this.headers.length + 1;
        this.closeCreateCol();
      },
      deep: true
    }
  },
  methods: {
    calculateCells: function() {
      this.table.forEach(e => {
        e["Итого"] !== undefined ? this.calcTotal(e) : "";
        e["Доставка"] !== undefined ? this.calcDelivery(e) : "";
        e["Итого"] !== undefined ? this.calcToPay(e) : "";
      });
      this.validateAllCells();
    },
    // подсчет значения ИТОГО
    calcToPay: function(row) {
      let total = row["Итого"] || 0;
      let delivery = row["Доставка"] || 0;
      let result = this.gaussRound(total + delivery, 2);
      row["К оплате"] === undefined
        ? this.$set(row, "К оплате", result || "")
        : (row["К оплате"] = result || "");
    },
    calcTotal: function(row) {

      if (
        row["Цена"] === undefined ||
        typeof row["Цена"] !== "number" ||
        row["Количество"] === undefined ||
        typeof row["Количество"] !== "number"
      ) {
        row["Итого"] = "Err";
      } else {
        let priceCat =
          row["Категория цен"] !== undefined &&
          typeof +row["Категория цен"] === "number"
            ? this.priceCategoryInner[row["Категория цен"] - 1]
            : 0;

        let total = row["Цена"] * row["Количество"];
        total = (total + (total / 100) * priceCat) * this.exchangeCourse;
      row["Итого"] = this.gaussRound(total, 2);
      }
    },
    calcDelivery: function(row) {
      if (row["Вес"] === undefined || typeof row["Вес"] !== "number") {
        row["Доставка"] = "";
      } else {
        //console.log('--'+row["Вес"]+'--'+this.optionsOfSale.pricePerKg+'--'+this.optionsOfSale.exchangeShipping);
        let total = row["Вес"] * this.priceWeight * this.exchangeCourseShipping;
        row["Доставка"] = this.gaussRound(total, 2) || "";
      }
    },
    // проверка ряда на наличие ошибок в значениях
    checkErrRow: function(index) {
      console.log("checkErrRow");
      return this.cellsByRow[index - 1].includes(false);
    },
    // закрытие окна изменений в таблицы
    closeCreateCol() {
      this.dialogAddCols = false;
      setTimeout(() => {
        this.createdItem = Object.assign({}, this.createdItemDefault);
      }, 300);
    },
    // сохранение изменений в таблицу
    saveCreateCol: async function() {
      let colName = this.createdItem["Имя"];
      let colValue = this.createdItem["Значение по умолчанию"];
      let position = this.createdItem["Номер столбца"] + 1;
      if (position > this.headers.length) {
        position = this.headers.length + 1;
      } else if (position < 2) {
        position = 2;
      }
      let type = this.createdItem["Тип данных"];
      let header = { text: colName, value: colName, sortable: false };
      if (this.table[0][colName] === undefined) {
        this.table.forEach(e => this.$set(e, colName, colValue)); //e[colName] = colValue);
      }

      this.headersFlag[colName] === undefined
        ? this.headers.splice(position - 1, 0, header)
        : "";

      if (this.headersOfTable[colName] === undefined) {
        let newHeader = {
          name: colName,
          require: false,
          content: type,
          defValue: "",
          depForSetDefault: false
        };
        this.headersOfTable[colName] = newHeader;
        await TableHeaders.fetchHeadersSampleUpdate(newHeader);
      }
      //this.calcAllTotal();
      //this.validateAllCells();
      this.closeCreateCol();
    },
    //todo закрытие окна для заполнения столбца значениями по умолчанию
    closeAddDefaultValue() {
      this.addDefaultValue = false;
      setTimeout(() => {
        this.colForFill = "";
        this.defaultFillCol = "";
      }, 300);
    },
    // todo заполнение столбца значениями по умолчанию
    saveAddDefaultValue: function() {
      let header = this.headers.filter(e => e.value === this.colForFill)[0]
        .value;
      this.table.forEach(e => (e[header] = this.defaultFillCol));
      //todo this.validateAllCells();
      this.calculateCells();
      // this.calcAllTotal();
      // this.calcAllDelivery();
      this.closeAddDefaultValue();
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    // TODO сохранение изменений в таблицу
    saveCrud() {
      if (this.editedIndex > -1) {
        Object.assign(this.table[this.editedIndex], this.editedItem);
      } else {
        this.table.push(this.editedItem);
        this.markNumberCol();
      }
      console.log("saveCrud");

      //todo this.validateAllCells();
      this.calculateCells();
      // this.calcAllTotal();
      // this.calcAllDelivery();
      this.close();
    },
    // TODO возврат цвета заголовка
    text_color: function(header, markStyleArr) {
      let [notImportStyle, doubleValueStyle, depStyle] = markStyleArr;
      let style = "";
      if (header.notImport) {
        style = notImportStyle;
      } else if (header.doubleValue) {
        style = doubleValueStyle;
      } else if (header.depricated) {
        style = depStyle;
      }
      return style;
    },
    changePositionOfCol(index, direction) {
      if (
        (index === 1 && direction === -1) ||
        (index === this.headers.length - 1 && direction === 1)
      )
        return;
      let value = this.headers.splice(index, 1);
      this.headers.splice(index + direction, 0, value[0]);
    },
    //todo удаление столбца
    deleteCol(index) {
      confirm("Are you sure you want to delete this item?") &&
        this.headers.splice(index, 1);
    },
    // при сохранении измененного заголовка
    change: function() {
      this.headers.forEach(e => {
        if (
          e.value !== "№" &&
          e.value !== e.text &&
          !this.headersAlreadyUse.includes(e.text)
        ) {
          this.changeKey(e.value, e.text);
          e.value = e.text;
        } else {
          e.text = e.value;
        }
        this.closeChangeHeader();
      });
    },
    //создание объекта с полями для редактирования
    headersForEditAndCreateItems: function() {
      let defaultItm = {};
      this.headers.forEach(
        e =>
          (defaultItm[e.value] =
            this.headersOfTable[e.value] !== undefined
              ? this.headersOfTable[e.value].defValue
              : "")
      );
      return defaultItm;
    },
    editItem(item) {
      this.editedIndex = this.table.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    // удаление строки
    deleteItem(item) {
      const index = this.table.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.table.splice(index, 1);
      this.markNumberCol();
      //todo this.validateAllCells();
    },
    closeChangeHeader: function() {
      setTimeout(() => {
        this.createdItem = Object.assign({}, this.createdItemDefault);
      }, 300);
    },
    markNumberCol: function() {
      this.table.forEach((e, i, arr) => (arr[i]["№"] = i + 1));
    },
    // todo изменение ключа в таблице
    changeKey: function(oldKey, newKey) {
      this.table.forEach(row => {
        this.$set(row, newKey, row[oldKey]);
        //row[newKey] = row[oldKey];
        delete row[oldKey];
      });
    },
    checkHeaders: function() {
      this.headersFlag = {};
      let headerDblTmp = {};
      for (let header of this.headers) {
        this.headersFlag[header.value] = {};
        this.headersFlag[header.value].depricated =
          this.headersOfTable[header.value] === undefined;

        headerDblTmp[header.value] === undefined
          ? (headerDblTmp[header.value] = [])
          : "";
        headerDblTmp[header.value].push(header.value);

        this.headersFlag[header.value].notImport = header.value === "None";
        this.headersFlag[header.value].text = header.value;
      }

      for (let key in headerDblTmp) {
        headerDblTmp[key].forEach((e, i, arr) => {
          this.headersFlag[e].doubleValue =
            key !== "None" ? arr.length > 1 : false;
        });
      }

      this.validAllHeaders(); // проверка заголовков на наличие ошибок
    },
    // создание массива с результатами валидации ячеек
    //todo не проверять столбец ИТОГО после восстановления всех значений строка остается красной

    validateAllCells: function() {
      console.log("validateAllCells");
      this.cellsByRow = [];
      for (let i = 0; i < this.table.length; i++) {
        this.cellsByRow[i] = [];
      }
      this.headers.forEach((e, i) => {
        //todo вычисление значения ячейки

        if (
          this.headersOfTable[e.value] === undefined ||
          e.value === "Итого" ||
          this.headersOfTable[e.value].content !== "number"
        ) {
          for (let j = 0; j < this.table.length; j++) {
            this.cellsByRow[j][i] = true;
          }
          return;
        }
        for (let j = 0; j < this.table.length; j++) {
          let num = this.table[j][e.value];

          if (typeof num === "string" && num !== "") {
            if (/^[0-9]+([.,]([0-9]+)?)?$/.test(num)) {
              num = /^[0-9]+[.,]$/.test(num)
                ? +num.replace(/[.,]/, "")
                : +num.replace(/,/, ".");
            }
          }
          if (typeof num === "number") {
            this.table[j][e.value] = this.gaussRound(num, 2);
            this.cellsByRow[j][i] = true;
          } else {
            num !== "" ? (this.cellsByRow[j][i] = false) : "";
          }
        }
      });
      //this.calcAllTotal();
      this.setRowWithError();
    },
    // todo проверка нужно ли выводить валюту
    checkCurrencyTextNeed: function(headerValue, value) {
      return (
        ["Цена", "Итого", "Доставка", "К оплате"].includes(headerValue) &&
        this.validCell(headerValue, value)
      );
    },
    // валидация ячейки
    validCell: function(headerValue, value) {
      if (
        this.headersOfTable[headerValue] === undefined ||
        this.headersOfTable[headerValue].content !== "number"
      ) {
        return true;
      }
      return value === "" || /^[0-9]+([.,][0-9]+)?$/.test(value);
    },
    // валидация заголовков
    validAllHeaders: function() {
      this.missReqHeaders = [];
      this.depHeaders = [];
      this.doubleHeaders = [];
      let resultHeaders = this.headers.map(e => e.value);

      for (let key in this.headersOfTable) {
        if (this.headersOfTable[key].require && !resultHeaders.includes(key)) {
          this.missReqHeaders.push(key);
        }
      }

      for (let key in this.headersFlag) {
        this.headersFlag[key].depricated && !this.depHeaders.includes(key)
          ? this.depHeaders.push(key)
          : "";
        // this.headersFlag[key].doubleValue &&
        // !this.doubleHeaders.includes(this.headersFlag[key].text)
        //   ? this.doubleHeaders.push(this.headersFlag[key].text)
        //   : "";
        this.headersFlag[key].doubleValue && !this.doubleHeaders.includes(key)
          ? this.doubleHeaders.push(key)
          : "";
      }
      this.stateOfHeaders =
        !this.missReqHeaders.length &&
        !this.depHeaders.length &&
        !this.doubleHeaders.length;
    },
    setRowWithError: function() {
      this.rowWithError = [];
      this.cellsByRow.forEach((e, i) =>
        e.includes(false) ? this.rowWithError.push(i + 1) : ""
      );
    },
    gaussRound(num, decimalPlaces) {
      var d = decimalPlaces || 0,
        m = Math.pow(10, d),
        n = +(d ? num * m : num).toFixed(8),
        i = Math.floor(n),
        f = n - i,
        e = 1e-8,
        r =
          f > 0.5 - e && f < 0.5 + e
            ? i % 2 === 0
              ? i
              : i + 1
            : Math.round(n);
      return d ? r / m : r;
    }
  }
};
</script>

<style lang="sass">
.textWithError
  color: red
  font-weight: bold

.textDoubleValue
  color: black
  font-weight: bold

.textNotImport
  color: darkgrey
  font-weight: bold

.rowWithErrorStyle
  background-color: #ffb1b8

.v-menu__activator
  display: flex
  justify-content: center
</style>

<!--
todo Надо принять в модуль
Название таблицы
массив заголовков
массив таблицы






-->
