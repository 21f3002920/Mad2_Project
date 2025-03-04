from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin

db=SQLAlchemy()

#Database Schema for Users
class User(db.Model,UserMixin):
    __tablename__ = 'user'
    id=db.Column(db.Integer, primary_key=True)
    email=db.Column(db.String, unique=True, nullable=False)
    password=db.Column(db.String, nullable=False)
    #flask_Security feature
    fs_uniquifier=db.Column(db.String, unique=True, nullable=False)
    active=db.Column(db.Boolean, default=True)
    roles=db.Relationship('Role', backref='bearers', secondary='user_roles')

    
class Role(db.Model,RoleMixin):
    id=db.Column(db.Integer, primary_key=True)
    name=db.Column(db.String, unique=True, nullable=False)
    description=db.Column(db.String, nullable=False)

class UserRoles(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    user_id=db.Column(db.Integer, db.ForeignKey('user.id'))
    role_id=db.Column(db.Integer, db.ForeignKey('role.id'))

class Service(db.Model):
    __tablename__='service'
    service_id=db.Column(db.Integer, primary_key=True)
    service_name=db.Column(db.String,nullable=False)
    service_baseprice=db.Column(db.Integer, nullable=False)
    service_time=db.Column(db.Integer, nullable=False)
    service_description=db.Column(db.String,nullable=False)

class Customer(db.Model):
    __tablename__='customer'
    c_id=db.Column(db.Integer, primary_key=True)
    c_name=db.Column(db.String, nullable=False)
    c_userid=db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    c_flag=db.Column(db.Integer, nullable=False)
    c_address=db.Column(db.String, nullable=False)
    c_pincode=db.Column(db.Integer, nullable=False)
    c_phone=db.Column(db.Integer, nullable=False)

class Professional(db.Model):
    __tablename__='professional'
    p_id = db.Column(db.Integer, primary_key=True)
    p_name=db.Column(db.String, nullable=False)
    p_userid=db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    p_serviceid=db.Column(db.Integer, db.ForeignKey('service.service_id'), nullable=False)
    p_experience=db.Column(db.Integer, nullable=False)
    p_flag=db.Column(db.Integer, nullable=False)
    p_active=db.Column(db.Boolean, default=False)
    p_pincode=db.Column(db.Integer, nullable=False)
    p_phone=db.Column(db.Integer, nullable=False)
    p_aadhaarnumber=db.Column(db.String, nullable=False)
    
    






'''class ServiceRequest(db.Model):
    __tablename__='servicerequest'
    service_request_id=db.Column(db.Integer, primary_key=True)
    service_id=db.Column(db.Integer, db.ForeignKey('service.id'), nullable=False)
    customer_id=db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    professional_id=db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date_of_request=db.Column(db.Date, nullable=True)
    date_of_completion=db.Column(db.Date, nullable=True)
    service_status=db.Column(db.String, nullable=False)

    



'''