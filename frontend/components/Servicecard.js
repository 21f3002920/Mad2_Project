import Professionalcard from "./Professionalcard.js";

export default{
    props: ['service_id','service_name','service_baseprice','service_time','service_description'],
    
    template:`
    <div class="jumbotron">
    <div class="professional-card card">
    <div class="card-body">
        <h2>{{service_name}}</h2>
        <p>{{service_description}}</p>
        <p>Rs: {{service_baseprice}}</p>
        <p>Time: {{service_time}} hrs</p>
        <button class="logout" v-if="$store.state.role === 'Admin' && showButton" @click="deleteService">Delete</button>
        <button class="logout" v-if="$store.state.role === 'Admin' && showButton" @click="showEditing = true,showButton= false">Edit Service</button>
        <button class="logout" v-if="$store.state.role === 'Customer'" @click="fetchProfessionals">
            {{ showProfessionals ? 'Hide Professionals' : 'Available Professionals' }}
        </button>        
        <div v-if="showProfessionals">
            <div class="table">
                <Professionalcard v-for="professional in professionals"
                    :p_id="professional.p_id"
                    :p_name="professional.p_name"
                    :p_userid="professional.p_userid"
                    :p_serviceid="professional.p_serviceid"
                    :service_name="service_name"
                    :p_experience="professional.p_experience"
                    :p_flag="professional.p_flag"
                    :p_active="professional.p_active"
                    :p_pincode="professional.p_pincode"
                    :p_phone="professional.p_phone"
                    :p_aadhaarnumber="professional.p_aadhaarnumber"
                    :email="professional.user.email"
                    :active="professional.user.active">
                </Professionalcard>
            </div>
        </div>
        <div v-if="showEditing">
            <div class="input-field">
                <input v-model="updatedService.service_name" placeholder="Service Name" />
                <input v-model="updatedService.service_baseprice" type="number" placeholder="Base Price" />
                <input v-model="updatedService.service_time" type="number" placeholder="Estimated Time (mins)" />
                <input v-model="updatedService.service_description" placeholder="Description"></input>
                <h1></h1> 
                <button class="logout" @click="updateService">Save Changes</button>
                <button class="logout" @click="showEditing = false, showButton= true">Cancel</button>
            </div>
        </div>
    </div>
    </div>
    </div>
`,
data() {
    return {
        showEditing: false,
        showButton: true,
        showProfessionals: false,
        professionals: [],
        updatedService: {
            service_name: this.service_name,
            service_baseprice: this.service_baseprice,
            service_time: this.service_time,
            service_description: this.service_description
        }
    };
},

    methods:{
        async fetchProfessionals() {
            this.showProfessionals = !this.showProfessionals; // Toggle visibility
            
            if (this.showProfessionals && this.professionals.length === 0) { // Fetch only once
                try {
                    const res = await fetch(`/api/services/${this.service_id}/professionals`, {
                        headers: {
                            'Authentication-Token': this.$store.state.auth_token
                        }
                    });
            
                    if (!res.ok) {
                        const errorData = await res.json();
                        this.showProfessionals=false
                        throw new Error(errorData.message || "Failed to fetch professionals");
                    }
            
                    this.professionals = await res.json();
                } catch (error) {
                    console.error("Error fetching professionals:", error);
                    alert(error.message);
                }
            }
        },
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
            if (!confirm(`Are you sure you want to DELETE ${this.service_name}?`)){ 
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
            if (this.$store.state.role === "Customer") {
                this.$router.push(`/Customerdashboard/Service/${this.service_id}/professionals`);
            }
            else {
                this.$router.push(`/Customerdashboard/Service/${this.service_id}`);
            }
        }
    },
    components: {
        Professionalcard
    }   
};