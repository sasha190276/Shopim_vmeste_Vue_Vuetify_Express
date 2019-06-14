import api from "@/services/api";
export default {
  async fetchHeadersSample() {
    let result = await api().get("headers_sample");
    //console.log(result.data);
    return result.data;
  },
  async fetchHeadersSampleTableWithPay() {
    let result = await api().get("headers_sample_tableWithPay");
    //console.log(result.data);
    return result.data;
  },
  async fetchHeadersSampleUpdate(header) {
    await api().put("headers_sample", header);
  },
  async fetchHeadersGoogleSheetsWithRepliesAboutPayments() {
    let result = await api().get("headersGoogleSheetsWithRepliesAboutPayments");
    return result.data;
  }
};
