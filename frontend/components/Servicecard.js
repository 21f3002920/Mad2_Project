export default{
    props: ['service_name','service_description'],
    template:`
    <div class="jumbotron">
        <h2>{{service_name}}</h2>
        <p>{{service_description}}</p>
    </div>
`,
};