<template>
  <div class="register-page">
    <form novalidate @submit.prevent="validateUser">
      <md-card class="register-mat-card">
        <md-card-header>
          <div class="register-title">{{variables.screenTitle}}</div>
        </md-card-header>
        <md-card-content>
          <div class="feild-containers">
            <div class="Field-heading">{{variables.speciality}}</div>
            <div class="feilda">
              <md-field :class="getValidationClass('inputValue')">
                <div class="dropdown">
                  <md-input
                    v-if="Object.keys(selectedItem).length === 0"
                    ref="dropdowninput"
                    v-model="form.inputValue"
                    class="dropdown-input"
                    type="text"
                    placeholder="Doctor speciality"
                  />
                  <div
                    v-else
                    @click="resetSelection"
                    class="dropdown-selected"
                  >{{ selectedItem.specialityName}}</div>

                  <div v-show="form.inputValue&&apiLoaded" class="dropdown-list">
                    <div
                      @click="selectItem(item)"
                      v-show="itemVisible(item)"
                      v-for="item in itemList"
                      :key="item.specialityName"
                      class="dropdown-item"
                    >{{ item.specialityName }}</div>
                  </div>
                </div>
                <span
                  class="md-error"
                  v-if="!$v.form.inputValue.required"
                >{{variables.specialityError}}</span>
              </md-field>

              <div v-on:click="onAddSpecialitybtn">
                <md-button class="addbtn" :disabled="sending">{{variables.AddSpecilaty}}</md-button>
              </div>
            </div>
          </div>
          <div class="feild-containers">
            <div class="Field-heading">{{variables.firstname}}</div>
            <div class="feilda">
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

          <div class="feild-containers">
            <div class="Field-heading">{{variables.lastname}}</div>
            <div class="feilda">
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

          <div class="feild-containers">
            <div class="Field-heading">{{variables.dob}}</div>
            <div class="feilda">
              <md-datepicker
                v-model="form.dob"
                :class="getValidationClass('dob')"
                style="overflow:hidden; width:100%;"
                id="dob"
              >
                <label>{{variables.dob}}</label>
                <span class="md-error" v-if="!$v.form.dob.required">{{variables.dobError}}</span>
              </md-datepicker>
            </div>
          </div>

          <div class="feild-containers">
            <div class="Field-heading">{{variables.password}}</div>
            <div class="feilda">
              <md-field :class="getValidationClass('password')">
                <label for="password">{{variables.password}}</label>
                <md-input
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
            <md-button
              type="submit"
              class="md-primary create-btn"
              :disabled="sending"
              v-on:click="CreateDoctor"
            >{{variables.createUser}}</md-button>
          </md-card-actions>
        </md-card-content>
      </md-card>
    </form>
    <md-dialog class="dailog-box" :md-active.sync="showDialog">
      <form>
        <div class="dailog-title">{{variables.dialogtitle}}</div>

        <div class="dailog-feild-container">
          <label>{{variables.Createby}}</label>
          <div class="feild1">
            <md-field>
              <label>{{variables.createPlaceholder}}</label>
              <md-input
                v-model="newcreateby"
                :disabled="sending"
                @keyup.enter.native="getcreateBy($event)"
              />
            </md-field>
            <span class="error" v-if="showerror1">{{variables.doctorname}}</span>
          </div>
        </div>

        <div class="dailog-feild-container">
          <label>{{variables.speciality}}</label>
          <div class="feild1">
            <md-field>
              <label>{{variables.typeName}}</label>
              <md-input v-model="newspeciality" :disabled="sending" />
            </md-field>
            <span class="error" v-if="showerror2">{{variables.firstnameError}}</span>
          </div>
        </div>

        <div class="dailog-btn-cantainer">
          <div v-on:click="onDialogCancel">
            <md-button class="md-primary" :disabled="sending">{{variables.cancel}}</md-button>
          </div>
          <div v-on:click="onAddSpeciality">
            <md-button class="md-primary create-btn" :disabled="sending">{{variables.save}}</md-button>
          </div>
        </div>
      </form>
    </md-dialog>
    <md-progress-spinner v-if="isLoading" class="md-accent" :md-stroke="4" md-mode="indeterminate"></md-progress-spinner>
  </div>
