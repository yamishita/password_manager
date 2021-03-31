def get_target_id(url,domain):
    '''
    識別できるIDもしくはNAME属性を抽出
    '''
    import re
    import sys
    import requests
    from bs4 import BeautifulSoup as soup

    # ループアドレス
    if domain.split(':')[0] == 'localhost':
        print('scrayping my page...', file=sys.stderr)
        ids = dict()
        ids['username_id'] = 'username'
        ids['password_id'] = 'password'
        return tuple(list(ids.items())) 

    result = requests.get(url,verify=False)
    html = result.text
    doc = soup(html,'html.parser')
    username_input = doc.find_all('input', type=re.compile('(text|email)') )
    password_input = doc.find_all('input', type='password')

    username_regex = re.compile(r'.*(email|username).*')
    password_regex = re.compile(r'.*pa?s?s?wo?r?d.*')
    ids = dict()
    for elem in username_input:
        enm = elem.get('name')
        eid = elem.get('id')
        if re.search(username_regex, eid):
            ids['username_id']=eid
        elif re.search(username_regex, enm):
            ids['username_name']=enm
    for elem in password_input:
        enm = elem.get('name')
        eid = elem.get('id')
        if re.search(password_regex, eid):
            ids['password_id']=eid
        elif re.search(password_regex, enm):
            ids['password_name']=enm
    return tuple(list(ids.items()))
