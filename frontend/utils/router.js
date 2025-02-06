const Home = {
    template: ` 
    <h1>this is home</h1>
    `,
}
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