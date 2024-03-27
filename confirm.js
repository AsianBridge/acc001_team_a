function OnCognitoConfirmRegistration() {

	var poolData = {
		UserPoolId: 'ap-northeast-1_Ho5QJJZdN', // Your user pool id here
		ClientId: '6tj32iijpna53879qpjnikaird', // Your client id here
	};
	var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

	var username = document.getElementById("email").value;
	var code = document.getElementById("ConfirmCode").value;

	var userData = {
		Username: username,
		Pool: userPool,
	};

	var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
	cognitoUser.confirmRegistration(code, true, function(err, result) {
		if (err) {
			alert(err.message || JSON.stringify(err));
			return;
		}else{
            console.log("confirm successed")
            window.location.href = 'index.html';
        }
		console.log('call result: ' + result);
	});
}
