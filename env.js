const env = {
    GOOGLE_MAPS_API_KEY: 'AIzaSyBiHBkYrPgCds4ZjiNOJKYjxl90VzJvVns',
    USER_POOL_ID: 'ap-northeast-1_Ho5QJJZdN',
    CLIENT_ID: '6tj32iijpna53879qpjnikaird',
}
// Google Mapsのスクリプトを動的に挿入する関数
function loadGoogleMapsScript() {
    // 新しい<script>要素を作成
    const script = document.createElement('script');
    script.type = 'text/javascript';

    // APIキーを含むURLを設定
    script.src = `https://maps.googleapis.com/maps/api/js?key=${env.GOOGLE_MAPS_API_KEY}&libraries=places`;

    // 非同期実行のための属性を設定
    script.async = true;
    script.defer = true;

    // <head>内にスクリプトタグを挿入
    document.head.appendChild(script);
}

// ページ読み込み時にスクリプトをロード
document.addEventListener('DOMContentLoaded', loadGoogleMapsScript);