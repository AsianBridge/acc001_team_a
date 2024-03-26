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
    // ユーザー登録の処理（ダミー）
    alert("ユーザー登録の処理をここに実装");
}

// ログインフォームの送信を扱う
document.getElementById('loginForm').onsubmit = function (event) {
    event.preventDefault(); // フォームの送信を阻止
    // ログイン処理（ダミー）
    alert("ログイン処理をここに実装");
};

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