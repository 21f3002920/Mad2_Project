import ServiceRequest from "../../components/ServiceRequest.js";

export default {
    components: { ServiceRequest },
    template: `
        <div class="main-content1">
        <ServiceRequest 
            :serviceRequests="serviceRequests" 
            role="Customer"
            :showActions="false"
        />
        </div>
    `,

    data() {
        return {
            serviceRequests: []
        };
    },
    async mounted() {
        await this.fetchServiceHistory();
    },
    
    methods: {
        async fetchServiceHistory() {
            try {
                const res = await fetch('/api/customer/service_requests?status=Closed,Rejected', {
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token
                    }
                });
                if (res.ok) {
                    this.serviceRequests = await res.json();
                    if (this.serviceRequests.length === 0) {
                        alert("No History found.");
                        this.$router.push('/Customerdashboard')
                    }
                } else {
                    throw new Error("Failed to fetch service history.");
                }
            } catch (error) {
                console.error(error);
                alert(error.message);
            }
        }
    },
};
