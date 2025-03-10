import ServiceRequest from "../../components/ServiceRequest.js";

export default {
    components: { ServiceRequest },
    template: `
    <div class="main-content4">
    <ServiceRequest 
        :serviceRequests="serviceRequests" 
        role="Customer"
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
        async handleRequestAction(sr_id, action) {
            if (action === "Cancel") {
                await this.cancelServiceRequest(sr_id);
            } else if (action === "Closed") {
                await this.closeServiceRequest(sr_id);
            }
        },
        async fetchServiceRequests() {
            try {
                const res = await fetch('/api/customer/service_requests?status=Requested,Accepted,Closed by Customer,Closed by Professional', {
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token
                    }
                });
        
                if (res.ok) {
                    const allRequests = await res.json();
                    this.serviceRequests = allRequests
                        .sort((a, b) => new Date(b.sr_created_at) - new Date(a.sr_created_at)); 
                    if (this.serviceRequests.length === 0) {
                        alert("There are no active Service Requests.");
                        this.$router.push('/Customerdashboard')
                    }
                } else {
                    throw new Error(`Failed to fetch service requests. Status: ${res.status}`);
                }
            } catch (error) {
                console.error("Error fetching service requests:", error);
                alert(error.message);
            }
        },
        async closeServiceRequest(sr_id) {
            if (!confirm("Are you sure you want to CLOSE this Service Request?")) return;
        
            const impressed = confirm("Were you impressed with the professional's behavior? Click 'OK' for Yes, 'Cancel' for No.");
        
            try {
                const res = await fetch(`/api/service_requests/${sr_id}/close`, {
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
        async cancelServiceRequest(sr_id) {
            if (!confirm("Are you sure you want to CANCEL this Service Request?")) return;
    
            try {
                const res = await fetch(`/api/service_requests/${sr_id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token
                    }
                });
    
                if (res.ok) {
                    this.serviceRequests = this.serviceRequests.filter(req => req.sr_id !== sr_id); 
                    alert("Service request canceled successfully.");
                } else {
                    throw new Error("Failed to cancel service request.");
                }
            } catch (error) {
                console.error(error);
                alert(error.message);
            }
        }
        
    },
};
