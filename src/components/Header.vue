<template>
  <div class="page">
    <div class="logo-container">
      <img v-on:click="onHome" src="../assets/logo.png" />
    </div>
    <h1 class="header-name">{{variables.webname}}</h1>
    <div class="logo-container">
      <img v-on:click="onDoctor" class="profileImage" src="../assets/doctor.jpg" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { HeaderVariables } from "../shared/utils/Constants";
import router from "../shared/router";
export default {
  data() {
    return {
      variables: HeaderVariables
    };
  },
  methods: {
    onHome() {
      router.push({ name: "Home" });
    },
    onDoctor() {
      router.push({ name: "PatientList" });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.page {
  height: 70px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  background-color: #2f6a8c;
  margin: 0;
  align-items: center;
}
.logo-container {
  height: 100%;
  width: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    cursor: pointer;
    height: 70%;
    border-radius: 100%;
  }
}

.header-name {
  text-align: center;
  color: #ffffff;
}
</style>
