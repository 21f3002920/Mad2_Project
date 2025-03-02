
export default{
    props: ['service_id','service_name','service_baseprice','service_time','service_description'],
    template:`

    <div class="jumbotron">
        <h2 @click="goToService">{{service_name}}</h2>
        <p>{{service_description}}</p>
    </div>
`,
    methods:{
        goToService(){
            if (this.$store.state.role === "Admin") {
                this.$router.push(`/Admindashboard/Service/${this.service_id}`);
            } 
            else {
                this.$router.push(`/Customerdashboard/Service/${this.service_id}`);
            }
        }
}
};