</template>

<script>
// @ is an alias to /src
import { validationMixin } from "vuelidate";
import { AddMemberVariables } from "../shared/utils/Constants";
import axios from "axios";
import * as Url from "@/shared/utils/urls";
import moment from "moment";
import router from "../shared/router";
import {
  required,
  email,
  minLength,
  maxLength
} from "vuelidate/lib/validators";
export default {
  name: "AddMember",
  data() {
    return {
      newspeciality: "",
      newcreateby: "",
      selectedItem: {},
      itemList: [],
      apiLoaded: false,
      showDialog: false,
      showerror1: false,
      showerror2: false,
      isLoading: false,
      heading: "My Account",
      variables: AddMemberVariables,
      form: {
        inputValue: "",
        firstName: null,
        lastName: null,
        dob: null,
        password: null
      },
      sending: false,
      role: "patient"
    };
  },
  mounted() {
    this.getSpecialityList();
  },

  validations: {
    form: {
      inputValue: {
        required,
        minLength: minLength(3)
      },
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
    resetSelection() {
      this.selectedItem = {};
      this.form.inputValue = "";
      this.$emit("on-item-reset");
    },
    selectItem(theItem) {
      this.selectedItem = theItem;
      this.form.inputValue = theItem;
      this.$emit("on-item-selected", theItem);
    },
    itemVisible(item) {
      let currentName = item.specialityName;
      let currentInput = String(this.form.inputValue).toLowerCase();
      return currentName.includes(currentInput);
    },
    onAddSpecialitybtn: function() {
      this.showDialog = true;
    },
    onDialogCancel: function() {
      this.showDialog = false;
    },
    onlogin() {
      router.push({ name: "Login" });
    },
    getSpecialityList() {
      this.isLoading = true;
      axios.get(Url.BASE_URL + Url.GET_SPECIALITIES).then(res => {
        if (res && res.data) {
          if (res.data.success) {
            let list = JSON.parse(res.data.success);
            this.itemList = list;
            this.apiLoaded = true;
            this.isLoading = false;
          }
        }
      });
    },
    onAddSpeciality: function() {
      if (this.newcreateby == "") {
        this.showerror1 = true;
        return;
      } else if (this.newspeciality == "") {
        this.showerror2 = true;
        return;
      } else {
        this.isLoading = true;
        let body = {
          createdBy: this.newcreateby.toLowerCase(),
          specialityName: this.newspeciality.toLowerCase()
        };
        axios.post(Url.BASE_URL + Url.POST_SPECIALITIES, body).then(res => {
          if (res && res.data) {
            this.showDialog = false;
            this.getSpecialityList();
            this.isLoading = false;
          }
        });
      }
    },
    CreateDoctor: function() {
      if (
        this.form.dob == null ||
        this.form.firstName == null ||
        this.form.lastName == null ||
        this.form.inputValue == "" ||
        this.form.inputValue == null
      ) {
        return;
      }
      let check = this.itemList.includes(this.form.inputValue);
      if (check == false) {
        alert(" Selected Speciality Not Found! ");
        return;
      } else {
        this.isLoading = true;
        let temp = this.form.inputValue;
        let tempName = temp.specialityName;
        let tempId = temp.specialityId;
        let _date = moment(this.form.dob).format("DD/MM/YYYY");
        let body = {
          dateOfBirth: _date,
          doctorFirstName: this.form.firstName.toLowerCase(),
          doctorLastName: this.form.lastName.toLowerCase(),
          extraData: "",
          password: this.form.password,
          patientList: [],
          specialityId: tempId,
          specialityName: tempName
        };
        axios.post(Url.BASE_URL + Url.CREATE_DOCTOR, body).then(res => {
          if (res && res.data) {
            this.showDialog = false;
            if (window.confirm("Doctor added successfully")) {
              this.onlogin();
            } else {
            }
            this.isLoading = false;
          }
        });
      }
    }
  },
  computed: {
    searchInLowerCase() {
      return this.form.inputValue.toLowerCase().trim();
    }
  }
};
</script>

<style lang="scss">
.register-page {
  width: 100%;
  height: 100%;
  padding: 0px;
}
.register-mat-card {
  width: 80%;
  display: flex;
  flex-direction: column;
  margin: 8vh auto;
}
.feild-containers {
  display: flex;
  justify-content: space-evenly !important;
  align-items: center;
}
.Field-heading {
  width: 15%;
  text-align: left;
  font-weight: 600;
}
.feilda {
  width: 70%;
  display: flex;
  align-items: center;
}

.addbtn {
  background-color: #e2edff !important;
  margin: 0px !important;
  height: 35px !important;
  margin-left: 10px !important;
  color: #0b5d8b !important;
}
.create-btn {
  align-self: center;
  background-color: #2f6a8c !important;
  color: #ffffff !important;
}
.dailog-btn-cantainer {
  display: flex;
  justify-content: flex-end;
  margin: auto;
}
.dropdown {
  position: relative;
  width: 100%;
  width: 100%;
  margin: 0 auto;
}
.dropdown-input,
.dropdown-selected {
  width: 100%;
  // padding: 10px 16px;
  border: 0px solid transparent;
  line-height: 1.5em;
  outline: none;
  font-size: 18px;

  color: black;
}
.dropdown-input:focus,
.dropdown-selected:hover {
  background: #fff;
}
.dropdown-input::placeholder {
  // opacity: 0.7;
  font-size: 16px;
  font-weight: 550;
  color: #808080fa;
}
.dropdown-selected {
  font-weight: bold;
  cursor: pointer;
  text-align: left;
  font-size: 18px;
  color: black;
  font-weight: 500;
}
.dropdown-list {
  position: absolute;
  width: 100%;
  max-height: 500px;
  margin-top: 4px;
  overflow-y: auto;
  background: #edf2f7;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid #edf2f7;
  border-radius: 8px;
  z-index: 5;
}
.dropdown-item {
  display: flex;
  width: 100%;
  padding: 11px 16px;
  cursor: pointer;
}
.dropdown-item:hover {
  background: #dee3e7;
}
.dailog-box {
  display: flex;
  align-items: center;
  width: 60%;
  padding: 20px 5%;
  //  transform: translate3d(0px, 0px, 0px) scale(1) !important;
}
.register-title {
  text-align: center;
  font-size: 24px;
}
.dailog-title {
  padding: 10px 0px;
  font-size: 20px;
}
.dailog-feild-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.feild1 {
  width: 80%;
}
.error {
  color: rgb(252, 39, 39);
}
@media (max-width: 650px) {
  .register-mat-card {
    width: 92%;
    margin: 5vh auto;
  }
  .register-title {
    font-size: 20px;
    color: rgb(49, 49, 49);
    padding: 0px 0px 16px 0px;
  }
  .feild-containers {
    justify-content: space-between !important;
  }
  .Field-heading {
    min-width: 90px;
  }
  .feilda {
    width: 65%;
    display: flex;
    align-items: center;
  }

  .dailog-box {
    width: 85%;
    height: 280px;
    margin: auto;
    align-items: center;
    transform: translate3d(0px, 0px, 0px) scale(1) !important;
  }
  .dailog-title {
    padding: 0px;
    text-align: center;
    font-size: 18px;
  }
  .feild1 {
    width: 70%;
    margin: auto;
  }
  .dailog-btn-cantainer {
    width: 92%;
    margin: auto;
  }
  .addbtn {
    min-width: 65px !important;
    margin-left: 6px !important;
    padding: 0px !important;
  }
}
</style>
