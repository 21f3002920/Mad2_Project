export default {
    template: `
    <div class="main-content">
        <div class="input-field">
            <input placeholder="email" v-model="email"/>
            <input placeholder="password" v-model="password"/>
        </div>
        <button class="button" @click="submitLogin"> Login </button>
    </div>
    `,
    data(){
        return{
            email: null,
            password: null,
        }
    },
    methods : {
        async submitLogin(){
            try{
            const res= await fetch(location.origin+'/login',
                {
                    method : 'POST',
                    headers : {'Content-Type': 'application/json'}, 
                    body : JSON.stringify({'email':this.email,'password':this.password})
                });
                const data= await res.json()
            
            if(!res.ok){
                throw new Error(data.message || "Login failed");
            }
                
                console.log(data)
                localStorage.setItem('user', JSON.stringify(data))
                this.$store.commit('setUser')
                if (data.role == "Admin"){
                    console.log("Hi Admin")
                    this.$router.push('/Admindashboard')
                }
                else if (data.role == "Customer"){
                    console.log("Hi Customer")
                    this.$router.push('/Customerdashboard')
                }
                else if (data.role == "Professional"){
                    console.log("Hi Professional")
                    this.$router.push('/Professionaldashboard')
                } }
                catch (error) {
                    console.error("Login Error:", error.message);
                    this.errorMessage = error.message;
                    setTimeout(() => alert(error.message), 100);
                    
            }
        }
    }

}