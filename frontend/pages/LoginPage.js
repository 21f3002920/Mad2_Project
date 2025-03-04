export default {
    template: `
    <div class="main-content">
        <h2>Welcome</h2>
        <div class="navbarleft">
            <p>LOGIN</p> 
        </div>
    <div class="">
        <div class="input-field">
            <input placeholder="email" v-model="email"/>
            <input placeholder="password" v-model="password"/>
        </div>
        <button class="button" @click="submitLogin"> Login </button>
    </div>
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
            if (data.role == "Admin"){
                localStorage.setItem('user', JSON.stringify(data))
                this.$store.commit('setUser')
                console.log("Hi Admin")
                this.$router.push('/Admindashboard')
            }
            else if (data.role == "Customer"){
                if (data.active == true){
                    localStorage.setItem('user', JSON.stringify(data))
                    this.$store.commit('setUser')
                    console.log("Hi Customer")
                    this.$router.push('/Customerdashboard')
                }
                else{
                    alert("Account Deactivated. Contact Admin for details.")
                        
                }
            }
            else if (data.role == "Professional"){
                if (data.active == true){
                    localStorage.setItem('user', JSON.stringify(data))
                    this.$store.commit('setUser')
                    console.log("Hi Professional")
                    this.$router.push('/Professionaldashboard')
                }
                else{
                    alert("Account Deactivated. Contact Admin for details.")
                }
            } 
        }
        catch (error) {
            console.error("Login Error:", error.message);
            this.errorMessage = error.message;
            setTimeout(() => alert(error.message), 100);
            }
        }
    }

}