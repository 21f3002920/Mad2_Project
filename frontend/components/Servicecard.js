export default{
    props: ['service_id','service_name','service_baseprice','service_time','service_description'],
    
    template:`
    <div class="jumbotron">
        <h2>{{service_name}}</h2>
        <p>{{service_description}}</p>
        <p>Rs: {{service_baseprice}}</p>
        <p>Time: {{service_time}} hrs</p>
        <button class="logout" v-if="$store.state.role === 'Admin' && showButton" @click="deleteService">Delete</button>
        <button class="logout" v-if="$store.state.role === 'Admin' && showButton" @click="showEditing = true,showButton= false">Edit Service</button>
        <button class="logout" v-if="$store.state.role === 'Customer'" @click="goToService">Book professional</button>
        <div v-if="showEditing">
        <div class="input-field">
            <input v-model="updatedService.service_name" placeholder="Service Name" />
            <input v-model="updatedService.service_baseprice" type="number" placeholder="Base Price" />
            <input v-model="updatedService.service_time" type="number" placeholder="Estimated Time (mins)" />
            <input v-model="updatedService.service_description" placeholder="Description"></input>
            <h1></h1> 
            <button class="logout"@click="updateService">Save Changes</button>
            <button class="logout" @click="showEditing = false, showButton= true">Cancel</button>
        </div>
        </div>
    </div>
`,
data() {
    return {
        showEditing: false,
        showButton: true,
        updatedService: {
            service_name: this.service_name,
            service_baseprice: this.service_baseprice,
            service_time: this.service_time,
            service_description: this.service_description
        }
    };
},

    methods:{
        async updateService() {
            const res = await fetch(`/api/services/${this.service_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.$store.state.auth_token
                },
                body: JSON.stringify(this.updatedService)
            });

            if (res.ok) {
                const updatedData = await res.json();
                this.$emit('serviceUpdated', this.service_id, updatedData);
                this.showEditing = false;
                this.showButton= true;
            } else {
                alert('Failed to update service');
            }
        },
        async deleteService(){
            if (!confirm(`Are you sure you want to delete ${this.service_name}?`)){ 
                return
            };
            const res = await fetch(`/api/services/${this.service_id}`, {
                method: 'DELETE',
                headers: {
                    'Authentication-Token': this.$store.state.auth_token
                }
            });
            if (res.ok) {
                alert(`${this.service_name} has been successfully deleted.`)
                this.$emit('serviceDeleted', this.service_id);
            } else {
                alert('Failed to delete service.');
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