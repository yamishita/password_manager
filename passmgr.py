import sys
import json
import ssl
from flask import Flask, request, render_template
from flask_cors import CORS

#context = SSL.Context(SSL.SSLv23_METHOD)
#context.use_privatekey_file('yourserver.key')
#context.use_certificate_file('yourserver.crt')
app = Flask(__name__,static_folder='.',static_url_path='')
CORS(app)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/test-login', methods=['POST'])
def login ():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        jsonfile = open('auth.json','r')
        auth_data = json.load(jsonfile)
        target = auth_data['localhost:8000']
        jsonfile.close()
        if username == target['username'] and password == target['password']:
            return render_template('mypage.html')
        return render_template('index.html')

@app.route('/auth', methods=['POST'])
def authentication():
    '''
    master authentication
    '''
    #from Crypto.Cipher import AES
    if request.method == 'POST':
        location = request.form['location']; # expected the login page
        m_password = request.form['password'] # master password

        jsonfile = open('auth.json','r')
        auth_data = json.load(jsonfile)
        master = auth_data['master']

        if m_password != master['password']:
            jsonfile.close()
            return '{"response":"failed to login"}'

        if location not in auth_data.keys():
            jsonfile.close()
            print('failed',file=sys.stderr)
            return '{"response":"not resisted"}'

        target = auth_data[location] 
        #複合
        #secret_key = master['secret']
        #crypto = AES.new(secret_key)
        #password = crypto.encrypt(target['password']) #服号化
        target['response'] = 'success'
        jsonfile.close()
        print('returning response data ...',file=sys.stderr)
        return json.dumps(target) 

@app.route('/gen-pass',methods=['POST'])
def gen_pass ():
    import scraping
    import genPassModule
    from Crypto.Cipher import AES

    #set generating paramaters from form
    username = request.form['username']
    url      = request.form['url']
    max_s = str(request.form['Max'])
    flags = ''
    if str(request.form['Upper']) == 'true':
        flags += 'u'
    if str(request.form['Lower']) == 'true':
        flags += 'l'
    if str(request.form['Symbol']) == 'true':
        flags += 's'
    if str(request.form['Number']) == 'true':
        flags += 'n'
    symbols = '_-'

    domain = url.split('/')[2]

    jsonfile = open('auth.json','r')
    authdata = json.load(jsonfile)
    # 新規
    if domain in authdata.keys():
        jsonfile.close();
        return '{"response":"exists"}'

    ids = dict(scraping.get_target_id(url,domain))#BSでスクレイピング
    print('Scrayping Result:',ids, file=sys.stderr)

    # using Python C/API
    # call C-program generationg pw
    print('generating pw ...', file=sys.stderr)
    password = genPassModule.genPassword(max_s,flags,symbols);

    # cypher using AES
    # master = authdata['master'] 
    # secret_key = master['secret']#secret key
    # crypto = AES.new(secret_key)
    # crypto_pass = crypto.encrypt(password) #暗号化

    ids['username'] = username
    ids['password'] = password
    jsonfile.close()

    #jsonファイルに登録(domain,username_id,password_id,username,password)
    print('saving authenticate data ...', file=sys.stderr)
    authdata[domain] = ids
    jsonfile = open('auth.json','w')
    json.dump(authdata, jsonfile, indent=2)

    #レスポンス
    ids['response'] = 'success'
    print('returning response data ...',file=sys.stderr)
    return json.dumps(ids) 

@app.route('/gen-pass-form')
def gen_pass_form ():
    return render_template('resister.html')

@app.route('/modal_test')
def modal_test ():
    return render_template('resister_modal.html')

@app.route('/gen-pass-form.css')
def modal_css ():
    return app.send_static_file('gen-pass-form.css')

#app.run(port=8000, debug=True)
#app.run(host='127.0.0.1',port=8000, debug = True, ssl_context=context)
app.run(port=8000,debug=True,ssl_context='adhoc')

