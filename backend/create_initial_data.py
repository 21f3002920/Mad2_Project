from flask import current_app as app
from backend.models import db
from flask_security import SQLAlchemyUserDatastore, hash_password
with app.app_context():
    db.create_all()

    userdatastore:SQLAlchemyUserDatastore=app.security.datastore

    userdatastore.find_or_create_role(name='Admin', description='Super User')
    userdatastore.find_or_create_role(name='Customer', description='Requests Service')
    userdatastore.find_or_create_role(name='Professional', description='Completes Service')

    if (not userdatastore.find_user(email='admin@gmail.com')):
        userdatastore.create_user(email='admin@gmail.com', password=hash_password('pass'), roles=['Admin'])
    if (not userdatastore.find_user(email='c')):
        userdatastore.create_user(email='c', password=hash_password('pass'), roles=['Customer'])
    if (not userdatastore.find_user(email='p')):
        userdatastore.create_user(email='p', password=hash_password('pass'), roles=['Professional'])

    db.session.commit()