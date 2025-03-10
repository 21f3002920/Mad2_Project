const store=new Vuex.Store({
    state:{
        auth_token:null,
        role:null,
        loggedIn:false,
        user_id: null,
        user_name: null,
    },

    mutations:{
        setUser(state){
            try{
                if (JSON.parse(localStorage.getItem('user'))){
                    const user= JSON.parse(localStorage.getItem('user'));
                    state.auth_token= user.token;
                    state.role=user.role;
                    state.loggedIn=true;
                    state.user_id=user.id;
                    state.user_name = user.name;
                }
            }catch{
                console.warn('not logged in')
            }
        },
        logout(state){
            state.auth_token= null;
            state.role=null;
            state.loggedIn=false;
            state.user_id=null;
            state.user_name = null;
            localStorage.removeItem('user');
        }
    },
    
    actions:{
    }
})

store.commit('setUser')
export default store;