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
import AdminDashboard from "../pages/AdminDashboard.js"
import CustomerDashboard from "../pages/CustomerDashboard.js"
import ProfessionalDashboard from "../pages/ProfessionalDashboard.js"

const routes = [
    {path : '/', component : Home},
    {path : '/Login', component : LoginPage},
    {path : '/Register', component : RegisterPage},
    {path : '/Admin', component : AdminDashboard},
    {path : '/Customerdashboard', component : CustomerDashboard},
    {path : '/Professionaldashboard', component : ProfessionalDashboard},
]

const router = new VueRouter({
    routes
})

export default router;