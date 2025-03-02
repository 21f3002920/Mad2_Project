export default {
    template:`
    <div class="main-content">
            
    <h1>CUSTOMER</h1> 
    <h2>Management</h2> 
    <h2>--------------</h2>  
        <div class="button">
            <router-link to="/Admindashboardservice" class="navbarcentre">Flagged</router-link>
        </div>
        <div class="button">
            <router-link to="/Admindashboard/Service" class="navbarcentre">Unblock Customer</router-link>
        </div>
        <div class="button">
            <router-link to="/Admindashboard/Service" class="navbarcentre">Delete Customer</router-link>
        </div>
    </div>
  `,
};