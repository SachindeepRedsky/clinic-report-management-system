<template>
  <formio
    :src="formPath"
    url
    :form="{display: 'form'}"
    submission
    :options="{}"
    v-on:submit="submit"
  ></formio>
</template>

<script>
// @ is an alias to /src
import { FormBuilder } from "vue-formio";
import { Form } from "vue-formio";
export default {
  name: "AddMember",
  data() {
    return {
      formPath: JSON.parse(localStorage.getItem("form"))
    };
  },
  components: { FormBuilder, formio: Form },

  methods: {
    submit: function() {}
  }
};
</script>

<style lang="scss">
.page {
  width: 100%;
}
</style>
