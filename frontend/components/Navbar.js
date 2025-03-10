export default {
    template:`
    <div class="header">
        <router-link :to="goBackPath" class="navbarleft">Servico</router-link>
        <span v-if="$store.state.loggedIn && $store.state.role !== 'Admin'" class="username">Welcome, {{ $store.state.user_name }}</span>
        <button class="logout" v-if="$store.state.loggedIn" @click="$store.commit('logout'),$router.push('/')">Logout</button>
    </div>
    `,
    computed:{
        goBackPath(){
            if (this.$store.state.role === "Admin") {
                return ("/Admindashboard")
            }
            else if (this.$store.state.role === "Customer") {
                return ("/Customerdashboard")
            }
            else if (this.$store.state.role === "Professional") {
                return ("/Professionaldashboard")
            }
            else{
                return("/")
            }
        }
    }
};
  
    

