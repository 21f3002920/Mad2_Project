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
import ProfessionalDashboard from "../pages/PROFESSIONAL/ProfessionalDashboard.js";
import CustomerService from "../pages/CUSTOMER/CustomerService.js";
import store from "./store.js";
import CustomerDisplayService from "../pages/CUSTOMER/CustomerDisplayService.js";



const routes = [
    {path : '/', component : Home},
    {path : '/Login', component : LoginPage},
    {path : '/Register', component : RegisterPage},
    {path : '/Admindashboard', component : AdminDashboard, meta : {requiresLogin : true, role : "Admin"}},
    {path : '/AdmindashboardService', component : AdminDashboardService, meta : {requiresLogin : true, role : "Admin"}},
    {path : '/AdmindashboardCustomer', component : AdminDashboardCustomer, meta : {requiresLogin : true, role : "Admin"}},
    {path : '/AdmindashboardProfessional', component : AdminDashboardProfessional, meta : {requiresLogin : true, role : "Admin"}},
    
    {path : '/Customerdashboard', component : CustomerDashboard, meta : {requiresLogin : true, role : "Customer"}},
    {path : '/Customerdashboard/Service', component : CustomerService, meta : {requiresLogin : true, role : "Customer"}},
    {path : '/Customerdashboard/Service/:id', component : CustomerDisplayService, props :true, meta : {requiresLogin : true, role : "Customer"}},







    {path : '/Professionaldashboard', component : ProfessionalDashboard, meta : {requiresLogin : true, role : "Professional"}},
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