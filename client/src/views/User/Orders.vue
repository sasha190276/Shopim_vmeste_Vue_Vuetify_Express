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
    <v-flex v-if="headers.length">
      <!--todo блок с названием закупки годом валютой и т. д.-->
      <v-layout mb-2>
        <v-flex md12>
          <form class="white elevation-4  pa-3">
            <v-layout justify-space-between>
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
              <v-flex>
                <v-text-field
                  type="text"
                  v-model="exchangeShipping"
                  v-validate="'required|decimal:2'"
                  :error-messages="errors.collect('exchangeShipping')"
                  label="Exchange shipping"
                  data-vv-name="exchangeShipping"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-btn @click="submit" color="success" :disabled="submitError"
              >submit</v-btn
            >
            <v-btn @click="clear">clear</v-btn>
          </form>
        </v-flex>
      </v-layout>

      <my-table
        :config="table_conf"
        name-of-table="Таблица заказов!!!"
        :table="table"
        :headers="headers"
        @tableErrorStatus="val => (this.haveErrInTable = val)"
      ></my-table>
    </v-flex>
  </v-container>
</template>
<script>
import XLSX from "xlsx";
import TableHeaders from "../../services/TableHeaders";
export default {
  $_veeValidate: {
    validator: "new"
  },
  data: () => ({
    table_conf: {},
    haveErrInTable: false,
    // todo поля блока с параметрами закупки
    nameOfSale: "",
    yearOfSale: "",
    currency: "Dollar $",
    exchange: 1,
    exchangeShipping: 1,
    currencyItems: ["Dollar $", "Euro", "Pound", "Roubles"],
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
        exchange: {
          required: "Select field is required",
          decimal: "Поле должно содержать число"
        },
        exchangeShipping: {
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

    // todo заголовки таблицы касающиеся доставки
    shippingOption: ["Вес", "Курс Доставки", "Цена за килограмм"],

    // todo автозамена имен заголовков при импорте
    headersForChange: {
      "Основная или замена": "Примечание",
      вес: "Вес",
      "нет скидки": "Категория цен",
      итого: "Итого",
      "Кол-во вещей ": "Количество"
    }
  }),

  mounted() {
    this.$validator.localize("en", this.dictionary);
  },

  updated() {},
  watch: {
    fileName: function() {
      this.nameOfSale = this.fileName.replace(/\.[a-z]{3,}$/, "") || "";
      this.yearOfSale = this.fileName.match(/[0-9]{4}/, "")[0] || "";
    }
  },
  computed: {
    submitError: function() {
      return this.haveErrInTable || !!this.errors.items.length;
    }
  },
  methods: {
    // getHeadersSample: async function() {
    //   this.table_conf = await TableHeader.fetchHeadersSample();
    // },
    submit: function() {
      let result = [];
      let orderOptions = {
        currency: this.currency,
        exchange: this.exchange
      };
      console.log(this.table);
      this.table.forEach(row => {
        console.log('submit');
        let rowResult = {};
        rowResult.nameOfSale = this.nameOfSale;
        rowResult.yearOfSale = this.yearOfSale;
        console.log(row);
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
          if (this.shippingOption.includes(key)) {
            rowResult.shipping === undefined ? (rowResult.shipping = {}) : "";
            rowResult.shipping[key] = row[key];
          } else {
            rowResult[key] = row[key];
          }
        }
        rowResult.shipping["Курс доставки"] = this.exchangeShipping;
        rowResult.orderOptions = orderOptions;
        result.push(rowResult);
        console.log(result);

      });


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
      this.table_conf = await TableHeaders.fetchHeadersSample();
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
          let workbook = XLSX.read(data, { type: rABS ? "binary" : "array" });
          let sheet_name = workbook.SheetNames[0];
          let worksheet = workbook.Sheets[sheet_name];
          this.table = XLSX.utils
            .sheet_to_json(worksheet, { defval: "" })
            .filter(e => {
              if (e["Ник"] !== undefined) {
                return e["Ник"] !== "";
              }
            });
          this.setHeaders();
        });
      } else {
        this.fileName = "";
        this.excelFile = "";
      }
    },

    // создание массива заголовков
    setHeaders: function() {
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
