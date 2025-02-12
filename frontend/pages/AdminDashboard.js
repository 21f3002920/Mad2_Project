import Servicecard from "../components/Servicecard.js"

export default {
    template : `
    <div class="main-content">
        <h1>Service list</h1>
        <Servicecard v-for="service in services" :service_name="service.service_name" :service_description="service.service_description"> 
    </div>
    `, 
    data(){
        return{
            services:[]
        }
    },
    methods : {
        
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