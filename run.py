from eve import Eve
from flask import redirect, render_template, g, render_template_string, request, current_app as app
import json
from flask import jsonify
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from datetime import datetime
from eve.auth import BasicAuth, requires_auth
import bcrypt

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

def post_annotation(docs):
    for doc in docs:
        doc['id'] = str(doc['_id'])
        f = {'_id': doc['_id']}
        app.data.driver.db['annotations'].update(f, doc)


app = Eve(__name__, template_folder='templates', auth=UserAuth)

app.on_inserted_annotations += post_annotation
app.on_insert_accounts += create_user

@app.route('/test')
@requires_auth('annotations')
def test():
    print (g.user)
    return render_template('index.html')

@app.route('/script')
@requires_auth('annotations')
def script():
    return render_template('script.html');

@app.route('/test.js')
def test_js():
    return render_template('test.js')

@app.route('/annotations/search')
@requires_auth('annotations')
def search_annotation():
    params = dict(request.args.items())
    uri = params['uri']
    lookup = {'uri': uri}
    annotations = app.data.driver.db['annotations']
    query_results = annotations.find(lookup)
    query_items = []
    # annotations.delete_many(lookup)

    user_id = app.auth.get_request_auth_value()
    lookup = {'_id': user_id}
    accounts = app.data.driver.db['accounts']
    user = accounts.find_one(lookup)
    user_name = user['userid']
    for result in query_results:
        if user_name in result['permissions']['read']:
            query_items.append(result)
    return JSONEncoder().encode({"total": len(query_items), "rows": query_items})

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/login.js')
def render_login_js():
    return render_template('login.js')

@app.route('/getcurrentuser')
@requires_auth('annotations')
def get_current_user():
    user_id = app.auth.get_request_auth_value()
    lookup = {'_id': user_id}
    accounts = app.data.driver.db['accounts']
    user = accounts.find_one(lookup)
    return json.dumps(user['userid'])

@app.route('/getallusers')
def get_all_users():
    accounts = app.data.driver.db['accounts'].find()
    users = []
    for account in accounts:
        users.append(account['userid'])
    return json.dumps(users)

@app.route('/categories.js')
def get_tags_js():
    return render_template('categories.js')

@app.route('/categories.css')
def get_tags_css():
    return app.send_static_file('categories.css')

@app.route('/manipulateText.js')
def get_manipulateText_js():
    return render_template('manipulateText.js')

@app.route('/userTags.js')
def get_usertags_js():
    return render_template('userTags.js')


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", threaded=True)
