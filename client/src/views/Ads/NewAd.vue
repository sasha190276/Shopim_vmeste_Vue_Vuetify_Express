<template>
  <v-container>
    <v-layout row>
      <v-flex xs12>
        <h1>NewAd</h1>
        <p v-html="text"></p>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import GoogleSheets from "../../services/GoogleSheets";
export default {
  data() {
    return {
      text: ""
    };
  },
  beforeMount: async function() {
    this.text = await GoogleSheets.fetchGoogleSheetsPost({
      spreadsheetId: '1dc1Xw5C_YTBN5nHrR_f33lvckRw8OH_WAmrmdCiNarc',
      range: 'A2:h2',
    });
  }
};
</script>

<style scoped></style>
