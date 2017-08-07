from eve import Eve
from flask import redirect, render_template, render_template_string, request, current_app as app
import json
from flask import jsonify
from flask_pymongo import PyMongo
# import requests
from bson.objectid import ObjectId
from datetime import datetime

app = Eve(__name__, template_folder='templates')
mongo = app.data.driver

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, datetime):
            return o.__str__()
        return json.JSONEncoder.default(self, o)

def post_annotation_callback(docs):
    for doc in docs:
        doc['id'] = str(doc['_id'])
        f = {'_id': doc['_id']}
        mongo.db.annotations.update(f, doc)

app.on_inserted_annotations += post_annotation_callback

@app.route('/test')
def test():
    return render_template('index.html')

@app.route('/test.js')
def test_js():
    return render_template('test.js')

@app.route('/annotations/search')
def search_annotation():
    params = dict(request.args.items())
    uri = params['uri']
    f = {'uri': uri}
    query_results = mongo.db.annotations.find(f)
    query_items = []
    for result in query_results:
        query_items.append(result)

    return JSONEncoder().encode({"total": len(query_items), "rows": query_items})

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", threaded=True)
