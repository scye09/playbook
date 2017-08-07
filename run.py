from eve import Eve
from flask import redirect, render_template, render_template_string, request, current_app as app
import json
from flask import jsonify
from flask_pymongo import PyMongo
import requests
from bson.objectid import ObjectId
from eve.io.base import BaseJSONEncoder
from datetime import datetime
import bcrypt
from eve.auth import BasicAuth

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, datetime):
            return o.__str__()
        return json.JSONEncoder.default(self, o)


class UserAuth(BasicAuth):
   def check_auth(self, userid, password, allowed_roles, resource, method):
       accounts = app.data.driver.db['accounts']
       lookup = {'userid': userid}
       #if allowed_roles:
        #   lookup['roles'] = {'$in': allowed_roles}
       account = accounts.find_one(lookup)
       return account and \
           bcrypt.hashpw(password, account['salt']) == account['password']

def create_user(documents):
   for document in documents:
       document['salt'] = bcrypt.gensalt()
       password = document['password']
       password = bcrypt.hashpw(password, document['salt'])
       document['password'] = password

def post_annotation_callback(docs):
    for doc in docs:
        doc['id'] = str(doc['_id'])
        f = {'_id': doc['_id']}
        mongo.db.annotations.update(f, doc)

app = Eve(__name__, auth=UserAuth, template_folder='templates')
mongo = app.data.driver

app.on_inserted_annotations += post_annotation_callback
app.on_insert_accounts += create_user

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

    # query_json = json.dumps(query_items, default=json_util.default)

    # last_slash = uri.rfind('/')
    # base_url = uri[:(last_slash+1)]
    # query_url = base_url + 'annotations?where={"uri": "' + uri + '"}'
    # response = requests.get(query_url)
    # text = response.json()
    # items = text['_items']
    return JSONEncoder().encode({"total": len(query_items), "rows": query_items})


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", threaded=True)
