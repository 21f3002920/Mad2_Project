from flask import request, jsonify
from flask_restful import Api, Resource, fields, marshal_with
from datetime import datetime
from flask_security import auth_required, current_user
from backend.models import db, User,Service, Customer, Professional, ServiceRequest

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


# SERVICES DATA

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


# CUSTOMERS DATA

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
            return {"message": "Unauthorized Action"}, 403

        customer = Customer.query.filter_by(c_id=c_id).first()
        if not customer:
            return {"message": "Customer not found"}, 404

        user = User.query.get(customer.c_userid)
        if not user:
            return {"message": "User not found"}, 404

        user.active = not user.active  
        db.session.commit()

    @auth_required('token')
    def delete(self, c_id):
        if current_user.roles[0].name != 'Admin':
            return {"message": "Unauthorized Action"}, 403

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


# PROFESSIONALS DATA

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
    
api.add_resource(ProfessionalListAPI, '/professionals')

class ProfessionalAPI(Resource):
    @auth_required('token')
    def put(self, p_id):
        if current_user.roles[0].name != 'Admin':
            return {"message": "Unauthorized Action"}, 403

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
            return {"message": "Unauthorized Action"}, 403

        professional = Professional.query.filter_by(p_id=p_id).first()
        if not professional:
            return {"message": "Professional not found"}, 404

        user = User.query.get(professional.p_userid)
        if user:
            db.session.delete(user)  
            db.session.delete(professional)
            db.session.commit()
        return {"message": "Professional deleted"}   
    
api.add_resource(ProfessionalAPI, '/professionals/<int:p_id>')


# DATA OF PROFESSIONALS TO GIVEN SERVICE

class ProfessionalsByServiceAPI(Resource):
    @auth_required('token')
    def get(self, service_id):
        try:
            service_id = int(service_id)  
            print(f"Fetching professionals for service_id: {service_id}") 

            professionals = (
                db.session.query(Professional, User, Service)
                .join(User, Professional.p_userid == User.id)
                .join(Service, Professional.p_serviceid == Service.service_id)
                .filter(Professional.p_serviceid == service_id, Professional.p_active == True)
                .all()
            )

            if not professionals:
                print("No professionals found.") 
                return {"message": "No professionals found for this service."}, 404

            result = []
            for professional, user, service in professionals:
                result.append({
                    'p_id': professional.p_id,
                    'p_name': professional.p_name,
                    'p_serviceid': professional.p_serviceid, 
                    'service_name': service.service_name, 
                    'p_experience': professional.p_experience,
                    'p_flag': professional.p_flag,
                    'p_pincode': professional.p_pincode,
                    'p_phone': professional.p_phone,
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'active': user.active
                    }
                })
            
            print(f"Returning {len(result)} professionals.")  
            return jsonify(result)

        except Exception as e:
            print(f"Error: {str(e)}")  
            return {"message": "Internal Server Error"}, 500

api.add_resource(ProfessionalsByServiceAPI, '/services/<int:service_id>/professionals')


# BOOKING OF SERVICE BY CUSTOMER

class BookServiceAPI(Resource):
    @auth_required('token')
    def post(self):
        data = request.get_json()

        user_id = current_user.id

        customer = Customer.query.filter_by(c_userid=user_id).first()

        if not customer:
            return {"message": "Customer profile not found"}, 400
        
        professional_id = data.get('professional_id')
        service_id = data.get('service_id')

        if not professional_id or not service_id:
            return {"message": "Invalid booking request"}, 400

        professional = Professional.query.filter_by(p_id=professional_id).first()
        if not professional:
            return {"message": "Professional not found"}, 404
        
        existing_request = ServiceRequest.query.filter_by(
            sr_customerid=customer.c_id,
            sr_professionalid=professional_id,
            sr_serviceid=service_id
        ).filter(ServiceRequest.sr_status.in_(["Requested", "Accepted", "Closed by Customer", "Closed by Professional"])).first()

        if existing_request:
            return {"message": "You already have an active service request with this professional. Please wait until it is completed before booking again."}, 400

        new_request = ServiceRequest(
            sr_customerid=customer.c_id,
            sr_professionalid=professional_id,
            sr_serviceid=service_id,
            sr_created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
        )
        db.session.add(new_request)
        db.session.commit()

        return {"message": "Service request created successfully"}, 201

