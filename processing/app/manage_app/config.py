from datetime import timedelta
import os
import logging
from dotenv import load_dotenv

load_dotenv()


class Config:
    DEBUG = os.getenv("DEBUG")
    TESTING = os.getenv("TESTING")

    DATABASE = {
        'host': os.getenv('DB_HOST'),
        'port': os.getenv('DB_PORT'),
        'name': os.getenv('DB_NAME'),
        'user': os.getenv('DB_USER'),
        'password': os.getenv('DB_PASSWORD')
    }

    DATABASE_TEST = {
        'host': os.getenv('TESTING_DB_HOST'),
        'port': os.getenv('TESTING_DB_PORT'),
        'name': os.getenv('TESTING_DB_NAME'),
        'user': os.getenv('TESTING_DB_USER'),
        'password': os.getenv('TESTING_DB_PASSWORD')
    }

    if os.getenv('APP_ENV') == 'development':
        LOG_LEVEL = logging.DEBUG
        LOG_FILEMODE = 'w'
        LOG_FILE = 'app.log'
        LOG_FORMAT = '%(asctime)s %(levelname)s %(message)s'
        LOG_MAX_BYTES = 1*1024*1024  # 5 MB
        LOG_BACKUP_COUNT = 5

    else:
        LOG_LEVEL = logging.INFO
        LOG_FILEMODE = 'a'
        LOG_FILE = 'app.log'
        LOG_FORMAT = '%(asctime)s %(levelname)s %(message)s'
        LOG_MAX_BYTES = 1*1024*1024  # 5 MB
        LOG_BACKUP_COUNT = 5

    OPEN_ROUTS = {
                   '/api/processing/swagger/ui', '/docs', '/api/processes/swagger.json','/favicon.ico',
                   '/api/processing/swaggerui/droid-sans.css',
                   '/api/processing/swaggerui/swagger-ui.css',
                   '/api/processing/swaggerui/swagger-ui-bundle.js',
                   '/api/processing/swaggerui/swagger-ui-standalone-preset.js',
                   '/api/processing/swaggerui/favicon-32x32.png',
                   '/api/processing/swaggerui/favicon-16x16.png',
                   '/api/processing/openapi.json',
                   '/swagger/ui', '/docs', '/swagger.json',
                   '/swaggerui/droid-sans.css',
                   '/swaggerui/swagger-ui.css',
                   '/swaggerui/swagger-ui-bundle.js',
                   '/swaggerui/swagger-ui-standalone-preset.js',
                   '/swaggerui/favicon-32x32.png',
                   '/swaggerui/favicon-16x16.png',
                   '/openapi.json'
                    }
