<template>
  <div>
    <md-card class="patientlist-mat-card">
      <md-card-header>
        <div class="mdp-title">{{variables.screenTitle}}</div>
      </md-card-header>

      <md-card-content>
        <md-table>
          <md-table-row>
            <md-table-head class="form-list-head cell1">{{variables.code}}</md-table-head>
            <md-table-head class="form-list-head cell2">{{variables.name}}</md-table-head>
            <md-table-head class="form-list-head cell1">{{variables.option}}</md-table-head>
          </md-table-row>
          <md-table-row
            v-for="(form,index) in forms"
            :key="index"
            v-on:click="onPatient(form)"
            class="form-rows"
          >
            <md-table-cell class="cell1">{{form.templateId}}</md-table-cell>
            <md-table-cell class="patisnt-name cell2">{{ capitalize(form.templateName)}}</md-table-cell>

            <md-table-cell>
              <div class="bottons">
                <div
                  class="edit-button1"
                  style="margin:0px;"
                  v-on:click="$event.stopPropagation();onEdit(form)"
                >
                  <md-icon style="color:#ffffff">edit</md-icon>
                </div>
                <div
                  class="edit-button1 delete-button"
                  style="margin:0px;"
                  v-on:click="$event.stopPropagation();onDelete(form.templateId)"
                >
                  <md-icon style="color:#ffffff">delete</md-icon>
                </div>
              </div>
            </md-table-cell>
          </md-table-row>
        </md-table>
      </md-card-content>
    </md-card>
    <md-progress-spinner v-if="isLoading" class="md-accent" :md-stroke="4" md-mode="indeterminate"></md-progress-spinner>
  </div>
</template>

<script>
// @ is an alias to /src
import { validationMixin } from "vuelidate";
import { CreateFormVariables, keys } from "../shared/utils/Constants";
import router from "../shared/router";
import axios from "axios";
import * as Url from "@/shared/utils/urls";
import qs from "qs";
export default {
  name: "FormList",
  data() {
    return {
      heading: "My Account",
      forms: [],
      variables: CreateFormVariables,
      isLoading: false,
      query: this.$store.state.userName,
      isLoading: true
    };
  },

  mounted() {
    this.getFormsList();
  },

  methods: {
    onEdit(form) {
      router.push({
        name: "CreateForm",
        params: { for: "edit", template: form }
      });
    },
    capitalize(value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },

    // -----------------------------api's--------------------------------------

    getFormsList() {
      let headers = {
        accept: "application/json",
        Authorization: "Bearer " + this.$store.state.accessToken
      };
      axios
        .get(
          Url.BASE_URL + Url.GET_FORMS + `option=${this.query}&role=doctorName`,
          { headers: headers }
        )
        .then(
          res => {
            if (res && res.data) {
              if (res.data.success) {
                let list = JSON.parse(res.data.success);
                let tempList = [];
                tempList = list;
                tempList.sort(function(a, b) {
                  return b.templateId - a.templateId;
                });
                this.forms = tempList;
                this.apiLoaded = true;
                this.isLoading = false;
              }
            }
          },
          error => {
            this.isLoading = false;
            alert("Please login again!");
          }
        );
    },
    onDelete(id) {
      this.isLoading = true;
      let headers = {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorization: "Bearer " + this.$store.state.accessToken
      };
      axios
        .delete(
          Url.BASE_URL +
            Url.DELETE_FORM +
            `doctorId=${this.$store.state.doctorId}&templateId=${id}`,
          { headers: headers }
        )
        .then(
          res => {
            if (res && res.data) {
              if (res.data.success) {
                this.apiLoaded = true;
                this.isLoading = false;
                this.getFormsList();
              }
            }
          },
          error => {
            this.isLoading = false;
          }
        );
    }
  }
};
</script>

<style lang="scss">
.patient-home {
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

.mdp-title {
  font-size: 24px;
}

.form-list-head {
  font-size: 14px;
  color: rgb(80, 80, 80) !important;
}
.form-rows {
  cursor: pointer;
  height: 60px;
}
.cell1 {
  width: 25%;
  text-align: center;
}
.cell2 {
  min-width: 100px;
}
.patientlist-mat-card {
  margin: 20px auto;
  width: 85%;
  flex-direction: column;
}
.bottons {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.edit-button1 {
  background-color: #31698e !important;
  min-width: 50px !important;
  margin: 0px 8px !important;
  height: 36px !important;
  display: flex;
  justify-content: center;
  border-radius: 2px;
}
.delete-button {
  background-color: #f56b71 !important;
}
.edit-button1:hover {
  background-color: #1e77b3 !important;
}
.delete-button:hover {
  background-color: #e65b62 !important;
}
.icon {
  color: #ffffff;
}
.patisnt-name {
  text-align: left;
}
@media (max-width: 650px) {
  .add-container {
    width: 92%;
    display: flex;
    justify-content: flex-end;
    padding: 0px;
  }
  .patientlist-mat-card {
    width: 92%;
  }
  .mdp-title {
    font-size: 18px;
    color: rgb(49, 49, 49);
  }
  .md-card-header {
    padding: 16px 0px 0px 0px;
  }
  .form-list-head {
    font-weight: 500;
  }
  .cell1 {
    min-width: 10px !important;
    text-align: center;
  }
  .cell2 {
    min-width: 100px;
  }
  .bottons {
    flex-wrap: wrap;
  }
  .edit-button1 {
    margin: 0px 0px 4px 4px !important;
  }
}
</style>
