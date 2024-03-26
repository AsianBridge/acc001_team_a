// Google MapsとStreet Viewを使用して金沢市のランダムな位置にピンを設置し、
// ピンをクリックするとその場所のストリートビュー画像を表示する

var map;

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
            const viewInMapsButton = document.createElement('button');
            viewInMapsButton.textContent = 'Google Mapで見る';
            viewInMapsButton.className = 'btn btn-success';
            photosDiv.appendChild(viewInMapsButton);
            const CameraButton = document.createElement('button');
            CameraButton.textContent = 'カメラを起動する';
            CameraButton.className = 'btn btn-success';
            photosDiv.appendChild(CameraButton);
            const lat = location.lat(); // 正しく緯度を取得
            const lng = location.lng(); // 正しく経度を取得
            const destination = lat + ',' + lng;
            // ボタンクリックでGoogle Mapsの経路案内ページに遷移
            viewInMapsButton.addEventListener('click', function () {
                const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
                window.open(directionsUrl, '_blank');
            });
            CameraButton.addEventListener('click', function () {
                // メディアデバイス（カメラ）へのアクセスを試みる
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    // カメラのビデオストリームを要求する
                    navigator.mediaDevices.getUserMedia({ video: true })
                        .then(function (stream) {
                            // ストリームを取得した後の処理
                            // 例: ビデオ要素にストリームを設定して再生する
                            var video = document.createElement('video');
                            video.autoplay = true; // 自動再生
                            video.srcObject = stream;
                            video.style.width = '100%'; // ビデオのサイズを設定

                            // 既存のコンテンツをクリアし、ビデオ要素を追加
                            photosDiv.innerHTML = '';
                            photosDiv.appendChild(video);
                        })
                        .catch(function (error) {
                            // エラー発生時の処理
                            console.log("カメラのアクセスに失敗しました。", error);
                        });
                } else {
                    alert("お使いのブラウザではカメラ機能がサポートされていません。");
                }
            });

        } else {
            // ストリートビューが見つからない場合の処理
            photosDiv.innerHTML = 'この場所のストリートビューは利用できません。';
        }
    });
}

// ピンを設置してスタンプラリーを開始する関数
function startStampRally() {
    // 「STARTする」ボタンを非表示にする
    document.getElementById('startButton').style.display = 'none';

    // ピンを設置する処理を開始する
    initMap(); // initMap関数を呼び出して、ピンの設置を開始する
}
