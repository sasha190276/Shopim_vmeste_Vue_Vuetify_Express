import api from "@/services/api";
export default {
  async fetchUsersGet() {
    let result = await api().post("users");
    return result.data;
  },
  async fetchUsersImport(users) {
    let result = await api().put("users", users);
    //console.log(users);
    return result.data;
  },
  async fetchTestGoogle() {
    let result = await api().get("users");
    return result.data;
  }
};
