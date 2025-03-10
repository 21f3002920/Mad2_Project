const Home = {
    template:`
    <div class="main-content">
        <h2>Welcome to</h2>
            <div class="navbarleft">
              <h2>SERVICO</h2>
            </div>
        <p>Your most trusted Household Services Platform</p>  
        <div class="button">
            <router-link to="/Login" class="navbarcentre">Login</router-link>
        </div>
        <div class="button">
            <router-link to="/Register" class="navbarcentre">Register</router-link>
        </div>
    </div>
  `,
};

import LoginPage from "../pages/LoginPage.js";
import RegisterPage from "../pages/RegisterPage.js";
import AdminDashboard from "../pages/ADMIN/AdminDashboard.js";
import AdminDashboardService from "../pages/ADMIN/AdminDashboardService.js";
import AdminDashboardCustomer from "../pages/ADMIN/AdminDashboardCustomer.js";
import AdminDashboardProfessional from "../pages/ADMIN/AdminDashboardProfessional.js";
import CustomerDashboard from "../pages/CUSTOMER/CustomerDashboard.js";
import CustomerDashboardService from "../pages/CUSTOMER/CustomerDashboardService.js";
import CustomerServiceRequests from "../pages/CUSTOMER/CustomerServiceRequests.js";
import CustomerDashboardHistory from "../pages/CUSTOMER/CustomerDashboardHistory.js";
import ProfessionalDashboard from "../pages/PROFESSIONAL/ProfessionalDashboard.js";
import ProfessionalDashboardService from "../pages/PROFESSIONAL/ProfessionalDashboardService.js"
import ProfessionalDashboardHistory from "../pages/PROFESSIONAL/ProfessionalDashboardHistory.js";
import store from "./store.js";



const routes = [
    {path : '/', component : Home},
    {path : '/Login', component : LoginPage},
    {path : '/Register', component : RegisterPage},
    {path : '/Admindashboard', component : AdminDashboard, meta : {requiresLogin : true, role : "Admin"}},
    {path : '/AdmindashboardService', component : AdminDashboardService, meta : {requiresLogin : true, role : "Admin"}},
    {path : '/AdmindashboardCustomer', component : AdminDashboardCustomer, meta : {requiresLogin : true, role : "Admin"}},
    {path : '/AdmindashboardProfessional', component : AdminDashboardProfessional, meta : {requiresLogin : true, role : "Admin"}},
    {path : '/Customerdashboard', component : CustomerDashboard, meta : {requiresLogin : true, role : "Customer"}},
    {path : '/CustomerdashboardService', component : CustomerDashboardService, meta : {requiresLogin : true, role : "Customer"}},
    {path : '/CustomerdashboardServiceRequests', component : CustomerServiceRequests, meta : {requiresLogin : true, role : "Customer"}},
    {path : '/CustomerdashboardHistory', component : CustomerDashboardHistory, meta : {requiresLogin : true, role : "Customer"}},
    {path : '/Professionaldashboard', component : ProfessionalDashboard, meta : {requiresLogin : true, role : "Professional"}},
    {path : '/ProfessionaldashboardService', component : ProfessionalDashboardService, meta : {requiresLogin : true, role : "Professional"}},
    {path : '/ProfessionaldashboardHistory', component : ProfessionalDashboardHistory, meta : {requiresLogin : true, role : "Professional"}},
]

const router = new VueRouter({
    routes
})

//NAVIGATION GUARDS
router.beforeEach((to, from, next) => {
    if(to.matched.some((record) => record.meta.requiresLogin)){
        if(!store.state.loggedIn){
            alert('Permission Denied')
            //next({path : '/'})
        }
        else if (to.meta.role && to.meta.role!=store.state.role){
            alert('Role not Authorized')
            //next({path : '/'})
        }
        else{
            next();
        }
    }
    else{
        next();
    }
})

export default router;