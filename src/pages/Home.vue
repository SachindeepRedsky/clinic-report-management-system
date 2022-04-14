<template>
  <div class="page-home">
    <div class="containet">
      <div class="add-container">
        <div class="md-button-add" v-on:click="onAddForm">
          <AddButton :text="variables.new"></AddButton>
        </div>
      </div>
      <div class="form-list">
        <FormList></FormList>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import AddButton from "@/components/AddButton.vue";
import FormList from "@/components/FormList.vue";
import { HomeVariables } from "../shared/utils/Constants";
import router from "../shared/router";
import { HeaderService } from "../shared/services/HeaderService";

export default {
  name: "Home",
  data() {
    return {
      variables: HomeVariables,
      fullscreen: Boolean
    };
  },
  components: {
    AddButton,
    FormList
  },

  methods: {
    onAdd: function() {
      router.push({ name: "AddMember" });
    },
    onAddForm: function() {
      router.push({ name: "CreateForm", params: { for: "create" } });
    },
    onViewForm: function() {
      router.push({ name: "FormList" });
    }
  },
  created() {
    HeaderService.updateHeader(true)
    if (this.$store.state.authenticating == "false") {
      router.push({ name: "Login" });
    }
  }
};
</script>

<style lang="scss">
.page-home {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: row;
}

.containet {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.add-container {
  width: 85%;
  height: 50px;
  margin: auto;
  align-items: center;
  padding-top: 15px;
}

.form-list {
  width: 100%;
  margin: 20px auto;
}
@media (max-width: 650px) {
  .add-container {
    width: 92%;
    display: flex;
    justify-content: flex-end;
    padding: 0px;
  }

}
</style>
