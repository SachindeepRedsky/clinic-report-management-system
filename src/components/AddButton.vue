<template>
  <div>
    <md-button class="addbutton">
      <img src="../assets/add.png" />
      <span>{{text}}</span>
    </md-button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class AddButton extends Vue {
  @Prop() private text!: string;
  data() {
    return {};
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.addbutton {
  height: 32px;
  background-color: #2f6a8c;
  display: flex;
  justify-content: center;
  outline: none;
  border-radius: 5px;
  color: #ffffff;
  padding: 0px 10px;
  img {
    height: 10px;
    margin-right: 5px;
  }
  span {
    color: #ffffff;
  }
}
.md-button {
  text-transform: none;
  margin: 0px !important;
}

</style>
