window.onload = function () {
    showLoginScreen(); // ページ読み込み時にログイン画面を表示
};

function showLoginScreen() {
    // 既存の要素を非表示にする
    document.getElementById('map').style.display = 'none';
    document.getElementById('photos').style.display = 'none';
    document.getElementById('latlng').style.display = 'none';
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('txtMargin').style.display = 'none';
    // ログイン画面を表示する
    document.getElementById('loginScreen').style.display = 'block';
}

function registerUser() {
    // メールアドレスを取得
    var email = document.getElementById('email').value;
    // パスワードを取得
    var password = document.getElementById('pwd').value;
  
    // メールアドレスとパスワードをalertで表示
    alert("メールアドレス: " + email + "\nパスワード: " + password);
    saveUserToLocalStorage(email, password);
  
    // ユーザー登録の処理（ダミー）
    showMainScreen();
}

// ログインフォームの送信を扱う
document.getElementById('loginForm').onsubmit = function (event) {
    event.preventDefault(); // フォームの送信を阻止
    // ログイン処理（ダミー）
    showMainScreen();
};

function saveUserToLocalStorage(email, password) {
    // ユーザー情報をオブジェクトとして作成
    var user = {
      email: email,
      password: password
    };
  
    // ユーザー情報をJSON形式に変換
    var userJson = JSON.stringify(user);
    console.log(userJson)
  
    // ローカルストレージにユーザー情報を保存
    localStorage.setItem('user', userJson);
}

function showMainScreen() {
    // ログイン画面を非表示にする
    document.getElementById('loginScreen').style.display = 'none';

    // 元々のページの要素を表示する
    document.getElementById('map').style.display = 'block';
    document.getElementById('photos').style.display = 'block';
    document.getElementById('latlng').style.display = 'block';
    document.getElementById('startButton').style.display = 'block';
    document.getElementById('txtMargin').style.display = 'block';
}
