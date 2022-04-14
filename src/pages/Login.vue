<template>
  <div class="login-page">
    <form novalidate @submit.prevent="validateUser">
      <md-card class="login-mat-card">
        <md-card-header>
          <div class="md-title">{{variables.screenTitle}}</div>
        </md-card-header>

        <md-card-content>
          <div class="feild-container">
            <label>{{variables.firstname}}</label>
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
            <label>{{variables.lastname}}</label>
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

          <div class="feild-container">
            <label>{{variables.dob}}</label>
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

          <div class="feild-container">
            <label>{{variables.password}}</label>
            <div class="feild">
              <md-field :class="getValidationClass('password')">
                <label for="password">{{variables.password}}</label>
                <md-input
                  type="password"
                  name="password"
                  id="password"
                  autocomplete="family-name"
                  v-model="form.password"
                  :disabled="sending"
                />
                <span class="md-error" v-if="!$v.form.password.required">{{variables.passwordError}}</span>
              </md-field>
            </div>
          </div>
          <md-card-actions>
            <div class="register-field" v-on:click="onRegister">{{variables.register}}</div>
            <md-button
              type="submit"
              class="md-primary create-btn"
              :disabled="sending"
              v-on:click="login"
            >{{variables.login}}</md-button>
          </md-card-actions>
        </md-card-content>
      </md-card>
      <md-progress-spinner
        v-if="isLoading"
        class="md-accent"
        :md-stroke="4"
        md-mode="indeterminate"
      ></md-progress-spinner>
    </form>
  </div>
</template>

<script>
// @ is an alias to /src
import { validationMixin } from "vuelidate";
import { LoginVariables } from "../shared/utils/Constants";
import router from "../shared/router";
import axios from "axios";
import * as Url from "@/shared/utils/urls";
import qs from "qs";
import moment from "moment";
import { HeaderService } from "../shared/services/HeaderService";

import {
  required,
  email,
  minLength,
  maxLength
} from "vuelidate/lib/validators";
export default {
  name: "Login",
  data() {
    return {
      newspeciality: "",
      newcreateby: "",
      selectedItem: {},
      apiLoaded: false,
      isLoading: false,
      variables: LoginVariables,
      form: {
        firstName: "",
        lastName: "",
        dob: null,
        password: ""
      },
      sending: false
    };
  },
  mounted() {
    HeaderService.updateHeader(false)
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
      },
      password: {
        required,
        minLength: minLength(3)
      }
    }
  },
  methods: {
    onRegister() {
      router.push({ name: "AddMember" });
    },
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

    login: function() {
      if (
        this.form.dob == null ||
        this.form.firstName == "" ||
        this.form.lastName == "" ||
        this.form.password == ""
      ) {
        return;
      } else {
        this.isLoading = true;
        let _date = moment(this.form.dob).format("DD/MM/YYYY");
        let body = {
          userName: `${this.form.firstName.toLowerCase()}_${this.form.lastName.toLowerCase()}_${_date}`,
          password: this.form.password,
          clientId: Url.CLIENT_ID,
          clientSecret: Url.CLIENT_SECRET
        };
        let headers = {
          "Content-Type": "application/json",
          accept: "application/json"
        };
        axios.post(Url.BASE_URL + Url.LOGIN, body, { headers: headers }).then(
          res => {
            if (res && res.data.token) {
              // console.log("token", res.data.token.access_token);y
              let value = {
                accessToken: res.data.token.access_token,
                authenticating: "true",
                userName: res.data.token.additionalInfo.username,
                doctorId: res.data.token.additionalInfo.doctorId,
                showHeader: true
              };
              this.$store.commit("save", value);
              this.isLoading = false;
              router.push({ name: "Home" });
            } else if (res.data) {
              this.isLoading = false;
              if (
                res.data.error ==
                '400 Bad Request: [{"error":"invalid_grant","error_description":"Bad credentials"}]'
              ) {
                alert("Invalid Details");
              }
            }
          }
        ),
          error => {
            alert("Something went wrong!");
          };
      }
    }
  }
};
</script>

<style lang="scss">
.login-page {
  width: 100%;
  height: 100%;
  padding: 0px;
}

.login-mat-card {
  width: 80%;
  display: flex;
  flex-direction: column;
  margin: 8vh auto;
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
  align-items: center;
}
.create-btn {
  align-self: center;
  background-color: #2f6a8c !important;
  color: #ffffff !important;
}
.register-field {
  color: #2f6a8c;
  cursor: pointer;
  margin: 0px 20px;
  font-weight: 600;
  font-size: 15px;
  padding: 7px 10px;
}
.register-field:hover {
  background-color: rgb(232, 237, 255);
}
.md-field > .md-icon {
  margin: 4px auto;
  position: initial !important;
}
.md-field > .md-icon:after {
  height: 0px;
}
@media (max-width: 650px) {
  .login-mat-card {
    width: 92%;
  }
}
</style>
