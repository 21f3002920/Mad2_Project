
export default{
    props: ['service_id','service_name','service_baseprice','service_time','service_description'],
    template:`

    <div class="jumbotron">
        <h2>{{service_name}}</h2>
        <p>{{service_description}}</p>
        <p>Rs: {{service_baseprice}}</p>
        <button class="logout" v-if="$store.state.role === 'Admin'" @click="deleteService">Delete</button>
        <button class="logout" v-if="$store.state.role === 'Admin'" @click="goToService">Edit Service</button>
        <button class="logout" v-if="$store.state.role === 'Customer'" @click="goToService">Book professional</button>
    </div>
`,
    methods:{
        async deleteService(){
            if (!confirm(`Are you sure you want to delete ${this.service_name}?`)) return;
            const res = await fetch(`/api/services/${this.service_id}`, {
                method: 'DELETE',
                headers: {
                    'Authentication-token': this.$store.state.auth_token
                }
            });
            if (res.ok) {
                this.$emit('serviceDeleted', this.service_id);
            } else {
                alert('Failed to delete service');
            }

        },
        goToService(){
            if (this.$store.state.role === "Admin") {
                this.$router.push(`/Admindashboard/Service/${this.service_id}`);
            } 
            else {
                this.$router.push(`/Customerdashboard/Service/${this.service_id}`);
            }
        }
}
};