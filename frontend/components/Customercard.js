export default {
    props: ['c_id', 'c_name', 'c_userid', 'c_flag', 'c_address', 'c_pincode', 'c_phone', 'email', 'active'],
    
    template: `
    <div class="jumbotron">
        <h2>{{ c_name }}</h2>
        <p>Email: {{ email }}</p>
        <p>Phone: {{ c_phone }}</p>
        <p>Flag Count: {{c_flag}}</p>
        <p>Status: {{ active ? 'Active' : 'Blocked' }}</p>
        <button class="logout" v-if="$store.state.role === 'Admin'" @click="toggleBlock">{{ active ? 'Block' : 'Unblock' }}</button>
        <button class="logout" v-if="$store.state.role === 'Admin'" @click="deleteCustomer">Delete</button>
    </div>
    `,

    methods: {
        async toggleBlock() {
            const action = this.active ? 'block' : 'unblock'; // Determine action text
            if (!confirm(`Are you sure you want to ${action} ${this.c_name}?`)) return;
            const res = await fetch(`/api/customers/${this.c_id}`, {
                method: 'PUT',
                headers: {
                    'Authentication-Token': this.$store.state.auth_token
                }
            });
            if (res.ok) {
                this.$emit('customerUpdated');
            } else {
                alert('Failed to update customer status.');
            }
        },

        async deleteCustomer() {
            if (!confirm(`Are you sure you want to delete ${this.c_name}?`)) return;
            const res = await fetch(`/api/customers/${this.c_id}`, {
                method: 'DELETE',
                headers: {
                    'Authentication-Token': this.$store.state.auth_token
                }
            });
            if (res.ok) {
                this.$emit('customerDeleted', this.c_id);
            } else {
                alert('Failed to delete customer.');
            }
        }
    }
};