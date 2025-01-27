class Config():
    DEBUG=False
    SQL_ALCHEMY_TRACK_MODIFICATIONS=False

class LocalDevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI="sqlite:///database.sqlite3"
    DEBUG=True
    SECURITY_PASSWORD_HASH='bcrypt'
    SECURITY_PASSWORD_SALT='RishabR'
    SECRET_KEY="RISHABIITM"
    WTF_CSRF_ENABLED=False
