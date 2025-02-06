from flask import current_app as app
from backend.models import db
from flask_security import SQLAlchemyUserDatastore, hash_password

with app.app_context():
    db.create_all()

    userdatastore : SQLAlchemyUserDatastore = app.security.datastore

    userdatastore.find_or_create_role(name = 'Admin', description = 'superuser')
    userdatastore.find_or_create_role(name = 'Customer', description = 'general user')
    userdatastore.find_or_create_role(name = 'Professional', description = 'general user')

    if (not userdatastore.find_user(email = 'admin@study.iitm.ac.in')):
        userdatastore.create_user(email = 'admin@study.iitm.ac.in', password = hash_password('pass'), roles = ['Admin'] )
    if (not userdatastore.find_user(email = 'user01@study.iitm.ac.in')):
        userdatastore.create_user(email = 'user01@study.iitm.ac.in', password = hash_password('pass'), roles = ['Customer'] )
    if (not userdatastore.find_user(email = 'user02@study.iitm.ac.in')):
        userdatastore.create_user(email = 'user02@study.iitm.ac.in', password = hash_password('pass'), roles = ['Professional'] ) # for testing

    db.session.commit()