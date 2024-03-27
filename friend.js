
$(document).ready(function () {
    // フレンドリストを表示するイベント
    $("a.nav-link:contains('フレンドリスト')").click(function () {
        $("#friendListModal").modal('show');
    });

    // フレンド追加モーダルを表示するイベント
    $("a.nav-link:contains('フレンドを追加する')").click(function () {
        $("#addFriendModal").modal('show');
    });

    // フレンドリクエスト確認モーダルを表示するイベント
    $("a.nav-link:contains('フレンドリクエスト')").click(function () {
        $("#friendRequestModal").modal('show');
    });

    // フレンドリクエストを送る処理（ダミー）
    $("#sendFriendRequest").click(function () {
        var friendId = $("#friendIdInput").val();
        console.log("フレンドリクエストを送る: " + friendId);
        // ここにフレンドリクエストを送信するコードを実装
    });
});

