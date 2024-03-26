// Google MapsとStreet Viewを使用して金沢市のランダムな位置にピンを設置し、
// ピンをクリックするとその場所のストリートビュー画像を表示する

var map;
var totalScore = 0;
const radius = 100;// ストリートビュー検索の半径
const pinNumbers = 10;//ピンの数
// マップの初期化とランダムなピンの設置
function initMap() {
    // 金沢市の緯度経度情報
    const kanazawa = { lat: 36.561325, lng: 136.656205 };

    // Google Mapsのインスタンスを作成し、#mapのdivに表示
    map = new google.maps.Map(document.getElementById('map'), {
        center: kanazawa,
        zoom: 12
    });

    // ストリートビューサービスのインスタンスを作成

    // 金沢市の中心からランダムな位置に10個のピンを設置
    for (var i = 0; i < pinNumbers; i++) {
        const randomLocation = getRandomLocation(kanazawa, 5000);
        checkStreetViewAvailability(randomLocation, radius, function (isAvailable, location) {
            if (isAvailable) {
                // ストリートビューが利用可能な場所にのみピンを設置
                const marker = new google.maps.Marker({
                    position: location,
                    map: map
                });

                // ピンをクリックした時にストリートビュー画像を取得し表示
                marker.addListener('click', function () {
                    fetchPhotos(marker.getPosition());
                    // ここでマーカーの位置を取得して表示
                    const lat = marker.getPosition().lat(); // 緯度を取得
                    const lng = marker.getPosition().lng(); // 経度を取得
                    window.globalLat = lat; // マーカーの緯度のグローバル変数
                    window.globalLng = lng; // マーカーの経度のグローバル変数
                    document.getElementById('latitudemap').textContent = lat; // 緯度を表示
                    document.getElementById('longitudemap').textContent = lng; // 経度を表示
                    console.log("Latitude:", lat, "Longitude:", lng); // コンソールに表示
                });
            }
        });
    }
}

// ランダムな位置にストリートビューが利用可能か確認
function checkStreetViewAvailability(location, radius, callback) {
    const streetViewService = new google.maps.StreetViewService();
    streetViewService.getPanorama({ location: location, radius: radius }, function (data, status) {
        if (status === google.maps.StreetViewStatus.OK) {
            callback(true, location); // ストリートビューが見つかった場合
        } else {
            callback(false, location); // ストリートビューが見つからない場合
        }
    });
}

// 金沢市の指定された中心からランダムな位置を生成
function getRandomLocation(center, radius) {
    const y0 = center.lat;
    const x0 = center.lng;
    const rd = radius / 111300; // 約111300メートルで1度
    const u = Math.random();
    const v = Math.random();
    const w = rd * Math.sqrt(u);
    const t = 2 * Math.PI * v;
    const x = w * Math.cos(t);
    const y1 = w * Math.sin(t);

    const x1 = x / Math.cos(y0);

    return { lat: y0 + y1, lng: x0 + x1 };
}

// ストリートビュー画像を取得し、表示する
function fetchPhotos(location) {
    const photosDiv = document.getElementById('photos');
    photosDiv.innerHTML = ''; // 以前の画像をクリア

    const streetViewService = new google.maps.StreetViewService();
    streetViewService.getPanorama({ location: location, radius: radius }, function (data, status) {
        if (status === google.maps.StreetViewStatus.OK) {
            // ストリートビューが見つかった場合、そのパノラマIDを使って画像を表示
            const panoramaId = data.location.pano;
            const photoUrl = `https://maps.googleapis.com/maps/api/streetview?size=200x200&pano=${panoramaId}&key=AIzaSyBiHBkYrPgCds4ZjiNOJKYjxl90VzJvVns`;
            const img = document.createElement('img');
            img.className = 'photo';
            img.src = photoUrl;
            photosDiv.appendChild(img);

            // 「Google Mapsで見る」ボタンを追加
            viewInGoogleMaps(location);
            // 「カメラを起動する」ボタンを追加
            activateCamera();
            // 「現在の位置をチェックする」ボタンを追加
            currentPositionCheck();
        } else {
            // ストリートビューが見つからない場合の処理
            photosDiv.innerHTML = 'この場所のストリートビューは利用できません。';
        }
    });
}

