from flask import request, jsonify
from flask_restful import Api, Resource, fields, marshal_with
from flask_security import auth_required, current_user
from backend.models import db, Service

api=Api(prefix='/api')

service_fields= {
    'service_id':fields.Integer,
    'service_name':fields.String,
    'service_baseprice':fields.Integer,
    'service_time':fields.Integer,
    'service_description':fields.String,
}

#Search and Deleting Services
class BlogAPI(Resource):
    @marshal_with(service_fields)
    @auth_required('token')
    def get(self, service_id):
        service=Service.query.get(service_id)

        if not service:
            return {"message" : "Service not found"}, 404
        return service

    @auth_required('token')
    def get(self, service_id):
        service=Service.query.get(service_id)

        if not service:
            return {"message" : "Service not found"}, 404

        if current_user.id == 1:
            db.session.delete(service)
            db.session.commit()

# Display and add Services
class BlogListAPI(Resource):
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



api.add_resource(BlogAPI, '/services/<int:service_id>')
api.add_resource(BlogListAPI, '/services')