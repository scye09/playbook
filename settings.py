MONGO_HOST = "db"
MONGO_PORT = 27017
MONGO_DBNAME = "eve"
RESOURCE_METHODS = ['GET', 'POST']
ITEM_METHODS = ['GET', 'PATCH', 'PUT', 'DELETE']
XML = False
JSON = True
DEBUG = True
ALLOW_UNKNOWN = True
HATEOAS = False
IF_MATCH = False

MONGO_QUERY_BLACKLIST = ['$where']

annotationSchema = {

}

annotations = {
    'schema': annotationSchema,
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

accounts = {
    'schema': accountsSchema
}


DOMAIN = {
    'annotations': annotations,
    'accounts': accounts
    }
