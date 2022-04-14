<template >
  <div id="app">
    <Header></Header>
    <div v-if="topShow" class="top-page">
      <div v-on:click="onPatient()" class="bar-item">
        <img
          class="head-icons icon-size"
          :src="$route.name=='PatientList'?require('./assets/patient_selected.png'):require('./assets/patient.png')"
        />
        <div v-bind:class="$route.name=='PatientList'? 'click-font' :''">Patients</div>
      </div>
      <div class="right-side">
        <div class="bar-item" v-on:click="onHome()">
          <img
            class="head-icons"
            :src="$route.name=='Home'?require('./assets/home_selected.png'):require('./assets/home.png')"
          />
          <div v-bind:class="$route.name=='Home'? 'click-font' :''">Home</div>
        </div>
        <!-- <div class="bar-item" v-on:click="onRegister()">
          <div class="icons">/</div>
          <img
            class="head-icons icon-size"
            :src="$route.name=='AddMember'?require('./assets/register_selected.png'):require('./assets/register.png')"
          />
          <div v-bind:class="$route.name=='AddMember'? 'click-font' :''">Register</div>
        </div> -->
        <div class="bar-item" v-on:click="onLogout()">
          <div class="icons">/</div>
          <img
            class="head-icons"
            :src="$route.name=='Login'?require('./assets/logout_selected.png'):require('./assets/logout.png')"
          />
          <div v-bind:class="$route.name=='Login'? 'click-font' :''">Logout</div>
        </div>
      </div>
    </div>
    <router-view />
  </div>
</template>
<script>
// @ is an alias to /src
import Header from "@/components/Header.vue";
import router from "./shared/router";
import store from "./shared/store";
import { HeaderService } from "./shared/services/HeaderService";
import { Form } from "vue-formio";
export default {
  data() {
    return {
      heading: "My Account",
      isLoading: true,
      topShow: Boolean
    };
  },
  methods: {
    onHome() {
      router.push({ name: "Home" });
    },
    onRegister() {
      router.push({ name: "AddMember" });
    },
    onPatient() {
      router.push({ name: "PatientList" });
      this.roughtFocus = true;
    },
    onLogout() {
      let value = {
        accessToken: "",
        authenticating: "false",
        doctorId: "",
        userName: ""
      };
      store.commit("save", value);
      store.commit("load");
      setTimeout(() => {
        router.push({ name: "Login" });
      }, 50);
    }
  },
  components: {
    Header
  },
  created() {
    this.sideDrawer = HeaderService.getHeader().subscribe(state => {
      if (state == true) {
        this.topShow = true;
      } else {
        this.topShow = false;
      }
    });

    this.currentRoute;
    if (this.$store.state.authenticating == "true") {
      router.push({ name: "Home" });
    } else {
      router.push({ name: "Login" });
    }
  },
  computed: {
    currentRouteName() {
      return this.$route.name;
    }
  }
};
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: #ffffff;
  padding: 0;
  margin: 0;
  min-height: 100vh;
  max-width: 100vw;
}

.md-accent {
  position: absolute !important;
  top: 50vh;
  left: 46vw;
  z-index: 20;
}
.top-page {
  user-select: none;
  height: 50px;
  width: 100%;
  display: flex;
  padding: 0px 40px;
  justify-content: space-between;
  align-items: center;
}
.bar-item {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.right-side {
  display: flex;
  flex-direction: row;
}
.head-icons {
  width: 18px;
  margin: 0px 4px 0px 0px;
}
.icons {
  margin: 0px 5px 0px 20px;
  width: 18px;
}
.icon-size {
  width: 20px;
}
.click-font {
  color: #f56b71;
  align-items: center;
}
:root {
  --md-theme-default-accent: #2f6a8c !important;
}

@media (max-width: 650px) {
  .top-page {
    height: 70px;
    padding: 0px 10px;
    flex-wrap: wrap-reverse;
  }
}
</style>
