import ServiceRequest from "../../components/ServiceRequest.js";

export default {
    components: { ServiceRequest },
    template: `
    <div class="main-content4">
        <ServiceRequest 
            :serviceRequests="serviceRequests" 
            role="Professional"
            :handleAction="handleRequestAction"
        />
        </div>
    `,
    data() {
        return {
            serviceRequests: []
        };
    },
    async mounted() {
        await this.fetchServiceRequests();
    },
    methods: {
        async fetchServiceRequests() {
            try {
                const res = await fetch('/api/professional/service_requests?status=Requested,Accepted,Closed by Customer,Closed by Professional', {
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token
                    }
                });
                if (res.ok) {
                    this.serviceRequests = await res.json();
                    if (this.serviceRequests.length === 0) {
                        alert("There are no active Service Requests.");
                        this.$router.push('/Professionaldashboard')
                    }
                } else {
                    throw new Error("Failed to fetch service requests.");
                }
            } catch (error) {
                console.error(error);
                alert(error.message);
            }
        },
        async handleRequestAction(sr_id, action) {
            if (action === "Close") {
                await this.closeServiceRequest(sr_id);
            } else {
                await this.updateServiceRequestStatus(sr_id, action);
            }
        },
        async updateServiceRequestStatus(sr_id, status) {
            const formattedStatus = status === "Accepted" ? "ACCEPT" : "REJECT"; 
        
            if (!confirm(`Are you sure you want to ${formattedStatus} this service request?`)) return;
        
            try {
                const res = await fetch(`/api/service_requests/${sr_id}/status`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': this.$store.state.auth_token
                    },
                    body: JSON.stringify({ status })
                });
        
                if (res.ok) {
                    this.serviceRequests = this.serviceRequests.map(req =>
                        req.sr_id === sr_id ? { ...req, status } : req
                    );
        
                    alert(`Service request ${status} successfully.`); 
                } else {
                    throw new Error("Failed to update service request.");
                }
            } catch (error) {
                console.error(error);
                alert(error.message);
            }
        },
        async closeServiceRequest(sr_id) {
            if (!confirm("Are you sure you want to CLOSE this Service Request?")) return;
        
            const impressed = confirm("Were you impressed with the customer's behavior? Click 'OK' for Yes, 'Cancel' for No.");
        
            try {
                const res = await fetch(`/api/service_requests/${sr_id}/close_by_professional`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': this.$store.state.auth_token
                    },
                    body: JSON.stringify({ impressed: impressed })
                });
        
                if (res.ok) {
                    alert("Service request closed successfully.");
                    await this.fetchServiceRequests();  
                } else {
                    throw new Error("Failed to close service request.");
                }
            } catch (error) {
                console.error(error);
                alert(error.message);
            }
        },
        
    },
};
