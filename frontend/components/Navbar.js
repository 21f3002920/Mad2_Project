export default {
    template:`
        <div class="header">
            <router-link to="/" class="navbarleft">Servico</router-link>
            <button class="logout" v-if="$store.state.loggedIn" @click="$store.commit('logout'),$router.push('/')">Logout</button>
        </div>
        

    `,
    
  };
  
    

