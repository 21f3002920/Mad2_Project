export default {
    template:`
    <div class="main-content">
            
    <h1>ADMIN</h1> 
    <h2>Dashboard</h2> 
    <h2>--------------</h2>  
        <div class="button">
            <router-link to="/AdmindashboardService" class="navbarcentre">Service Management</router-link>
        </div>
        <div class="button">
            <router-link to="/Admindashboardcustomer" class="navbarcentre">Customer Management</router-link>
        </div>
        <div class="button">
            <router-link to="/Admindashboardprofessional" class="navbarcentre">Professional Management</router-link>
        </div>
    </div>
  `,
};
    