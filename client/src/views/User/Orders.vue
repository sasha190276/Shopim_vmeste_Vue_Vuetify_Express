<template>
  <v-container fluid pt-0>
    <v-layout elevation-4 mb-2>
      <v-flex md12 px-3 mb-0 class="white">
        <v-text-field
          label="Select Excel file"
          @click="pickFile"
          v-model="fileName"
          prepend-icon="attach_file"
        ></v-text-field>
        <input
          type="file"
          style="display: none"
          ref="excel"
          accept=".xlsx , .xls , .xlsm"
          @change="onFilePicked"
        />
      </v-flex>
    </v-layout>
    <!--todo Блок открывающийся после загрузки файла-->
    <div v-if="headers.length" column>
      <!--todo блок с названием закупки годом валютой и т. д.-->
      <v-layout
        mb-2
        class="white elevation-4  pa-3"
        justify-space-between
        column
      >
        <v-flex>
          <v-layout>
            <v-flex>
              <v-text-field
                v-model="nameOfSale"
                v-validate="{
                  required: true,
                  max: 20
                }"
                :counter="20"
                :error-messages="errors.collect('nameOfSale')"
                label="Название закупки"
                data-vv-name="nameOfSale"
                required
              ></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                v-model="yearOfSale"
                v-validate="'required|numeric|max:4|min:4'"
                :counter="4"
                :error-messages="errors.collect('yearOfSale')"
                label="год закупки"
                data-vv-name="yearOfSale"
                required
              ></v-text-field>
            </v-flex>
            <v-flex>
              <v-select
                v-model="currency"
                v-validate="'required'"
                :items="currencyItems"
                menu-props="auto"
                :error-messages="errors.collect('currency')"
                label="Currency"
                data-vv-name="currency"
                required
              ></v-select>
            </v-flex>
            <v-flex>
              <v-text-field
                type="text"
                v-model="exchange"
                v-validate="'required|decimal:2'"
                :error-messages="errors.collect('exchange')"
                label="Exchange"
                data-vv-name="exchange"
                required
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex v-show="isSameName">
          <v-checkbox v-model="checkbox">
            <template v-slot:label red>
              <div>
                <span class="red--text"
                  >Такая закупка уже существует Перезаписать???</span
                >
              </div>
            </template>
          </v-checkbox>
        </v-flex>
        <v-btn @click="submit" color="success" :disabled="submitError"
          >submit</v-btn
        >
      </v-layout>
      <v-layout row mb-2 justify-space-between>
        <v-flex class="white elevation-4" md6 pa-0 mr-2>
          <v-toolbar color="primary" dark>
            <v-toolbar-title>Доставка</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-layout justify-space-between wrap px-2 py-1>
            <v-flex md6>
              <v-select
                v-model="unitForDelivery"
                v-validate="'required'"
                :items="unitForDeliveryItems"
                menu-props="auto"
                :error-messages="errors.collect('unitForDelivery')"
                label="Unit Delivery"
                data-vv-name="unitForDelivery"
                required
              ></v-select>
            </v-flex>
            <v-flex md6>
              <v-text-field
                type="text"
                v-model="pricePerUnit"
                v-validate="'required|decimal:2'"
                :error-messages="errors.collect('pricePerUnit')"
                label="Price per Unit"
                data-vv-name="pricePerUnit"
                required
              ></v-text-field>
            </v-flex>
            <v-flex md6>
              <v-select
                v-model="currencyOfDelivery"
                v-validate="'required'"
                :items="currencyOfDeliveryItems"
                menu-props="auto"
                :error-messages="errors.collect('currencyOfDelivery')"
                label="Currency of Delivery"
                data-vv-name="currencyOfDelivery"
                required
              ></v-select>
            </v-flex>
            <v-flex md6>
              <v-text-field
                type="text"
                v-model="exchangeOfDelivery"
                v-validate="'required|decimal:2'"
                :error-messages="errors.collect('exchangeOfDelivery')"
                label="Exchange shipping"
                data-vv-name="exchangeOfDelivery"
                required
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex class="white elevation-4" md6 pa-0>
          <v-toolbar color="primary" dark>
            <v-toolbar-title>Категории цен</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-spacer></v-spacer>
          </v-toolbar>

          <v-layout justify-space-between wrap px-2 py-1>
            <v-flex>
              <v-text-field
                type="text"
                v-model="priceCategory[0]"
                v-validate="'required|decimal:2'"
                :error-messages="errors.collect('priceCategoryOne')"
                label="Категория 1"
                data-vv-name="priceCategoryOne"
                required
              ></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                type="text"
                v-model="priceCategory[1]"
                v-validate="'required|decimal:2'"
                :error-messages="errors.collect('priceCategoryTwo')"
                label="Категория 2"
                data-vv-name="priceCategoryTwo"
                required
              ></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                type="text"
                v-model="priceCategory[2]"
                v-validate="'required|decimal:2'"
                :error-messages="errors.collect('priceCategoryThree')"
                label="Категория 3"
                data-vv-name="priceCategoryThree"
                required
              ></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                type="text"
                v-model="priceCategory[3]"
                v-validate="'required|decimal:2'"
                :error-messages="errors.collect('priceCategoryFour')"
                label="Категория 4"
                data-vv-name="priceCategoryFour"
                required
              ></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                type="text"
                v-model="priceCategory[4]"
                v-validate="'required|decimal:2'"
                :error-messages="errors.collect('priceCategoryFive')"
                label="Категория 5"
                data-vv-name="priceCategoryFive"
                required
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>

      <v-layout>
        <v-flex elevation-4>
          <v-tabs grow centered color="cyan" dark icons-and-text>
            <v-tabs-slider color="yellow"></v-tabs-slider>

            <v-tab href="#tab-1">
              Таблица заказов
              <v-icon>phone</v-icon>
            </v-tab>

            <v-tab href="#tab-2">
              Таблица оплат
              <v-icon>favorite</v-icon>
            </v-tab>


            <v-tab-item :key="2" :value="'tab-1'">
              <v-layout>
                <my-table
                  :config="table_conf"
                  name-of-table="Таблица заказов!!!"
                  :table="table"
                  :headers="headers"
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
                  @tableErrorStatus="val => (this.haveErrInTable = val)"
                ></my-table>
              </v-layout>
            </v-tab-item>
            <v-tab-item :key="1" :value="'tab-2'">
              <v-layout>
                <my-table
                        :config="table_conf_tableWithPay"
                        name-of-table="Таблица заказов!!!"
                        :table="tableWithPay"
                        :headers="headersOfTableWithPay"
                        :optionsOfSale="{
                    yearOfSale,
                    currency,
                    exchange,
                    exchangeOfDelivery,
                    unitForDelivery,
                    pricePerUnit,
                    priceCategory,
                    calculate: false
                  }"
                        @tableErrorStatus="val => (this.haveErrInTable = val)"
                ></my-table>
              </v-layout>
            </v-tab-item>
          </v-tabs>
        </v-flex>
      </v-layout>
    </div>
  </v-container>