api.add_resource(BookServiceAPI, '/service/book')


# SERVICE REQUEST DATA FOR CUSTOMERS

class ServiceRequestsForCustomerAPI(Resource):
    @auth_required('token')
    def get(self):
        try:
            customer = Customer.query.filter_by(c_userid=current_user.id).first()
            if not customer:
                return {"message": "Customer profile not found"}, 400
            
            status_filter = request.args.get("status", "Requested,Accepted,Closed,Rejected,").split(",")

            service_requests = (
                db.session.query(ServiceRequest, Professional, Service)
                .join(Professional, ServiceRequest.sr_professionalid == Professional.p_id)
                .join(Service, ServiceRequest.sr_serviceid == Service.service_id)
                .filter(ServiceRequest.sr_customerid == customer.c_id)
                .filter(ServiceRequest.sr_status.in_(status_filter)) 
                .all()
            )

            result = []
            for sr, professional, service in service_requests:
                result.append({
                    'sr_id': sr.sr_id,
                    'service_name': service.service_name,
                    'professional_name': professional.p_name,
                    'professional_experience': professional.p_experience,
                    'professional_pincode': professional.p_pincode,
                    'professional_phone': professional.p_phone,
                    'sr_created_at': sr.sr_created_at if isinstance(sr.sr_created_at, str) else (sr.sr_created_at.strftime("%Y-%m-%d %H:%M:%S") if sr.sr_created_at else "N/A"),
                    'sr_closed_at': sr.sr_closed_at if isinstance(sr.sr_closed_at, str) else (sr.sr_closed_at.strftime("%Y-%m-%d %H:%M:%S") if sr.sr_closed_at else "N/A"),
                    'status': sr.sr_status
                })

            return jsonify(result)

        except Exception as e:
            print(f"🔥 ERROR in ServiceRequestsForCustomerAPI: {str(e)}")
            return {"message": "Internal Server Error", "error": str(e)}, 500

api.add_resource(ServiceRequestsForCustomerAPI, '/customer/service_requests')


# SERVICE REQUEST DATA FOR PROFESSIONALS

class ServiceRequestsForProfessionalAPI(Resource):
    @auth_required('token')
    def get(self):
        professional = Professional.query.filter_by(p_userid=current_user.id).first()
        if not professional:
            return {"message": "Professional profile not found"}, 400

        status_filter = request.args.get("status", "Requested, Accepted, Closed, Rejected").split(",")

        service_requests = (
            db.session.query(ServiceRequest, Customer, Service)
            .join(Customer, ServiceRequest.sr_customerid == Customer.c_id)
            .join(Service, ServiceRequest.sr_serviceid == Service.service_id)
            .filter(ServiceRequest.sr_professionalid == professional.p_id)
            .filter(ServiceRequest.sr_status.in_(status_filter))  
            .all()
        )

        result = []
        for sr, customer, service in service_requests:
            result.append({
                'sr_id': sr.sr_id,
                'customer_name': customer.c_name,
                'customer_address': customer.c_address,
                'customer_phone': customer.c_phone,
                'sr_created_at': sr.sr_created_at,
                'sr_closed_at': sr.sr_closed_at,  
                'service_name': service.service_name,
                'status': sr.sr_status
            })

        return jsonify(result)

api.add_resource(ServiceRequestsForProfessionalAPI, '/professional/service_requests')


# ACCEPTING OR REJECTING SERVICE REQUEST

