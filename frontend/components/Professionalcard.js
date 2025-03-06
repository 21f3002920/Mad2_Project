export default {
    props: ['p_id', 'p_name', 'p_userid', 'p_serviceid', 'service_name', 'p_experience', 'p_flag', 'p_active', 'p_pincode', 'p_phone', 'p_aadhaarnumber','email', 'active'],
    
    template: `
    <div class="jumbotron">
    <div class="professional-card card">
    <div class="card-body">
        <h2 v-if="$store.state.role === 'Admin'">{{ p_name }}</h2>
        <p v-if="$store.state.role === 'Admin'">Email: {{ email }}</p>
        <p v-if="$store.state.role === 'Admin'">Phone: {{ p_phone }}</p>
        <p v-if="$store.state.role === 'Admin'">Service Offered: {{ service_name }}</p>
        <p v-if="!p_active && $store.state.role === 'Admin'">Experience: {{ p_experience }} Years</p>
        <p v-if="!p_active && $store.state.role === 'Admin'">Aadhaar Number: {{ p_aadhaarnumber }}</p>
        <p v-if="!p_active && $store.state.role === 'Admin'">Pincode: {{ p_pincode }}</p>
        <p v-if="p_active && $store.state.role === 'Admin'">Flag Count: {{p_flag}}</p>
        <p v-if="p_active && $store.state.role === 'Admin'">Status: {{ active ? 'Active' : 'Blocked' }}</p>
        <h2 v-if="$store.state.role === 'Customer'">{{ p_name }}</h2>
        <p v-if="$store.state.role === 'Customer'">Phone: {{ p_phone }}</p>
        <p v-if="$store.state.role === 'Customer'">Service Offered: {{ service_name }}</p>
        <p v-if="!p_active && $store.state.role === 'Customer'">Experience: {{ p_experience }} Years</p>
        <p v-if="!p_active && $store.state.role === 'Customer'">Pincode: {{ p_pincode }}</p>
        <button class="logout" v-if="p_active && $store.state.role === 'Admin'" @click="toggleBlock">{{ active ? 'Block' : 'Unblock' }}</button>
        <button class="logout" v-if="p_active && $store.state.role === 'Admin'" @click="deleteProfessional">Delete</button>
        <button class="logout" v-if="!p_active && $store.state.role === 'Admin'" @click="acceptProfessional">Accept</button>
        <button class="logout" v-if="!p_active && $store.state.role === 'Admin'" @click="rejectProfessional">Reject</button>
        <button class="logout" v-if="$store.state.role === 'Customer'" @click="bookService">Book Now</button>

    </div>
    </div>
    </div>
    `,

    methods: {
        async toggleBlock() {
            const action = this.active ? 'block' : 'unblock'; 
            if (!confirm(`Are you sure you want to ${action} ${this.p_name}?`)) return;
            const res = await fetch(`/api/professionals/${this.p_id}`, {
                method: 'PUT',
                headers: {
                    'Authentication-Token': this.$store.state.auth_token
                }
            });
            if (res.ok) {
                this.$emit('professionalUpdated');
            } else {
                alert('Failed to update professional status.');
            }
        },
        async acceptProfessional() {
            if (!confirm(`Are you sure you want to accept ${this.p_name}?`)) return;
            const res = await fetch(`/api/professionals/${this.p_id}`, {
                method: 'PUT',
                headers: {
                    'Authentication-Token': this.$store.state.auth_token
                }
            });
            if (res.ok) {
                this.$emit('professionalUpdated');
            } else {
                alert('Failed to update professional status.');
            }
        },
        async deleteProfessional() {
            if (!confirm(`Are you sure you want to delete ${this.p_name}?`)) return;
            const res = await fetch(`/api/professionals/${this.p_id}`, {
                method: 'DELETE',
                headers: {
                    'Authentication-Token': this.$store.state.auth_token
                }
            });
            if (res.ok) {
                this.$emit('professionalDeleted', this.p_id);
            } else {
                alert('Failed to delete professional.');
            }
        },
        async rejectProfessional() {
            if (!confirm(`Are you sure you want to reject ${this.p_name}?`)) return;
            const res = await fetch(`/api/professionals/${this.p_id}`, {
                method: 'DELETE',
                headers: {
                    'Authentication-Token': this.$store.state.auth_token
                }
            });
            if (res.ok) {
                this.$emit('professionalDeleted', this.p_id);
            } else {
                alert('Failed to delete professional.');
            }
        },
        async bookService() {
            if (!confirm(`Are you sure you want to book ${this.p_name}?`)) return;
        
            console.log("Booking service for:", { 
                professional_id: this.p_id, 
                service_id: this.p_serviceid 
            });
        
            const res = await fetch(`/api/service/book`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.$store.state.auth_token
                },
                body: JSON.stringify({
                    professional_id: this.p_id,
                    service_id: this.p_serviceid
                })
            });
        
            const response = await res.json();
            console.log("Booking response:", response);
        
            if (res.ok) {
                alert(`Service request created successfully!`);
            } else {
                alert(`Failed to book service: ${response.message}`);
            }
        }
        
    }
};