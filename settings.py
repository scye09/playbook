MONGO_HOST = "db"
MONGO_PORT = 27017
MONGO_DBNAME = "eve"
RESOURCE_METHODS = ['GET', 'POST']
ITEM_METHODS = ['GET', 'PATCH', 'PUT', 'DELETE']
XML = False
JSON = True
DEBUG = True
ALLOW_UNKNOWN = True

annotationSchema = {
}


annotations = {
    'schema': annotationSchema,
}


DOMAIN = {
    'annotations': annotations,
    }