function viewInGoogleMaps(location) {
    const photosDiv = document.getElementById('photos');
    // 「Google Mapsで見る」ボタンを生成
    const viewInMapsButton = document.createElement('button');
    viewInMapsButton.textContent = 'Google Mapで見る';
    viewInMapsButton.className = 'btn btn-success';
    photosDiv.appendChild(viewInMapsButton);

    // ボタンクリックでGoogle Mapsの経路案内ページに遷移
    viewInMapsButton.addEventListener('click', function () {
        const destination = location.lat() + ',' + location.lng();
        const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
        window.open(directionsUrl, '_blank');
    });
}
function activateCamera() {
    const photosDiv = document.getElementById('photos');
    // 「カメラを起動する」ボタンを生成
    const cameraButton = document.createElement('button');
    cameraButton.textContent = 'カメラを起動する';
    cameraButton.className = 'btn btn-success';
    photosDiv.appendChild(cameraButton);

    // ボタンクリックでカメラを起動
    cameraButton.addEventListener('click', function () {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(function (stream) {
                    var video = document.createElement('video');
                    video.autoplay = true;
                    video.srcObject = stream;
                    video.style.width = '100%';

                    // 既存のコンテンツをクリアせず、ビデオ要素を追加
                    photosDiv.appendChild(video);

                    // 「写真を撮る」ボタンを生成
                    const takePhotoButton = document.createElement('button');
                    takePhotoButton.textContent = '写真を撮る';
                    takePhotoButton.className = 'btn btn-primary';
                    photosDiv.appendChild(takePhotoButton);

                    // 写真を撮るボタンのクリックイベント
                    takePhotoButton.addEventListener('click', function () {
                        const canvas = document.createElement('canvas');
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        const context = canvas.getContext('2d');
                        // ビデオの現在のフレームをキャプチャ
                        context.drawImage(video, 0, 0, canvas.width, canvas.height);
                        const image_url2 = canvas.toDataURL('image/jpeg');



                        // canvasを画像として保存するための追加処理

                        // キャプチャした画像を表示
                        photosDiv.appendChild(canvas);

                        // オプション: ストリームを停止する
                        stream.getTracks().forEach(track => track.stop());
                        // ビデオとボタンを隠すまたは削除
                        video.style.display = 'none';
                        takePhotoButton.style.display = 'none';
                        fetch('http://127.0.0.1:5000', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ image_url1: photoUrl, image_url2 }),
                        })
                            .then(response => response.json())
                            .then(data => {
                                console.log("類似度スコア:", data.similarity_score);
                                // ここで類似度スコアが13より小さいかをチェック
                                if (data.similarity_score < 13) {
                                    // スコアを100点追加する
                                    console.log("類似度スコアが13より低かったのでスコアに100点を追加します。");
                                    updateScore(totalScore + 100); // スコアを更新する
                                } else {
                                    console.log("類似度スコアが高すぎます。");
                                }
                            }).catch((error) => {
                                console.error('Error:', error);
                            });
                    });
                })
                .catch(function (error) {
                    console.log("カメラのアクセスに失敗しました。", error);
                });
        } else {
            alert("お使いのブラウザではカメラ機能がサポートされていません。");
        }
    });
}
function currentPositionCheck() {
    const photosDiv = document.getElementById('photos');
    const checkLocationButton = document.createElement('button');
    checkLocationButton.textContent = '現在の位置をチェック';
    checkLocationButton.className = 'btn btn-outline-primary btn-lg';
    checkLocationButton.id = 'checkLocationButton'; // ボタンにIDを設定
    photosDiv.appendChild(checkLocationButton);
    checkLocationButton.onclick = function () {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    };
}
function updateScore(newScore) {
    totalScore = newScore; // totalScore変数を更新
    document.getElementById('score').textContent = totalScore; // HTMLの表示を更新
}

// ピンを設置してスタンプラリーを開始する関数
function startStampRally() {
    // 「STARTする」ボタンを非表示にする
    document.getElementById('startButton').style.display = 'none';

    // ピンを設置する処理を開始する
    initMap(); // initMap関数を呼び出して、ピンの設置を開始する
}

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