class UpdateServiceRequestStatusAPI(Resource):
    @auth_required('token')
    def put(self, sr_id):
        professional = Professional.query.filter_by(p_userid=current_user.id).first()
        if not professional:
            return {"message": "Unauthorized"}, 403

        service_request = ServiceRequest.query.get(sr_id)
        if not service_request or service_request.sr_professionalid != professional.p_id:
            return {"message": "Service request not found"}, 404
        
        data = request.get_json()
        new_status = data.get('status')

        if new_status not in ["Accepted", "Rejected"]:
            return {"message": "Invalid status update"}, 400

        service_request.sr_status = new_status
        if new_status == "Rejected":
            service_request.sr_closed_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        db.session.commit()
        return {"message": f"Service request {new_status.lower()} successfully"}

api.add_resource(UpdateServiceRequestStatusAPI, '/service_requests/<int:sr_id>/status')


# CLOSE SERVICE REQUEST BY CUSTOMER

class CloseServiceRequestAPI(Resource):
    @auth_required('token')
    def put(self, sr_id):
        customer = Customer.query.filter_by(c_userid=current_user.id).first()
        if not customer:
            return {"message": "Unauthorized"}, 403

        service_request = ServiceRequest.query.get(sr_id)
        if not service_request or service_request.sr_customerid != customer.c_id:
            return {"message": "Service request not found"}, 404

        if service_request.sr_status != "Accepted" and service_request.sr_status != "Closed by Professional":
            return {"message": "Only accepted or closed-by-professional requests can be closed"}, 400

        data = request.get_json()
        impressed = data.get("impressed", True)  

        professional = Professional.query.get(service_request.sr_professionalid)

        if not impressed and professional:
            professional.p_flag += 1

        new_status = "Closed" if service_request.sr_status == "Closed by Professional" else "Closed by Customer"

        service_request.sr_status = new_status
        service_request.sr_closed_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        db.session.commit()
        return {"message": f"Service request marked as {new_status} successfully."}


api.add_resource(CloseServiceRequestAPI, '/service_requests/<int:sr_id>/close')


# CLOSE SERVICE REQUEST BY PROFESSIONAL

class CloseServiceRequestByProfessionalAPI(Resource):
    @auth_required('token')
    def put(self, sr_id):
        professional = Professional.query.filter_by(p_userid=current_user.id).first()
        if not professional:
            return {"message": "Unauthorized"}, 403

        service_request = ServiceRequest.query.get(sr_id)
        if not service_request or service_request.sr_professionalid != professional.p_id:
            return {"message": "Service request not found"}, 404

        if service_request.sr_status not in ["Accepted", "Closed by Customer"]:
            return {"message": "Only accepted or closed-by-customer requests can be closed"}, 400

        data = request.get_json()
        impressed = data.get("impressed", True) 

        customer = Customer.query.get(service_request.sr_customerid)
        
        if not impressed and customer:
            customer.c_flag += 1

        new_status = "Closed by Professional" if service_request.sr_status == "Accepted" else "Closed"
        
        service_request.sr_status = new_status
        service_request.sr_closed_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        db.session.commit()
        return {"message": f"Service request marked as {new_status} successfully."}


api.add_resource(CloseServiceRequestByProfessionalAPI, '/service_requests/<int:sr_id>/close_by_professional')


# DELETE/CANCEL SERVICE REQUEST

class DeleteServiceRequestAPI(Resource):
    @auth_required('token')
    def delete(self, sr_id):
        customer = Customer.query.filter_by(c_userid=current_user.id).first()
        if not customer:
            return {"message": "Unauthorized"}, 403

        service_request = ServiceRequest.query.get(sr_id)
        if not service_request or service_request.sr_customerid != customer.c_id:
            return {"message": "Service request not found"}, 404
        
        if service_request.sr_status != "Requested":
            return {"message": "Only requested service requests can be canceled"}, 400

        db.session.delete(service_request)
        db.session.commit()
        
        return {"message": "Service request canceled successfully"}

api.add_resource(DeleteServiceRequestAPI, '/service_requests/<int:sr_id>')
