import Professionalcard from "../../components/Professionalcard.js";

export default {
    template: `
    <div class="main-content1">
        <h1>PROFESSIONAL MANAGEMENT</h1>
        <h2>--------------</h2>
        <input type="text" v-model="searchQuery" placeholder="Search by name..." class="input-field" />
        <div class="d-flex flex-column gap-2">
        <button class="logout" v-if="!showBlocked" @click="toggleInactive">
            {{ showInactive ? "Show All Professionals" : "Show Pending Applicants" }}
        </button>
        <button class="logout" v-if="!showInactive" @click="toggleBlocked">
            {{ showBlocked ? "Show All Professionals" : "Show Blocked Professionals" }}
        </button>
        </div>
        <h2>--------------</h2>  
        <Professionalcard v-for="professional in filteredProfessionals" 
            :p_id="professional.p_id" 
            :p_name="professional.p_name" 
            :p_userid="professional.p_userid" 
            :p_serviceid="professional.p_serviceid" 
            :service_name="professional.service_name" 
            :p_experience="professional.p_experience" 
            :p_flag="professional.p_flag" 
            :p_active="professional.p_active" 
            :p_pincode="professional.p_pincode" 
            :p_phone="professional.p_phone" 
            :p_aadhaarnumber="professional.p_aadhaarnumber" 
            :email="professional.email"
            :active="professional.active"
            @professionalDeleted="removeProfessional"
            @professionalUpdated="updateProfessional">
        </Professionalcard>
    </div>
    `,
    
    data() {
        return {
            professionals: [],
            showInactive: false,
            showBlocked: false,
            searchQuery: "",
        };
    },
    
    computed: {
        filteredProfessionals() {
            let filtered = this.professionals;
    
            if (this.showInactive) {
                filtered = this.professionals.filter(p => !p.p_active); 
            } else if (this.showBlocked) {
                filtered = this.professionals.filter(p => !p.active && p.p_active); 
            } else {
                filtered = this.professionals.filter(p => p.p_active && p.active); 
            }

            if (this.searchQuery) {
                filtered = filtered.filter(p =>
                    p.p_name.toLowerCase().startsWith(this.searchQuery.toLowerCase())
                );
            }
    
            return filtered;
        }
    },
    
    methods: {
        async fetchProfessionals() {
            try {
                const res = await fetch('/api/professionals', {
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token
                    }
                });
        
                const data = await res.json();
                
                this.professionals = data.map(professional => ({
                    p_id: professional.p_id,
                    p_name: professional.p_name,
                    p_userid: professional.p_userid,
                    p_serviceid: professional.p_serviceid,
                    service_name: professional.service_name,
                    p_experience: professional.p_experience,
                    p_flag: professional.p_flag,
                    p_active: professional.p_active,
                    p_pincode: professional.p_pincode,
                    p_phone: professional.p_phone,
                    p_aadhaarnumber: professional.p_aadhaarnumber,
                    email: professional.user.email, 
                    active: professional.user.active 
                }));
            } catch (error) {
                console.error("Error fetching professionals:", error);
            }
        },
        toggleInactive() {
            this.showInactive = !this.showInactive;
            this.showBlocked = false; 
        },

        toggleBlocked() {
            this.showBlocked = !this.showBlocked;
            this.showInactive = false;
        },

        async removeProfessional(p_id) {
            this.professionals = this.professionals.filter(professional => professional.p_id !== p_id);
        },

        async updateProfessional() {
            await this.fetchProfessionals();
        }
    },
    
    async mounted() {
        await this.fetchProfessionals();
    },
    
    components: {
        Professionalcard
    }
};