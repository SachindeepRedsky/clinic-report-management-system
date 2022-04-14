<template>
  <div class="patient-detailed-page">
    <div class="containet-detail">
      <div class="add-report-container">
        <div v-on:click="onAddForm">
          <AddButton class="add-button" :text="variables.new"></AddButton>
        </div>
        <div class="patient-detail">
          <label>{{variables.patientName + capitalize(patientName)}}</label>
        </div>
      </div>
      <md-card class="patient-details-card">
        <md-card-header>
          <div class="report-title">{{variables.screenTitle}}</div>
        </md-card-header>
        <md-card-content class="report-card-content">
          <div class="all-reports">
              <md-list>
                <md-list-item
                  v-for="(form,index) in forms"
                  v-bind:key="index"
                  @click="goToDetails(index)"
                  v-bind:class="selectedIndex==index?'selected-report':''"
                >{{form.reportName}}</md-list-item>
              </md-list>
          </div>
          <formio
            class="reports-show"
            v-if="isForm"
            :src="formPath"
            :submission="dialogSubmission"
            :options="{readOnly:true}"
            v-on:change="formChange($event)"
          ></formio>
          <md-empty-state
            v-if="isEmpty">
            <img style="height:180px;margin-bottom:30px;" src="../assets/tasks.png" />
             <h1>{{variables.createNewReport}}</h1>
            <md-button class="md-primary md-raised" v-on:click="onAddForm">{{variables.createReport}}</md-button>
          </md-empty-state>
        </md-card-content>
      </md-card>
    </div>
    <md-dialog :md-active.sync="showDialog" class="report-form-add">
      <md-dialog-title>{{variables.cardTitel}}</md-dialog-title>
      <div>
        <md-field class="md-select">
          <label for="font">{{variables.placeholder}}</label>
          <md-select v-model="tempSelectedTemplate" @md-selected="onTemplateSelect($event)">
            <md-option
              v-for="temp in doctorTemplate"
              v-bind:key="temp.templateId"
              :value="JSON.stringify(temp)"
            >{{temp.templateName}}</md-option>
          </md-select>
        </md-field>
      </div>
      <div class="dialog-form">
        <formio
          v-if="isDialogForm"
          :src="formDialogPath"
          v-bind:form="formOutput"
          :options="{}"
          v-on:submit="dialogFormSubmit($event)"
          v-on:change="formChange($event)"
        ></formio>
      </div>
    </md-dialog>
    <md-progress-spinner v-if="isLoading" class="md-accent" :md-stroke="4" md-mode="indeterminate"></md-progress-spinner>
  </div>
</template>

