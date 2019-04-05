import api from "@/services/api";
export default {
  async fetchHeadersSample() {
    let result = await api().get("headers_sample");
    return result.data;
  }
};
