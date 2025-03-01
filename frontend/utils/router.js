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
import AdminService from "../pages/ADMIN/AdminService.js";
import DisplayService from "../pages/ADMIN/DisplayService.js";
import CustomerDashboard from "../pages/CUSTOMER/CustomerDashboard.js";
import ProfessionalDashboard from "../pages/PROFESSIONAL/ProfessionalDashboard.js";
import store from "./store.js";


const routes = [
    {path : '/', component : Home},
    {path : '/Login', component : LoginPage},
    {path : '/Register', component : RegisterPage},
    {path : '/Admindashboard', component : AdminDashboard, meta : {requiresLogin : true, role : "Admin"}},
    {path : '/Admindashboard/Service', component : AdminService, meta : {requiresLogin : true, role : "Admin"}},
    {path : '/Admindashboard/Service/:id', component : DisplayService, props :true, meta : {requiresLogin : true, role : "Admin"}},
    
    {path : '/Customerdashboard', component : CustomerDashboard, meta : {requiresLogin : true, role : "Customer"}},
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
            next({path : '/'})
        }
        else if (to.meta.role && to.meta.role!=store.state.role){
            alert('Role not Authorized')
            next({path : '/'})
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