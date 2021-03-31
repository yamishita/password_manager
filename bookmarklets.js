// Javascript for bookmarklets

/* ---------------------------------------------------------------------------------- */
// for master authentication 
javascript:(function(){
    var master_pass = prompt('Password:');
    if(master_pass == ''){
        alert('Input Password !');
        return;
    }
    var current_url = location.href;
    // extracting domain
    var domain = current_url.split('/')[2];
    var formdata = new FormData();
    formdata.append('password',master_pass);
    formdata.append('location',domain);

    var xhr = new XMLHttpRequest();

    // データが正常に送信された場合に行うことを定義します
    xhr.addEventListener('load', function(event) {
      var authdata = JSON.parse(xhr.responseText);
      if (authdata['response'] == 'not resisted') {
          alert('Not Resisted');
          return false;
      }
      if (authdata['response'] == 'failed to login') {
          alert('Incorrect Master Password');
          return false;
      }
      // prefer regex
      var user = document.getElementById(authdata['username_id']);
      var pass = document.getElementById(authdata['password_id']);
      user.value = authdata["username"];
      pass.value = authdata["password"];
    });

    // エラーが発生した場合に行うことを定義します
    xhr.addEventListener('error', function(event) {
    alert('Oups! Something goes wrong.');
    });

    xhr.open('POST','https://localhost:8000/auth');
    xhr.send(formdata);
})();

/* ---------------------------------------------------------------------------------- */
// for generating password
// 新しいタブを開く方
// 発表時までのやつ
javascript:(function(){
    var url = 'https://localhost:8000/gen-pass-form';
    var features = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes,width=600,height=800,modal=yes";
    var child = window.open(url,"Generate Password",features);
    if (child == null) {
        alert('Already Exists')
    }
    //var child = window.showModalDialog(url,window);
})();


/* ---------------------------------------------------------------------------------- */
// for generating password
// 新しくタブを開かない方
// モーダルウインドウで開発中
javascript:(function(){
    var xhr = new XMLHttpRequest();
    // データが正常に送信された場合に行うことを定義します
    xhr.addEventListener('load', function(event) {
        dom = xhr.responseXML; //resister_modal.html
        /* create and add DOM */
        var script = dom.getElementById('post-script');
        var modal_window = dom.getElementById('modal-p01');
        //var linkToCss = "https://localhost:8000/gen-pass-form.css";
        //var link_elm = document.createElement('link');
        //link_elm.href = linkToCss;
        //link_elm.type = 'text/css';
        //link_elm.rel = 'stylesheet';
        //document.head.appendChild(link_elm);

        var script_elm = document.createElement('script');
        script_elm.innerHTML = script.innerHTML;
        document.head.appendChild(script_elm);
        
        var modal_window_elm = document.createElement('section');
        modal_window_elm.innerHTML = modal_window.innerHTML;
        modal_window_elm.class = "modal-window";
        modal_window_elm.id = "modal-p01";
        document.body.appendChild(modal_window_elm);

        //var ancker = document.createElement('a'); 
        //ancker.innerHTML = "add";
        //ancker.href = "#modal-p01";
        //document.body.appendChild(ancker);
        //var submit_btn = dom.getElementById('submit_btn');
    });
    // エラーが発生した場合に行うことを定義します
    xhr.addEventListener('error', function(event) {
    alert('Oups! Something goes wrong.');
    });
    xhr.open('GET','https://localhost:8000/modal_test');
    xhr.responseType = "document";
    xhr.send(null);
})();

/* ---------------------------------------------------------------------------------- */
// for sending test
javascript:(function(){
    var xhr = new XMLHttpRequest();
    // データが正常に送信された場合に行うことを定義します
    xhr.addEventListener('load', function(event) {
      alert(xhr.responseText);
    });
    // エラーが発生した場合に行うことを定義します
    xhr.addEventListener('error', function(event) {
    alert('Oups! Something goes wrong.');
    });
    xhr.open('GET','https://localhost:8000/echo/kitsune');
})();

/* ---------------------------------------------------------------------------------- */
// for viewing pass 
javascript:(function(){if(typeof this.tgt==='undefined')this.tgt=document.querySelectorAll('input[type="password"]');var nit=(this.tgt.item(0).getAttribute('type')=='password')?'text':'password';for(var i=0;i<this.tgt.length;i++)this.tgt.item(i).setAttribute('type',nit);})();
