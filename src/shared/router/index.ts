import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import AddMember from "../../pages/AddMember.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "createform" */ "../../pages/Login.vue")
  },
  {
    path: "/addmember",
    name: "AddMember",
    component: AddMember
  },
  {
    path: "/createform",
    name: "CreateForm",
    props: true,
    component: () =>
      import(/* webpackChunkName: "createform" */ "../../pages/CreateForm.vue")
  },
 
  {
    path: "/viewform",
    name: "ViewForm",
    component: () =>
      import(/* webpackChunkName: "viewform" */ "../../pages/ViewForm.vue")
  },
  {
    path: "/patientlist",
    name: "PatientList",
    component: () =>
      import(/* webpackChunkName: "patientlist" */ "../../pages/PatientList.vue")
  },
  {
    path: "/patientdetails",
    name: "PatientDetails",
    props: true,
    component: () =>
      import(/* webpackChunkName: "PatientDetails" */ "../../pages/PatientDetails.vue")
  },
  {
    path: "/addpatient",
    name: "AddPatient",
    component: () =>
      import(/* webpackChunkName: "AddPatient" */ "../../pages/AddPatient.vue")
  },
  {
    path: "/home",
    name: "Home",
    component: () =>
      import(/* webpackChunkName: "Home" */ "../../pages/Home.vue")
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

export default router;
