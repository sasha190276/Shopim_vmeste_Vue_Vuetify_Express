import api from "@/services/api";
export default {
  async fetchPurchases(purchaseName) {
    let result = await api().post("import_purchase", { name: purchaseName });
    return result.data;
  },
  async fetchPurchaseAndOrdersImport(importObject) {
    let result = await api().put("import_purchase", importObject);
    return result.data;
  }
};
