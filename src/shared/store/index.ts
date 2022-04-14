import Vue from "vue";
import Vuex from "vuex";



Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    authenticating: "false",
    accessToken: "",
    doctorId: "",
    userName: "", 
    windowWidth: window.innerWidth,
  },
  getters: {
    isLoggedIn: (state) => {
      return state.accessToken ? true : false
    },
    authenticating: (state) => {
      return state.authenticating
    }
  }, 
  mutations: {
    load(state) {
      if (localStorage.getItem("store")) {
        this.replaceState(
          Object.assign(state, JSON.parse(<string>localStorage.getItem("store")))
        )
      }
    },
    save(state, data) {
      if (data.accessToken != undefined) {
        state.accessToken = data.accessToken;
      };
      if (data.doctorId != undefined) {
        state.doctorId = data.doctorId;
      };
      if (data.authenticating != undefined) {
        state.authenticating = data.authenticating
      };
      if (data.userName != undefined) {
        state.userName = data.userName
      }
      localStorage.setItem('store', JSON.stringify(state))
    }

  },
  actions: {},
  modules: {}
});
