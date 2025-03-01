export default{
    props: ['service_id','service_name','service_baseprice','service_time','service_description'],
    template:`
    <div class="jumbotron">
        <h2 @click="$router.push('/Admindashboard/Service/'+ service_id)">{{service_name}}</h2>
        <p>{{service_description}}</p>
    </div>
`,
};