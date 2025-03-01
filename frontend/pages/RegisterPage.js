export default {
    template : `
    <div class="main-content">
    <div class="input-field">
        <input placeholder="email"  v-model="email"/>  
        <input placeholder="password"  v-model="password"/> 
    </div> 
        <select v-model="role" class="form-input" required>
          <option value="" disabled selected>Select Role</option>
          <option value="Customer">Customer</option>
          <option value="Professional">Professional</option>
        </select>
        <button class="button" @click="submitLogin"> Register </button>
    </div>
    `,
    data(){
        return {
            email : null,
            password : null,
            role : null,
        } 
    },
    methods : {
        async submitLogin(){
  
            const res = await fetch(location.origin+'/register', 
                {
                    method : 'POST', 
                    headers: {'Content-Type' : 'application/json'}, 
                    body : JSON.stringify({'email': this.email,'password': this.password, 'role' : this.role})
                })
            if (res.ok){
                console.log('we are register')
            }
        }
    }
}