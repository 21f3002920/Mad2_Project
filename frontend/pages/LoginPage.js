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
            const res= await fetch(location.origin+'/login',
                {
                    method : 'POST',
                    headers : {'Content-Type': 'application/json'}, 
                    body : JSON.stringify({'email':this.email,'password':this.password})
                })
            if(res.ok){
                console.log('we are logged in')
                const data= await res.json()
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
                }
                    
            }
        }
    }

}