export default {
    template : `
    <div class="main-content">
        <h2>Welcome</h2>
        <div class="navbarleft">
            <p>Registration</p> 
        </div>
    <div class="">
        <select v-model="role" class="input-field" required @change="handleRoleChange">
          <option value="" disabled>Select Role</option>
          <option value="Customer">Customer</option>
          <option value="Professional">Professional</option>
        </select>
        <div v-if="role === 'Customer'">
            <input placeholder="Email" v-model="email" class="input-field"/>
            <input placeholder="Name" v-model="c_name" class="input-field"/>
            <input placeholder="Password" v-model="password" class="input-field"/>
            <input placeholder="Address" v-model="c_address" class="input-field"/>
            <input placeholder="Pincode" v-model="c_pincode" type="number" class="input-field"/>
            <input placeholder="Phone" v-model="c_phone" type="number" class="input-field"/>
        </div>
        <div v-if="role === 'Professional'">
            <input placeholder="Email" v-model="email" class="input-field"/>
            <input placeholder="Name" v-model="p_name" class="input-field"/>
            <input placeholder="Password" v-model="password" class="input-field"/>
            <input placeholder="Pincode" v-model="p_pincode" type="number" class="input-field"/>
            <select v-model="p_service" class="input-field">
                <option value="" disabled>Select a Service</option>
                <option v-for="service in services" :key="service.service_id" :value="service.service_id">{{ service.service_name }}</option>
            </select>
            <input placeholder="Experience (in years)" v-model="p_experience" type="number" class="input-field"/>
            <input placeholder="Phone" v-model="p_phone" type="number" class="input-field"/>
            <input placeholder="Aadhaar" v-model="p_aadhaarnumber" type="number" class="input-field"/>
        </div>
        <button class="button" @click="submitLogin"> Register </button>
    </div>
    </div>
    `,
    data(){
        return {
            email :null,
            password : null,
            role : "",
            services:[],
            // Customer Data
            c_name: null,
            c_address: null,
            c_pincode: null,
            c_phone: null,
            // Professional Data
            p_name: null,
            p_pincode: null,
            p_service: "",
            p_experience: null,
            p_phone: null,
            p_aadhaarnumber: null
        } 
    },
    methods : {
        async fetchServices() {
            try {
                const res = await fetch(location.origin + '/public/services', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (res.ok) {
                    this.services = await res.json();
                } else {
                    console.error("Error fetching services");
                }
            } catch (error) {
                console.error("Failed to fetch services:", error);
            }
        },
        handleRoleChange() {
            if (this.role === 'Professional') {
                this.fetchServices();
            }
        },
        async submitLogin(){
            let userData = {
                email: this.email,
                password: this.password,
                role: this.role
            };
            if (this.role === "Customer") {
                userData.name = this.c_name;
                userData.address = this.c_address;
                userData.pincode = this.c_pincode;
                userData.phone = this.c_phone;
            } else if (this.role === "Professional") {
                userData.name = this.p_name;
                userData.pincode = this.p_pincode;
                userData.serviceid = this.p_service;
                userData.experience = this.p_experience;
                userData.phone = this.p_phone;
                userData.aadhaar = this.p_aadhaarnumber;
            }
  
            const res = await fetch(location.origin+'/register', 
                {
                    method : 'POST', 
                    headers: {'Content-Type' : 'application/json'}, 
                    body : JSON.stringify(userData)
                })
            if (res.ok){
                alert('User registered Successfully.')
                console.log('User registered Successfully')
                this.$router.push('/login')
                if(userData.role == "Customer"){
                    setTimeout(() => {
                        alert('Please re-enter your email and password to log in.');
                    }, 500);
                }
                else{
                    setTimeout(() => {
                        alert('Application under review by admin. Please wait');
                    }, 500);
                }
            }
            else{
                alert('Error registering user.')
                console.log('Error registering user');
            }
        }
    }
}