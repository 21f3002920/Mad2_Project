import Servicecard from "../../components/Servicecard.js"

export default {
    template : `
    <div class="main-content1">
        <h1>Available Services</h1>
        <h2>--------------</h2>  
        <input type="text" v-model="searchQuery" placeholder="Search by service..." class="input-field" />
        <Servicecard v-for="service in filteredServices" 
        :service_id="service.service_id" 
        :service_name="service.service_name" 
        :service_time="service.service_time" 
        :service_description="service.service_description" 
        :service_baseprice="service.service_baseprice" 
        ></Servicecard>
    </div>
    `, 

    data(){
        return{
            services:[],
            showForm: false,
            searchQuery: ""
        }
    },

    computed: {
        filteredServices() {
            if (!this.searchQuery) return this.services;
            return this.services.filter(service =>
                service.service_name.toLowerCase().startsWith(this.searchQuery.toLowerCase())
            );
        }
    },

    async mounted(){
        const res = await fetch(location.origin + '/api/services', {
        headers:{
            'Authentication-token': this.$store.state.auth_token
        }
    })
    this.services=await res.json()
},

components:{
    Servicecard,
}
}