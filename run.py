from eve import Eve
from flask import render_template, render_template_string, request, current_app as app
app = Eve(__name__, template_folder='templates')

@app.route('/test')
def test():
    return render_template('index.html')

@app.route('/test.js')
def test_js():
    return render_template('test.js')

#@app.route('/annotations/annotations')
#def store():
#    return render_template('store.html')

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", threaded=True)
