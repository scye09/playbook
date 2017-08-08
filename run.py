from eve import Eve
from flask import redirect, render_template, render_template_string, request, current_app as app
import json
from flask import jsonify
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from datetime import datetime
from eve.auth import BasicAuth
import bcrypt
from flask import current_app

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
       account = accounts.find_one(lookup)
       if account and bcrypt.hashpw(password, account['salt']) == account['password']:
           self.set_request_auth_value(account['_id'])
       return account and bcrypt.hashpw(password, account['salt']) == account['password']

def create_user(documents):
   for document in documents:
       document['salt'] = bcrypt.gensalt()
       password = document['password']
       password = bcrypt.hashpw(password, document['salt'])
       document['password'] = password

def post_annotation_callback(docs):
    for doc in docs:
        doc['id'] = str(doc['_id'])
        doc['user'] = current_app.auth.get_request_auth_value()
        f = {'_id': doc['_id']}
        mongo.db.annotations.update(f, doc)

app = Eve(__name__, template_folder='templates', auth=UserAuth)
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
    return JSONEncoder().encode({"total": len(query_items), "rows": query_items})

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/login.js')
def render_login_js():
    return render_template('login.js')

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", threaded=True)
