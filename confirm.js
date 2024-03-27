function OnCognitoConfirmRegistration() {

	var poolData = {
		UserPoolId: env.USER_POOL_ID, // Your user pool id here
		ClientId: env.CLIENT_ID, // Your client id here
	};
	var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

	var username = document.getElementById("email").value;
	var code = document.getElementById("ConfirmCode").value;

	var userData = {
		Username: username,
		Pool: userPool,
	};

	var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
	cognitoUser.confirmRegistration(code, true, function (err, result) {
		if (err) {
			alert(err.message || JSON.stringify(err));
			return;
		} else {
			console.log("confirm successed")
			window.location.href = 'index.html';
		}
		console.log('call result: ' + result);
	});
}
