import api from "@/services/api";
export default {
  async fetchGoogleSheetsPost(params) {
    let result = await api().post("googlesheets", params);
    //console.log(result.data);
    return result.data;
  },
  // async fetchUsersImport(users) {
  //   let result = await api().put("users", users);
  //   //console.log(users);
  //   return result.data;
  // },
  // async fetchTestGoogle() {
  //   let result = await api().get("users");
  //   return result.data;
  // }
};
