/* JavaScript */
function post_pass_data(){
    //親:ログインウインドウ,子:パスワード生成ウインドウ
    var parentWindow = window.opener; 

    function _alive_Parent_Window() {
        // メインウィンドウの存在をチェック
        if(!parentWindow || parentWindow.closed){
            // 存在しない場合は警告ダイアログを表示
            alert('メインウィンドウがありません');
            return false;
        }
        return true;
    }

    if (!_alive_Parent_Window()){
        return false;
    }

    var username = document.getElementById("username");
    if (username.value == '') {
        alert('Username must be filled');
        return false;
    }

    //get form values
    var formdata = new FormData();
    formdata.append('username',username.value);
    formdata.append('parent_domain',parentWindow.location.href.split('/')[2]);
    formdata.append('parent_url',parentWindow.location.href);
    //その他フォームデータ
    formdata.append('Upper',String(document.getElementById("Upper").checked));
    formdata.append('Lower',String(document.getElementById("Lower").checked));
    formdata.append('Symbol',String(document.getElementById("Symbol").checked));
    formdata.append('Number',String(document.getElementById("Number").checked));
    formdata.append('Max',String(document.getElementById('max').value));

    var xhr = new XMLHttpRequest();
    // データが正常に送信された場合に行うことを定義します
    xhr.addEventListener('load', function(event) {
        var authdata = JSON.parse(xhr.responseText);
        if (authdata['response'] == 'exists') {
            alert("Already Exists");
            window.close(); //
            return false;
        }
        if (!_alive_Parent_Window()){
            window.close(); //
            return false;
        }
        // set login parameters to the parentWindow
        //var user = parentWindow.document.getElementById(authdata['username_id']);
        //var pswd = parentWindow.document.getElementById(authdata['password_id']);
        var user = parentWindow.document.getElementById('username');
        var pswd = parentWindow.document.getElementById('password');
        user.value = authdata['username'];
        pswd.value = authdata['password'];
        window.close();
    });
    // エラーが発生した場合に行うことを定義します
    xhr.addEventListener('error', function(event) {
        alert('Oups! Something goes wrong.');
    });

    xhr.open('POST','https://localhost:8000/gen-pass');
    xhr.send(formdata);
}

document.addEventListener('keypress', function(event) {
    if (event.keyCode === 13) {
        post_pass_data();
    }
});
