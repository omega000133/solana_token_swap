
function main() {
    // User balance
    let user_address = httpGet(window.location.origin + '/get_user_address');
    $('#user_address').text(user_address.value);

    // User balance
    let user_balance = httpGet(window.location.origin + '/get_user_balance');
    $('#user_balance').text(user_balance.value);

    // User token
    let user_token = httpGet(window.location.origin + '/get_user_token');
    $('#user_token').text(user_token.value);

    // User balance
    let program_address = httpGet(window.location.origin + '/get_program_address');
    $('#program_address').text(program_address.value);

    // User balance
    let program_balance = httpGet(window.location.origin + '/get_program_balance');
    $('#program_balance').text(program_balance.value);

    // User token
    let program_token = httpGet(window.location.origin + '/get_program_token');
    $('#program_token').text(program_token.value);
}

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return JSON.parse(xmlHttp.responseText);
}