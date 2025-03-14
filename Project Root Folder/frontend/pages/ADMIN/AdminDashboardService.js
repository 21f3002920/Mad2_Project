import Servicecard from "../../components/Servicecard.js"

export default {

    template : `
    <div class="main-content1">
    <h1>SERVICE</h1> 
    <h2>Management</h2> 
    <h2>--------------</h2>  
    <button class="logout" v-if="$store.state.role === 'Admin'" @click="showForm = !showForm">
    {{ showForm ? 'Cancel' : 'Add Service' }}
    </button>
    <div class="input-field">
        <div v-if="showForm">
            <input v-model="newService.service_name" placeholder="Service Name" required />
            <input v-model="newService.service_baseprice" type="number" placeholder="Base Price" required />
            <input v-model="newService.service_time" type="number" placeholder="Estimated Time" required />
            <input v-model="newService.service_description" placeholder="Description" required></input>
        <h1></h1> 
        <div>
        <button class="logout"@click="addService">Create Service</button>
        </div>
    </div>
    <h2>--------------</h2>  
        <Servicecard v-for="service in services" 
        :service_id="service.service_id" 
        :service_name="service.service_name" 
        :service_time="service.service_time" 
        :service_description="service.service_description" 
        :service_baseprice="service.service_baseprice" 
        @serviceDeleted="removeService"
        @serviceUpdated="updateService"></Servicecard>
    </div>
    </div>
    `, 

    data(){
        return {
            services: [],
            showForm: false,
            newService: {
                service_name: '',
                service_baseprice: '',
                service_time: '',
                service_description: ''
            }
        };
    },

    methods :{
        async fetchServices() {
            const res = await fetch('/api/services', {
                headers: {
                    'Authentication-Token': this.$store.state.auth_token
                }
            });
            this.services = await res.json();
        },

        async removeService(service_id) {
            this.services = this.services.filter(service => service.service_id !== service_id);
        },

        async addService() {
            if (!this.newService.service_name || !this.newService.service_baseprice) {
                alert('Please enter all required fields.');
                return;
            }

            const res = await fetch('/api/services', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.$store.state.auth_token
                },
                body: JSON.stringify(this.newService)
            });

            if (res.ok) {
                this.showForm = false;
                this.newService = { service_name: '', service_baseprice: '', service_time: '', service_description: '' };
                await this.fetchServices(); 
            } else {
                alert('Failed to add service. Please try again.');
            }
        },
        async updateService(service_id, updatedData) {
            const index = this.services.findIndex(service => service.service_id === service_id);
            if (index !== -1) {
                this.$set(this.services, index, { ...this.services[index], ...updatedData }); //$set() method ensure reactivity for updating website dynamically
            }
            await this.fetchServices();
        }
    },
    async mounted() {
        await this.fetchServices();
    },

    components:{
        Servicecard,
    }
}