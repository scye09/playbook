from eve import Eve
from flask import redirect, render_template, render_template_string, request, current_app as app
import json
from flask import jsonify
from flask_pymongo import PyMongo
import requests

app = Eve(__name__, template_folder='templates')
# mongo = PyMongo(app)

@app.route('/test')
def test():
    return render_template('index.html')

@app.route('/test.js')
def test_js():
    return render_template('test.js')

@app.route('/annotations/search')
def search_annotation():
    # database = mongo.db.eve
    # if database:
    #     print('dabase not empty')
    # params = dict(request.args.items())
    # print(params['uri'])
    # url='/annotations?where={"uri": "http://localhost:5000/test"}'
    output = []
    # for s in database.find({'uri': params['uri']}):
    #     output.append(s)
    # print(len(output))
    response = requests.get('http://localhost:5000/annotations?where={"uri": "http://localhost:5000/test"}')
    text = response.json()
    print(text['_items'])
    items = text['_items']
    return jsonify({"total": len(items), "rows": items})

#@app.route('/annotations/annotations')
#def store():
#    return render_template('store.html')

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", threaded=True)
