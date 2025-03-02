export default {
    props:['id'],
    template : `
    <div class="main-content">
        <div class="jumbotron">
            <h1>Name: {{services.service_name}} </h1>
            </div>
            <div class="jumbotron">
            <h1>Time Required: {{services.service_time}} hours</h1>
            </div>
        <div class="jumbotron">
            <h1>Description: {{services.service_description}}</h1>
        </div>
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
        const res = await fetch(`${location.origin}/api/services/${this.id}`, {
        headers:{
            'Authentication-token': this.$store.state.auth_token
        }
    })
    this.services=await res.json()
},
components:{
    
}
}