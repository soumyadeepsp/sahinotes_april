var accessTokenInput = document.getElementById('accessTokenInput');
var url = window.location.href;
console.log(url);
var accessToken = url.substring(url.indexOf("=")+1, url.length);
console.log(accessToken);
accessTokenInput.value = accessToken;
console.log(accessTokenInput.value);
accessTokenInput.style.display = 'none';