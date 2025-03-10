import Customercard from "../../components/Customercard.js";

export default {
    template: `
    <div class="main-content">
        <h1>CUSTOMER MANAGEMENT</h1>
        <h2>--------------</h2>
        <Customercard v-for="customer in customers" 
            :c_id="customer.c_id" 
            :c_name="customer.c_name" 
            :c_userid="customer.c_userid" 
            :c_flag="customer.c_flag" 
            :c_address="customer.c_address" 
            :c_pincode="customer.c_pincode" 
            :c_phone="customer.c_phone" 
            :email="customer.email"
            :active="customer.active"
            @customerDeleted="removeCustomer"
            @customerUpdated="updateCustomer">
        </Customercard>

    </div>
    `,
    
    data() {
        return {
            customers: []
        };
    },
    
    methods: {
        async fetchCustomers() {
            try {
                const res = await fetch('/api/customers', {
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token
                    }
                });
        
                const data = await res.json();
                
                this.customers = data.map(customer => ({
                    c_id: customer.c_id,
                    c_name: customer.c_name,
                    c_userid: customer.c_userid,
                    c_flag: customer.c_flag,
                    c_address: customer.c_address,
                    c_pincode: customer.c_pincode,
                    c_phone: customer.c_phone,
                    email: customer.user.email, 
                    active: customer.user.active 
                }));
            } catch (error) {
                console.error("Error fetching customers:", error);
            }
        },

        async removeCustomer(c_id) {
            this.customers = this.customers.filter(customer => customer.c_id !== c_id);
        },

        async updateCustomer() {
            await this.fetchCustomers();
        }
    },
    
    async mounted() {
        await this.fetchCustomers();
    },
    
    components: {
        Customercard
    }
};