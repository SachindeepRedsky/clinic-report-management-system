<template>
  <div class="patient-page">
    <form novalidate @submit.prevent="validateUser">
      <md-card class="patient-mat-card">
        <md-card-header>
          <div class="md-title">{{variables.screenTitle}}</div>
        </md-card-header>
        <md-card-content>
          <div class="feild-container">
            <label class="feild-label">{{variables.firstname}}</label>
            <div class="feild">
              <md-field :class="getValidationClass('firstName')">
                <label for="first-name">{{variables.firstname}}</label>
                <md-input
                  name="first-name"
                  id="first-name"
                  v-model="form.firstName"
                  :disabled="sending"
                />
                <span
                  class="md-error"
                  v-if="!$v.form.firstName.required"
                >{{variables.firstnameError}}</span>
              </md-field>
            </div>
          </div>

          <div class="feild-container">
            <label class="feild-label">{{variables.lastname}}</label>
            <div class="feild">
              <md-field :class="getValidationClass('lastName')">
                <label for="last-name">{{variables.lastname}}</label>
                <md-input
                  name="last-name"
                  id="last-name"
                  autocomplete="family-name"
                  v-model="form.lastName"
                  :disabled="sending"
                />
                <span class="md-error" v-if="!$v.form.lastName.required">{{variables.lastnameError}}</span>
              </md-field>
            </div>
          </div>

          <div class="feild-container" v-if="role == 'patient'">
            <label class="feild-label">{{variables.dob}}</label>
            <div class="feild">
              <md-datepicker
                v-model="form.dob"
                :class="getValidationClass('dob')"
                style="overflow:hidden; width:100%;"
                id="dob">
                <label>{{variables.dob}}</label>
              </md-datepicker>
            </div>
          </div>
        </md-card-content>
        <md-card-actions>
          <md-button
            type="submit"
            class="create-patint-btn "
            :disabled="sending"
            v-on:click="CreatePatient"
          >{{variables.createUser}}</md-button>
        </md-card-actions>
      </md-card>
    </form>
    <md-dialog-alert
      :md-active.sync="confirm_dialog"
      md-content="New Patient added successfully."
      md-confirm-text="Done"
    />
    <md-progress-spinner v-if="isLoading" :md-stroke="4" class="md-accent" md-mode="indeterminate"></md-progress-spinner>
  </div>
</template>

<script>
// @ is an alias to /src
import { validationMixin } from "vuelidate";
import { AddPatientVariables } from "../shared/utils/Constants";
import axios from "axios";
import router from "../shared/router";
import * as Url from "@/shared/utils/urls";
import Vue from "vue";
import moment from "moment";
import VueSimpleAlert from "vue-simple-alert";
import {
  required,
  email,
  minLength,
  maxLength
} from "vuelidate/lib/validators";
export default {
  name: "AddPatient",
  data() {
    return {
      query: this.$store.state.doctorId,
      heading: "My Account",
      isLoading: false,
      variables: AddPatientVariables,
      confirm_dialog: false,
      form: {
        firstName: null,
        lastName: null,
        dob: null
      },
      sending: false,
      role: "patient"
    };
  },
  validations: {
    form: {
      firstName: {
        required,
        minLength: minLength(3)
      },
      lastName: {
        required,
        minLength: minLength(3)
      },
      dob: {
        required
      }
    }
  },
  methods: {
    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    validateUser() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
      }
    },
    onPatientList() {
      router.push({ name: "PatientList" });
    },
    CreatePatient() {
      if (
        this.form.dob == null ||
        this.form.firstName == null ||
        this.form.lastName == null
      ) {
        return;
      } else {
        this.isLoading = true;
        let _date = moment(this.form.dob).format("DD/MM/YYYY");
        let body = {
          dateOfBirth: _date,
          extraData: this.form.firstName,
          firstName: this.form.firstName,
          lastName: this.form.lastName
        };
        let headers = {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: "Bearer " + this.$store.state.accessToken
        };

        axios
          .post(
            Url.BASE_URL + Url.CREATE_PATIENT + `?doctorId=${this.query}`,
            body,
            { headers: headers }
          )
          .then(
            res => {
              if (res && res.data) {
                // this.$alert("New Patient Added.");
                this.isLoading = false;
                this.form = {
                  firstName: null,
                  lastName: null,
                  dob: null
                };
                this.confirm_dialog = true;
                if (window.confirm("Patient added successfully")) {
                  this.onPatientList();
                } else {}
              }
            },
            error => {
              this.isLoading = false;
              alert("Something went wrong");
            }
          );
      }
    }
  }
};
</script>

<style lang="scss">
.patient-page {
  width: 100%;
  height: 100%;
  padding: 0px;
}

.patient-mat-card {
  width: 80%;
  display: flex;
  flex-direction: column;
  margin: 50px auto;
}

.feild-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.feild {
  width: 70%;
  display: flex;
  justify-content: flex-start;
}
.create-patint-btn {
  align-self: center;
  color: white !important;
  background-color: #2f6a8c;
}
.md-field > .md-icon {
  margin: 4px auto;
  position: initial !important;
}
.md-field > .md-icon:after {
  height: 0px;
}
@media (max-width: 650px) {
.patient-mat-card {
  width: 92%;
  height: 370px;
}
.feild {
  width: 65%;
}
}
</style>
