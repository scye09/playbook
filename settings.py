MONGO_HOST = "db"
MONGO_PORT = 27017
MONGO_DBNAME = "eve"
RESOURCE_METHODS = ['GET', 'POST']
ITEM_METHODS = ['GET', 'PATCH', 'PUT', 'DELETE']
PUBLIC_METHODS = ['GET']
PUBLIC_ITEM_METHODS = ['GET']
XML = False
JSON = True
DEBUG = True
ALLOW_UNKNOWN = True
HATEOAS = False
IF_MATCH = False

annotationSchema = {

}

accountsSchema = {
    'userid':{
        'type': 'string'
    },
    'password': {
        'type': 'string'
    },
    'roles': {
        'type': 'list',
        'schema': {
            'type': 'string'
        }
    }
}

annotations = {
    'schema': annotationSchema,

}

accounts = {
    'schema': accountsSchema
}


DOMAIN = {
    'annotations': annotations,
    'accounts': accounts
    }
