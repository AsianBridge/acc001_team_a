// ボタンクリック時の処理
document.getElementById("btn").onclick = function () {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
};

function successCallback(position) {
    var userLatitude = position.coords.latitude;
    var userLongitude = position.coords.longitude;
    document.getElementById("latitude").innerHTML = userLatitude;
    // 経度を取得し画面に表示
    document.getElementById("longitude").innerHTML = userLongitude;
    // グローバル変数からマップ上の緯度経度を取得
    var mapLatitude = window.globalLat;
    var mapLongitude = window.globalLng;

    // 緯度経度が近いかどうかの確認
    if (checkProximity(userLatitude, userLongitude, mapLatitude, mapLongitude)) {
        document.getElementById("proximityResult").innerHTML = "近いです";
    } else {
        document.getElementById("proximityResult").innerHTML = "遠いです";
    }
};

// 取得に失敗した場合の処理
function errorCallback(error) {
    alert("位置情報が取得できませんでした");
};

// 二点間の距離が十分に近いかを確認
function checkProximity(lat1, lng1, lat2, lng2, threshold = 0.001) { // 閾値は適宜調整
    return Math.abs(lat1 - lat2) < threshold && Math.abs(lng1 - lng2) < threshold;
}
