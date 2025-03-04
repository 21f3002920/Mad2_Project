export default {
    props: ['p_id', 'p_name', 'p_userid', 'p_serviceid', 'service_name', 'p_experience', 'p_flag', 'p_active', 'p_pincode', 'p_phone', 'p_aadhaarnumber','email', 'active'],
    
    template: `
    <div class="jumbotron">
        <h2>{{ p_name }}</h2>
        <p>Email: {{ email }}</p>
        <p>Phone: {{ p_phone }}</p>
        <p>Service Offered: {{ service_name }}</p>
        <p v-if="!p_active">Experience: {{ p_experience }}</p>
        <p v-if="!p_active">Aadhaar Number: {{ p_aadhaarnumber }}</p>
        <p v-if="!p_active">Pincode: {{ p_pincode }}</p>
        <p v-if="p_active">Flag Count: {{p_flag}}</p>
        <p v-if="p_active">Status: {{ active ? 'Active' : 'Blocked' }}</p>
        <button class="logout" v-if="p_active && $store.state.role === 'Admin'" @click="toggleBlock">{{ active ? 'Block' : 'Unblock' }}</button>
        <button class="logout" v-if="p_active && $store.state.role === 'Admin'" @click="deleteProfessional">Delete</button>
        <button class="logout" v-if="!p_active && $store.state.role === 'Admin'" @click="acceptProfessional">Accept</button>
        <button class="logout" v-if="!p_active && $store.state.role === 'Admin'" @click="rejectProfessional">Reject</button>
    </div>
    `,

    methods: {
        async toggleBlock() {
            const action = this.active ? 'block' : 'unblock'; // Determine action text
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
        }
    }
};