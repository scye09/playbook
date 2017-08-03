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
    #'annotation': {
    #}
    '''
     "id": {
        'type': 'string'
     },  # unique id (added by backend)
     "annotator_schema_version": {
        'type': 'string'
     },       # schema version: default v1.0
     "created": {
        'type': 'datetime'
     },   # created datetime in iso8601 format (added by backend)
     "updated": {
        'type': 'datetime'
     },   # updated datetime in iso8601 format (added by backend)
     "text": {
        'type': 'string'
     },                  # content of annotation
     "quote": {
        'type': 'string'
     },   # the annotated text (added by frontend)
     "uri": {
        'type': 'string'
     },              # URI of annotated document (added by frontend)
      "ranges": {
        'type': 'list',
        'schema': {
            'allow_unknown': True
        }
      },                                # list of ranges covered by annotation (usually only one entry)
        #{
        #  "start": "/p[69]/span/span",           # (relative) XPath to start element
        #  "end": "/p[70]/span/span",             # (relative) XPath to end element
        #  "startOffset": 0,                      # character offset within start element
        #  "endOffset": 120                       # character offset within end element
        #}
      "user": {
        'type': 'string'
      },                          # user id of annotation owner (can also be an object with an 'id' property)
      "consumer": {
        'type': 'string'
      }                  # consumer key of backend
      '''
}

annotations = {
    'schema': annotationSchema,
    'url': 'annotations/annotations'
}

DOMAIN = {
    'annotations': annotations,
    }
