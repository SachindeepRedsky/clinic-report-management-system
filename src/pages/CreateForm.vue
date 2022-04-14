<template>
  <div>
    <div class="save-container">
      <md-button v-if="editTime" class="updatebutton" v-on:click="onSaveAsForm">{{variables.addNew}}</md-button>
      <md-button v-if="editTime" class="savebutton" v-on:click="onSave">{{variables.update}}</md-button>
      <md-button v-if="createTime" class="savebutton" v-on:click="onSave">{{variables.save}}</md-button>
      <md-button class="cancelbutton" v-on:click="onCancel">{{variables.cancel}}</md-button>
    </div>
    <formbuilder
      v-if="isForm"
      v-bind:form="form"
      v-bind:options="{}"
      v-on:change="formChange($event)"
    ></formbuilder>
    <md-dialog-prompt
      :md-active.sync="showDialog"
      v-model="form.name"
      :md-title="variables.dialogtitle"
      md-input-maxlength="30"
      :md-input-placeholder="variables.typeName"
      :md-confirm-text="variables.create"
      @md-confirm="onDialogConform()"
      @md-cancel="onDialogCancel()"
    />
  </div>
</template>

<script>
import { FormBuilder } from "vue-formio";
import { CreateFormVariables, keys } from "../shared/utils/Constants";
import router from "../shared/router";
import axios from "axios";
import * as Url from "@/shared/utils/urls";

export default {
  props: ["for", "template"],
  data() {
    return {
      form: { name: "" },
      showDialog: false,
      isForm: false,
      editTime: false,
      createTime: false,
      variables: CreateFormVariables,
      _formTemp: undefined
    };
  },
  components: { FormBuilder },
  mounted() {
    this.checkParms();
  },

  methods: {
    checkParms() {
      if (this.for == "create") {
        this.showDialog = true;
        this.createTime = true;
      } else if (this.for == "edit" && this.template != undefined) {
        this.editTime = true;
        this.formId = this.template.templateId;
        this.form.name = this.template.templateName;
        if (this.template.templateData) {
          let _value = JSON.parse(this.template.templateData);
          if (Array.isArray(_value.templateRecord)) {
            this.form.components = _value.templateRecord;
          } else {
            this.form.components = JSON.parse(_value.templateRecord);
          }
        }
        setTimeout(() => {
          this.isForm = true;
        }, 100);
      } else {
        router.push({ name: "home" });
      }
    },
    formChange: function(schema) {
      if (schema && schema.name) {
        this._formTemp = schema;
      }
    },
    onSave() {
      if (this.for && this.for == "create") {
        if (this._formTemp) {
          this.createForm();
        }
      } else if (this.for && this.for == "edit") {
        if (this._formTemp) {
          this.onEditForms();
        }
      }
    },
    createForm() {
      let headers = {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorization: "Bearer " + this.$store.state.accessToken
      };
      let body = {
        creationTime: new Date(),
        doctorId: this.$store.state.doctorId,
        doctorName: this.$store.state.userName,
        extraData: "",
        lastUpdatedTime: new Date(),
        templateData: JSON.stringify({
          templateRecord: this._formTemp.components
        }),
        templateName: this._formTemp.name
      };

      axios
        .post(Url.BASE_URL + Url.POST_TEMPLATE, body, { headers: headers })
        .then(res => {
          if (res && res.data) {
            router.push({ name: "Home" });
          }
        });
    },
    onSaveAsForm() {
      this.showDialog = true;
    },
    onEditForms() {
      this.isLoading = true;
      let headers = {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorization: "Bearer " + this.$store.state.accessToken
      };
      let body = {
        templateRecord: JSON.stringify(this._formTemp.components)
      };
      axios
        .put(Url.BASE_URL + Url.EDIT_FORM + `templateId=${this.formId}`, body, {
          headers: headers
        })
        .then(res => {
          if (res && res.data) {
            this.showDialog = false;
            router.push({ name: "Home" });
            // this.isLoading = false;
          }
        });
    },

    onCancel() {
      router.go(-1);
    },
    onDialogConform() {
      if (this.for == "create") {
        if (this.form.name == "") {
          this.showDialog = true;
        } else {
          setTimeout(() => {
            this.isForm = true;
          }, 100);
        }
      } else if (this.for == "edit") {
        this.createForm();
      }
    },
    onDialogCancel() {
      this.showDialog = true;
      router.go(-1);
    }
  }
};
</script>

<style lang="scss">
.page {
  width: 100%;
}
.save-container {
  width: 100%;
  height: 10vh;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.formio {
  padding: 0px !important;
  max-width: 100%;
  margin: auto;
}
.formcomponents {
  padding: 0px !important;
}
.formarea {
  padding: 10px 50px !important;
  align-items: center;
  border: 1px solid rgb(170, 170, 170);
}
.md-dialog {
  max-height: 50%;
  max-width: 50%;
  margin: 0px;
}
.savebutton {
  background-color: rgb(138, 187, 233);
}
.updatebutton {
  background-color: rgb(134, 233, 172);
  margin-right: 20px;
}
.md-dialog-container {
  transform: translate(0%, 0%) scale(1);
  width: 100%;
  max-width: 100%;
  height: 100%;
  max-height: 100%;
}
@media (max-width: 650px) {
.formarea {
  padding: 0px !important;
}
}
</style>
