<template>
  <div class="patient-home">
    <div class="containet">
      <div class="add-container">
        <div v-on:click="onAddPatient">
          <AddButton class="add-button" :text="variables.new"></AddButton>
        </div>
      </div>
      <div>
        <md-card class="patientlist-mat-card">
          <md-card-header>
            <div class="mdp-title">{{variables.screenTitle}}</div>
          </md-card-header>
          <md-card-content>
            <md-table>
              <md-table-row>
                <!-- <md-table-head style="text-align:center">Active</md-table-head> -->
                <md-table-head class="form-list-head cell4">{{variables.code}}</md-table-head>
                <md-table-head class="form-list-head cell5">{{variables.name}}</md-table-head>
                <md-table-head class="form-list-head cell4">{{variables.option}}</md-table-head>
              </md-table-row>
              <md-table-row
                v-for="(form) in patients"
                :key="form.name"
                v-on:click="onPatient(form)"
                style="cursor: pointer;"
              >
                <md-table-cell>{{form.patientId}}</md-table-cell>
                <md-table-cell
                  class="patisnt-name"
                  v-on:click="onPatient(form.patientId)"
                >{{ capitalize(form.firstName) +" "+capitalize(form.lastName) }}</md-table-cell>

                <md-table-cell>
                  <md-button
                    class="delete-button"
                    style="margin:0px;"
                    v-on:click="$event.stopPropagation();deletePatient(form.patientId)"
                  >
                    <md-icon style="color:#ffffff">delete</md-icon>
                  </md-button>
                </md-table-cell>
              </md-table-row>
            </md-table>
          </md-card-content>
        </md-card>
      </div>
    </div>
    <md-progress-spinner v-if="isLoading" class="md-accent" :md-stroke="4" md-mode="indeterminate"></md-progress-spinner>
  </div>
</template>

<script>
// @ is an alias to /src
import { validationMixin } from "vuelidate";
import { PatientListVariables, keys } from "../shared/utils/Constants";
import router from "../shared/router";
import AddButton from "@/components/AddButton.vue";
import axios from "axios";
import * as Url from "@/shared/utils/urls";
export default {
  name: "Patientlist",
  data() {
    return {
      heading: "My Account",
      query: this.$store.state.doctorId,
      patients: [],
      variables: PatientListVariables,
      isLoading: true
    };
  },
  components: {
    AddButton
  },
  mounted() {
    this.created();
  },
  methods: {
    capitalize(value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
    onDelete(index) {
      console.log("delete", index);
    },
    onAddPatient() {
      router.push({ name: "AddPatient" });
    },
    onPatient(patient) {
      router.push({
        name: "PatientDetails",
        params: { patientId: patient.patientId, patientName: patient.firstName }
      });
    },
    onAddForm() {
      router.push({ name: "PatientDetails" });
    },
    created() {
      if (this.$store.state.authenticating == "false") {
        router.push({ name: "Login" });
      } else {
        this.getPatientsList();
      }
    },

    // -----------------------------api's--------------------------------------

    getPatientsList() {
      let headers = {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorization: "Bearer " + this.$store.state.accessToken
      };
      axios
        .get(
          Url.BASE_URL +
            Url.GET_DOCTOR_PATIENTS +
            `?option=${this.query}&role=id`,
          { headers: headers }
        )
        .then(
          res => {
            if (res && res.data) {
              if (res.data.success) {
                let list = JSON.parse(res.data.success);
                let tempList = [];
                tempList = list.patientList;
                tempList.sort(function(a, b) {
                  return b.patientId - a.patientId;
                });
                this.patients = tempList;
                this.apiLoaded = true;
                this.isLoading = false;
              }
            }
          },
          error => {
            this.isLoading = false;
          }
        );
    },
    deletePatient(id) {
      let headers = {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorization: "Bearer " + this.$store.state.accessToken
      };
      axios
        .delete(
          Url.BASE_URL +
            Url.DELETE_PATIENT +
            `doctorId=${this.$store.state.doctorId}&patientId=${id}`,
          { headers: headers }
        )
        .then(
          res => {
            if (res && res.data) {
              if (res.data.success) {
                this.apiLoaded = true;
                this.isLoading = false;
                this.getPatientsList();
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
.cell4 {
  width: 25%;
  text-align: center;
}
.cell5 {
  min-width: 100px;
}
.patientlist-mat-card {
  margin: 20px auto;
  width: 85%;
  flex-direction: column;
}
.edit-button {
  background-color: #31698e !important;
  min-width: 50px !important;
}
.delete-button {
  background-color: #f56b71 !important;
  min-width: 50px !important;
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
}
</style>