</template>
<script>
import XLSX from "xlsx";
import TableHeaders from "../../services/TableHeaders";
import Purchases from "../../services/Purchases";
import Users from "../../services/Users";
export default {
  $_veeValidate: {
    validator: "new"
  },
  data: () => ({
    isSameName: false,
    checkbox: false,
    priceCategory: [0, 0, 0, 0, 0],
    table_conf: {},
    table_conf_tableWithPay: {},
    haveErrInTable: false,
    // todo поля блока с параметрами закупки
    nameOfSale: "",
    yearOfSale: "",
    currency: "$",
    currencyOfDelivery: "$",
    unitForDelivery: "кг",
    exchange: 1,
    pricePerUnit: 0,
    exchangeOfDelivery: 1,
    currencyItems: ["$", "Eur", "Pound", "Rub", "Y", "Kr"],
    currencyOfDeliveryItems: ["$", "Eur", "Pound", "Rub", "Y", "Kr"],
    currencyFromImportTable: {
      "Доллар США": "$",
      Евро: "Eur",
      Йенна: "Y",
      "Английский фунт": "Pound",
      "Датская крона": "Kr",
      Рубль: "Rub"
    },
    unitForDeliveryItems: ["кг", "шт"],
    // todo словарь для VeeValidate
    dictionary: {
      attributes: {
        //email: "E-mail Address"
        // custom attributes
      },
      custom: {
        nameOfSale: {
          required: () => "Name can not be empty",
          max: "The name field may not be greater than 10 characters"
          // custom messages
        },
        currency: {
          required: "Select field is required"
        },
        currencyOfDelivery: {
          required: "Select field is required"
        },
        unitForDelivery: {
          required: "Select field is required"
        },
        exchange: {
          required: "Select field is required",
          decimal: "Поле должно содержать число"
        },
        priceCategoryOne: {
          required: "Select field is required",
          decimal: "Поле должно содержать число"
        },
        priceCategoryTwo: {
          required: "Select field is required",
          decimal: "Поле должно содержать число"
        },
        priceCategoryThree: {
          required: "Select field is required",
          decimal: "Поле должно содержать число"
        },
        priceCategoryFour: {
          required: "Select field is required",
          decimal: "Поле должно содержать число"
        },
        priceCategoryFive: {
          required: "Select field is required",
          decimal: "Поле должно содержать число"
        },
        pricePerUnit: {
          required: "Select field is required",
          decimal: "Поле должно содержать число"
        },
        exchangeOfDelivery: {
          required: "Select field is required",
          decimal: "Поле должно содержать число"
        },
        yearOfSale: {
          required: "Select field is required",
          numeric: "Поле должно содержать год",
          max: "The name field may not be greater than 10 characters"
        }
      }
    },

    // todo переменные блока загрузки и обработки файла
    fileName: "",
    excelFile: "",
    imageUrl: "",
    rABS: true, // true: readAsBinaryString ; false: readAsArrayBuffer

    table: [],
    headers: [],
    tableWithPay: [],
    headersOfTableWithPay: [],

    // todo заголовки таблицы касающиеся доставки
    //shippingOption: ["Вес", "Курс Доставки", "Цена за килограмм"],

    // todo автозамена имен заголовков при импорте
    headersForChange: {
      "Основная или замена": "Примечание",
      вес: "Вес",
      "нет скидки": "Категория цен",
      итого: "Итого",
      "Кол-во вещей ": "Количество"
    }
  }),
  beforeMount() {
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
  },
  mounted() {
    this.$validator.localize("en", this.dictionary);
  },

  updated() {},
  watch: {
    nameOfSale: async function() {
      let res = await Purchases.fetchPurchases(this.nameOfSale);
      this.isSameName = !!res.length;
    },
    fileName: function() {
      this.nameOfSale = this.fileName.replace(/\.[a-z]{3,}$/, "") || "";
      this.yearOfSale = this.fileName.match(/[0-9]{4}/, "")[0] || "";
    }

    // priceCategory: function() {
    //   console.log(this.priceCategory);
    // }
  },
  computed: {
    // submitError: function() {
    //   let sameName = this.isSameName && this.checkbox ? false : this.isSameName;
    //   return this.haveErrInTable || !!this.errors.items.length || sameName;
    // }
  },
  methods: {
    // getHeadersSample: async function() {
    //   this.table_conf = await TableHeader.fetchHeadersSample();
    // },
    submit: async function() {
      let result = [];
      let nicksUniq = new Set();
      let orderOptions = {
        name: this.nameOfSale,
        year: this.yearOfSale,
        currency: this.currency,
        exchange: this.exchange,
        priceCategory: this.priceCategory.map(e => +e),
        unitForDelivery: this.unitForDelivery,
        pricePerUnit: this.pricePerUnit,
        currencyOfDelivery: this.currencyOfDelivery,
        exchangeOfDelivery: this.exchangeOfDelivery,
        headers: this.headers.reduce((res, current) => {
          current.value !== "№" ? res.push(current.value) : "";
          return res;
        }, [])
      };
      this.table.forEach(row => {
        row["Ник"] ? nicksUniq.add(row["Ник"]) : "";
        let rowResult = {};
        rowResult.nameOfSale = this.nameOfSale;
        rowResult.yearOfSale = this.yearOfSale;
        for (let key in row) {
          if (key === "None" || key === "№") continue;
          if (
            row[key] !== "" &&
            this.table_conf.headersOfTable[key].content === "number"
          ) {
            typeof row[key] === "string"
              ? (row[key] = +row[key].replace(/,/, "."))
              : "";
          }
          rowResult[key] = row[key];
        }
        result.push(rowResult);
      });
      // console.log(result);
      // console.log(orderOptions);
      let userImportResult = "";
      let usersFromDb = await Users.fetchUsersGet();
      if (usersFromDb) {
        let nicksFromDb = usersFromDb.map(e => e.nick);
        let nicks = [...nicksUniq]
          .filter(e => !nicksFromDb.includes(e))
          .map(function(e) {
            return { nick: e };
          });
        userImportResult = await Users.fetchUsersImport(nicks);
      }

      let resolveOfDb = await Purchases.fetchPurchaseAndOrdersImport({
        name: this.nameOfSale,
        purchase: orderOptions,
        orders: result
      });
      console.log(userImportResult + "=====" + resolveOfDb);
    },

    // очистка формы
    clear() {
      //this.name = "";
      this.$validator.reset();
    },

    //открытие окна выбора файла
    pickFile() {
      this.$refs.excel.click();
    },
    // загрузка и обработка EXCEL таблицы
    onFilePicked: async function(e) {
      this.headers = [];
      this.checkbox = false;
      this.table_conf = await TableHeaders.fetchHeadersSample();
      this.table_conf_tableWithPay = await TableHeaders.fetchHeadersSampleTableWithPay();
      const files = e.target.files;
      this.excelFile = files[0];
      if (files[0] !== undefined) {
        this.fileName = files[0].name;
        if (this.fileName.lastIndexOf(".") <= 0) {
          return;
        }
        let rABS = this.rABS; // true: readAsBinaryString ; false: readAsArrayBuffer
        let reader = new FileReader();
        if (rABS) reader.readAsBinaryString(this.excelFile);
        else reader.readAsArrayBuffer(this.excelFile);
        reader.addEventListener("load", () => {
          let data = reader.result;
          if (!rABS) data = new Uint8Array(data);
          let workbook = XLSX.read(data, {
            type: rABS ? "binary" : "array",
            cellDates: true
          });
          let sheet_name = workbook.SheetNames[0];

          let sheet_name_2 = workbook.SheetNames[1];
          let sheet_name_3 = workbook.SheetNames[2];

          let worksheet = workbook.Sheets[sheet_name];

          let worksheet_2 = workbook.Sheets[sheet_name_2];
          let worksheet_3 = workbook.Sheets[sheet_name_3];

          let tableWithOptions = XLSX.utils
            .sheet_to_json(worksheet_2, { defval: "", header: 1 })
            .slice(0, 6);

          this.exchange = tableWithOptions[4][2];
          this.exchangeOfDelivery = tableWithOptions[3][2];
          this.priceCategory = tableWithOptions.slice(1).map(e => e[5]);
          this.currency = this.currencyFromImportTable[tableWithOptions[1][2]];
          this.currencyOfDelivery = this.currencyFromImportTable[
            tableWithOptions[1][2]
          ];

          let tableWithPay = XLSX.utils.sheet_to_json(worksheet_3, {
            defval: ""
          });

          this.tableWithPay = tableWithPay.map(function(e) {
            return {
              Ник: e["Ник"],
              "Сумма платежа": e["Сумма платежа"],
              "Дата учета": new Date(Date.parse(e["Дата учета"]) + 17 * 1000),
              Примечание: e["Примечание"]
            };
          });

          this.table = XLSX.utils
            .sheet_to_json(worksheet, { defval: "" })
            .filter(e => {
              if (e["Ник"] !== undefined) {
                return e["Ник"] !== "";
              }
            });
          this.headers = this.setHeaders(this.table, true);
          this.headersOfTableWithPay = this.setHeaders(this.tableWithPay);
        });
      } else {
        this.fileName = "";
        this.excelFile = "";
      }
    },

    // создание массива заголовков
   /* setHeaders: function() {
      this.headers = [];
      this.table[0]["№"] === undefined
        ? this.headers.push({
            text: "№",
            value: "№",
            sortable: false
          })
        : "";

      for (let e in this.table[0]) {
        let text = e;
        if (this.headersForChange[e] !== undefined) {
          text = this.headersForChange[e];
          this.changeKey(e, text);
          e = text;
        }
        this.headers.push({
          text: text,
          value: e,
          sortable: false
        });
      }
      this.table[0]["К оплате"] === undefined
        ? this.headers.push({
            text: "К оплате",
            value: "К оплате",
            sortable: false
          })
        : "";
    },*/
    // создание массива заголовков
    setHeaders: function(table, forPay = false) {
      let headers = [];
      table[0]["№"] === undefined
        ? headers.push({
            text: "№",
            value: "№",
            sortable: false
          })
        : "";

      for (let e in table[0]) {
        let text = e;
        if (this.headersForChange[e] !== undefined) {
          text = this.headersForChange[e];
          this.changeKey(e, text);
          e = text;
        }
        headers.push({
          text: text,
          value: e,
          sortable: false
        });
      }
      if (forPay) {
        table[0]["К оплате"] === undefined
          ? headers.push({
              text: "К оплате",
              value: "К оплате",
              sortable: false
            })
          : "";
      }
      return headers
    },
    // изменение ключа в таблице
    changeKey: function(oldKey, newKey) {
      this.table.forEach(row => {
        this.$set(row, newKey, row[oldKey]);
        delete row[oldKey];
      });
    }
  }
};
</script>
<style lang="sass"></style>
