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
    document.getElementById('scoreDisplay').style.display = 'none';
    // ログイン画面を表示する
    document.getElementById('loginScreen').style.display = 'block';
}

function registerUser() {

    var poolData = {
        UserPoolId: 'ap-northeast-1_Ho5QJJZdN', // Your user pool id here
        ClientId: '6tj32iijpna53879qpjnikaird', // Your client id here
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    var username = document.getElementById("email").value;
    var password = document.getElementById("pwd").value;

    userPool.signUp(username, password, null, null, function (
        err,
        result
    ) {
        if (err) {
            alert(err.message || JSON.stringify(err));
            return;
        }
        var cognitoUser = result.user;
        console.log('user name is ' + cognitoUser.getUsername());
        //認証ページに移動
        window.location.href = 'confirm.html';
    });

}

// ログインフォームの送信を扱う
function login() {

    var username = document.getElementById("email").value;
    var password = document.getElementById("pwd").value;

    var authenticationData = {
        Username: username,
        Password: password,
    };

    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
        authenticationData
    );
    var poolData = {
        UserPoolId: 'ap-northeast-1_Ho5QJJZdN', // Your user pool id here
        ClientId: '6tj32iijpna53879qpjnikaird', // Your client id here
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var userData = {
        Username: username,
        Pool: userPool,
    };

    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            var idToken = result.getIdToken().getJwtToken();          // IDトークン
            var accessToken = result.getAccessToken().getJwtToken();  // アクセストークン
            var refreshToken = result.getRefreshToken().getToken();   // 更新トークン

            console.log("idToken : " + idToken);
            console.log("accessToken : " + accessToken);
            console.log("refreshToken : " + refreshToken);

            //POTENTIAL: Region needs to be set if not already set previously elsewhere.
            AWS.config.region = 'ap-northeast-1';

            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: 'ap-northeast-1:6fd8e9d3-1fd1-4d14-8141-510748b72866', // your identity pool id here
                Logins: {
                    // Change the key below according to the specific region your user pool is in.
                    'cognito-idp.ap-northeast-1.amazonaws.com/ap-northeast-1_Ho5QJJZdN': result
                        .getIdToken()
                        .getJwtToken(),
                },
            });

            //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
            AWS.config.credentials.refresh(error => {
                if (error) {
                    console.error(error);
                } else {
                    // Instantiate aws sdk service objects now that the credentials have been updated.
                    // example: var s3 = new AWS.S3();
                    console.log('Successfully logged!');
                    showMainScreen();
                }
            });
        },

        onFailure: function (err) {
            alert(err.message || JSON.stringify(err));
        },
    });
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
    document.getElementById('scoreDisplay').style.display = 'block';
}
