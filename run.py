from eve import Eve
from flask import redirect, render_template, render_template_string, request, current_app as app
import json
from flask import jsonify
from flask_pymongo import PyMongo
import requests
from bson.objectid import ObjectId

app = Eve(__name__, template_folder='templates')
mongo = app.data.driver

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
    last_slash = uri.rfind('/')
    base_url = uri[:(last_slash+1)]
    query_url = base_url + 'annotations?where={"uri": "' + uri + '"}'
    response = requests.get(query_url)
    text = response.json()
    items = text['_items']
    return jsonify({"total": len(items), "rows": items})


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", threaded=True)