<script>
// @ is an alias to /src
import AddButton from "@/components/AddButton.vue";
import { validationMixin } from "vuelidate";
import { PatientDetailsVariables, keys } from "../shared/utils/Constants";
import router from "../shared/router";
import { Form } from "vue-formio";
import axios from "axios";
import * as Url from "@/shared/utils/urls";
export default {
  props: ["patientId", "patientName"],
  data() {
    return {
      heading: "My Account",
      doctorTemplate: [],
      tempSelectedTemplate: undefined,
      selectedTemplate: undefined,
      isDialogForm: false,
      formDialogPath: undefined,
      formOutput: undefined,
      forms: [],
      isForm: false,
      variables: PatientDetailsVariables,
      formPath: undefined,
      showDialog: false,
      dialogSubmission: undefined,
      selectedIndex: 0,
      isLoading: true,
      isEmpty: false
    };
  },
  components: {
    formio: Form,
    AddButton
  },

  mounted() {
    this.getDoctorTemplate();
  },
  methods: {
    onDelete(index) {
    },
    getPatientReports() {
      let headers = {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorization: "Bearer " + this.$store.state.accessToken
      };
      axios
        .get(
          Url.BASE_URL +
            Url.GET_PATIENTS_REPORTS +
            `option=${this.patientId}&role=patientId`,
          { headers: headers }
        )
        .then(
          res => {
            if (res && res.data) {
              console.log("patientDetails", res);
              if (res.data.success) {
                let list = JSON.parse(res.data.success);
                if (list.length > 0) {
                  this.forms = list;
                  console.log("report", this.forms[0].reportData);
                  this.dialogSubmission = {
                    data: JSON.parse(this.forms[0].reportData)
                  };
                  let _value = JSON.parse(this.forms[0].extraData);
                  _value = JSON.parse(_value);
                  if (Array.isArray(_value.templateRecord)) {
                    this.formPath = { components: _value.templateRecord };
                  } else {
                    this.formPath = {
                      components: JSON.parse(_value.templateRecord)
                    };
                  }
                  this.isForm = true;
                  this.isEmpty = false;
                  this.apiLoaded = true;
                  this.isLoading = false;
                } else {
                  this.isEmpty = true;
                }
              }
            }
          },
          error => {
            console.log("error", error);
            this.isLoading = false;
          }
        );
    },
    onAddForm() {
      this.showDialog = true;
    },
    capitalize(value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
    getDoctorTemplate() {
      let headers = {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorization: "Bearer " + this.$store.state.accessToken
      };
      axios
        .get(
          Url.BASE_URL +
            Url.GET_FORMS +
            `option=${this.$store.state.userName}&role=doctorName`,
          { headers: headers }
        )
        .then(
          res => {
            if (res && res.data) {
              if (res.data.success) {
                let list = JSON.parse(res.data.success);
                this.doctorTemplate = list;
                this.apiLoaded = true;
                this.isLoading = false;
                this.getPatientReports();
              }
            }
          },
          error => {
            this.isLoading = false;
          }
        );
    },
    onTemplateSelect(args) {
      this.isDialogForm = false;
      this.selectedTemplate = JSON.parse(this.tempSelectedTemplate);
      console.log("selectedTemplate   ", this.selectedTemplate);
      let _value = JSON.parse(this.selectedTemplate.templateData);
      if (Array.isArray(_value.templateRecord)) {
        this.formDialogPath = { components: _value.templateRecord };
      } else {
        this.formDialogPath = { components: JSON.parse(_value.templateRecord) };
      }
      setTimeout(() => {
        this.isDialogForm = true;
      }, 300);
    },

    dialogFormSubmit(args) {
      this.isLoading = true;
      if (args.data) {
        let headers = {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: "Bearer " + this.$store.state.accessToken
        };
        let body = {
          creationTime: new Date(),
          doctorId: this.$store.state.doctorId,
          doctorName: this.$store.state.userName,
          extraData: JSON.stringify(this.selectedTemplate.templateData),
          patientId: this.patientId,
          patientName: this.patientName,
          reportData: JSON.stringify(args.data),
          reportName: this.selectedTemplate.templateName,
          updatedTime: new Date()
        };
        axios
          .post(Url.BASE_URL + Url.CREATE_REPORT, body, { headers: headers })
          .then(res => {
            if (res && res.data) {
              setTimeout(() => {
                this.showDialog = false;
                this.isDialogForm = false;
                this.getDoctorTemplate();
              }, 1000);
            }
          });
      }
    },
    formChange(args) {
    },
    goToDetails(index) {
      this.selectedIndex = index;
      this.isForm = false;
      this.dialogSubmission = {
        data: JSON.parse(this.forms[index].reportData)
      };
      console.log("dialogSubmission", this.dialogSubmission);
      let _value = JSON.parse(this.forms[index].extraData);
      _value = JSON.parse(_value);
      if (Array.isArray(_value.templateRecord)) {
        this.formPath = { components: _value.templateRecord };
      } else {
        this.formPath = {
          components: JSON.parse(_value.templateRecord)
        };
      }
      setTimeout(() => {
        this.isForm = true;
      }, 100);
    }
  }
};
</script>

<style lang="scss">
.patient-detailed-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
}
.containet-detail {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
.add-report-container{
  width: 85%;
  height: 50px;
  margin: auto;
  align-items: center;
  padding-top: 15px;
  display: flex;
  justify-content: space-between;
}
.patient-details-card {
  width: 85%;
  margin: 20px auto;
}
.report-title{
  font-size: 24px;
   padding: 4px;
}

.report-card-content {
  display: flex;
  height: 100%;
  width: 100%;
  border-top: 1px solid rgb(150, 150, 150);
  padding: 0px !important;
}
.all-reports {
  width: 20%;
  overflow-y: auto;
  border-right: 0.1px solid  rgb(100, 100, 100) ;
}
.selected-report {
  background-color: rgb(209, 209, 209);
}
.reports-show {
  margin: 20px auto;
  border: 1px solid rgba(80, 80, 80, 0.651);
  padding: 15px;
  min-width: 50%;
  min-height: 70vh;
}

.report-form-add {
  overflow: scroll;
  height: 80%;
  width: 80%;
  margin: auto;
  align-self: center;
}
.md-select {
  width: 60%;
  margin: auto;
}
.md-menu-content-container {
  width: 100% !important;
}
.dialog-form {
  padding: 20px 50px;
  margin-top: 20px;
}

@media (max-width: 650px) {
.add-report-container{
  width: 96%;
  padding-top: 0px;
}
.report-title{
  font-size: 18px;
   padding: 0px 0px 16px 0px;
  color:rgb(49, 49, 49);
}
.patient-details-card {
  width: 96%;
  border: 0.4px solid rgb(100, 100, 100);
}
.all-reports {
  width: 25%;
}
.reports-show {
  margin: 20px auto;
  border: 1px solid rgba(80, 80, 80, 0.651);
  padding: 15px;
  min-width: 70%;
  min-height: 50vh;
}
}
</style>
