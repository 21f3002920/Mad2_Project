from flask import request, jsonify
from flask_restful import Api, Resource, fields, marshal_with
from flask_security import auth_required, current_user
from backend.models import db, User,Service, Customer, Professional

api=Api(prefix='/api')

service_fields= {
    'service_id':fields.Integer,
    'service_name':fields.String,
    'service_baseprice':fields.Integer,
    'service_time':fields.Integer,
    'service_description':fields.String,
}

customer_fields = {
    'c_id' : fields.Integer,
    'c_name' : fields.String,
    'c_userid' : fields.Integer,
    'c_flag' : fields.Integer,
    'c_address' : fields.String,
    'c_pincode' : fields.Integer,
    'c_phone' : fields.Integer,
}

user_fields = {
    'id' : fields.Integer,
    'email' : fields.String,
    'active' : fields.Boolean,
}


# SERVICES SERVICES SERVICES SERVICES SERVICES SERVICES SERVICES SERVICES SERVICES SERVICES SERVICES SERVICES SERVICES

class ServiceAPI(Resource):
    @marshal_with(service_fields)
    @auth_required('token')
    def get(self, service_id):
        service=Service.query.get(service_id)

        if not service:
            return {"message" : "Service not found"}, 404
        return service

    @auth_required('token')
    def delete(self, service_id):
        service=Service.query.get(service_id)

        if current_user.id == 1:
            db.session.delete(service)
            db.session.commit()

    @auth_required('token')
    def put(self, service_id):
        
        if current_user.id != 1:
            return {"message": "Unauthorized"}, 403
 
        service = Service.query.get(service_id)
        if not service:
            return {"message" : "Service not found"}, 404
        
        data = request.get_json()
        service_name=data.get('service_name')
        service_baseprice=data.get('service_baseprice')
        service_time=data.get('service_time')
        service_description=data.get('service_description')
        service.service_name = service_name
        service.service_baseprice = service_baseprice
        service.service_time = service_time
        service.service_description = service_description
        db.session.commit()

class ServiceListAPI(Resource):
    @marshal_with(service_fields)
    @auth_required('token')
    def get(self):
        service=Service.query.all()
        return service

    @auth_required('token')
    def post(self):
        data=request.get_json()
        service_name=data.get('service_name')
        service_baseprice=data.get('service_baseprice')
        service_time=data.get('service_time')
        service_description=data.get('service_description')

        try:
            service=Service(service_name=service_name, service_baseprice=service_baseprice, service_time=service_time, service_description=service_description)
            db.session.add(service)
            db.session.commit()
            return jsonify({"message" : "Service created"})
        except:
            db.session.rollback()

api.add_resource(ServiceAPI, '/services/<int:service_id>')
api.add_resource(ServiceListAPI, '/services')


# CUSTOMERS CUSTOMERS CUSTOMERS CUSTOMERS CUSTOMERS CUSTOMERS CUSTOMERS CUSTOMERS CUSTOMERS CUSTOMERS CUSTOMERS CUSTOMERS CUSTOMERS CUSTOMERS

class CustomerListAPI(Resource):
    @auth_required('token')
    def get(self):
        customers = db.session.query(Customer, User).join(User, Customer.c_userid == User.id).all()
        result = []
        for customer, user in customers:
            result.append({
                'c_id': customer.c_id,
                'c_name': customer.c_name,
                'c_userid': customer.c_userid,
                'c_flag': customer.c_flag,
                'c_address': customer.c_address,
                'c_pincode': customer.c_pincode,
                'c_phone': customer.c_phone,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'active': user.active
                }
            })
        return jsonify(result)

class CustomerAPI(Resource):
    @auth_required('token')
    def put(self, c_id):
        if current_user.roles[0].name != 'Admin':
            return {"message": "Unauthorized"}, 403

        customer = Customer.query.filter_by(c_id=c_id).first()
        if not customer:
            return {"message": "Customer not found"}, 404

        user = User.query.get(customer.c_userid)
        if not user:
            return {"message": "User not found"}, 404

        user.active = not user.active  # Toggle active status
        db.session.commit()

    @auth_required('token')
    def delete(self, c_id):
        if current_user.roles[0].name != 'Admin':
            return {"message": "Unauthorized"}, 403

        customer = Customer.query.filter_by(c_id=c_id).first()
        if not customer:
            return {"message": "Customer not found"}, 404

        user = User.query.get(customer.c_userid)
        if user:
            db.session.delete(user)  
            db.session.delete(customer)
            db.session.commit()
        return {"message": "Customer deleted"}

api.add_resource(CustomerListAPI, '/customers')
api.add_resource(CustomerAPI, '/customers/<int:c_id>')


# PROFESSIONALS PROFESSIONALS PROFESSIONALS PROFESSIONALS PROFESSIONALS PROFESSIONALS PROFESSIONALS PROFESSIONALS PROFESSIONALS PROFESSIONALS PROFESSIONALS

class ProfessionalListAPI(Resource):
    @auth_required('token')
    def get(self):
        professionals = db.session.query(Professional, User, Service).join(User, Professional.p_userid == User.id).join(Service, Professional.p_serviceid == Service.service_id).all()
        result = []
        for professional, user, service in professionals:
            result.append({
                'p_id': professional.p_id,
                'p_name': professional.p_name,
                'p_userid': professional.p_userid,
                'p_serviceid': professional.p_serviceid,
                'service_name' : service.service_name,
                'p_experience': professional.p_experience,
                'p_flag': professional.p_flag,
                'p_active': professional.p_active,
                'p_pincode': professional.p_pincode,
                'p_phone': professional.p_phone,
                'p_aadhaarnumber': professional.p_aadhaarnumber,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'active': user.active
                }
            })
        return jsonify(result)

class ProfessionalAPI(Resource):
    @auth_required('token')
    def put(self, p_id):
        if current_user.roles[0].name != 'Admin':
            return {"message": "Unauthorized"}, 403

        professional = Professional.query.filter_by(p_id=p_id).first()
        if not professional:
            return {"message": "Professional not found"}, 404

        user = User.query.get(professional.p_userid)
        if not user:
            return {"message": "User not found"}, 404

        user.active = not user.active 
        professional.p_active=True
        db.session.commit()

    @auth_required('token')
    def delete(self, p_id):
        if current_user.roles[0].name != 'Admin':
            return {"message": "Unauthorized"}, 403

        professional = Professional.query.filter_by(p_id=p_id).first()
        if not professional:
            return {"message": "Professional not found"}, 404

        user = User.query.get(professional.p_userid)
        if user:
            db.session.delete(user)  
            db.session.delete(professional)
            db.session.commit()
        return {"message": "Professional deleted"}   
    
    
api.add_resource(ProfessionalListAPI, '/professionals')
api.add_resource(ProfessionalAPI, '/professionals/<int:p_id>')