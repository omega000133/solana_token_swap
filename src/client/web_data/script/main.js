
function main() {
  update_UI();

  // Refresh UI at every 5 seconds
  setInterval(update_UI, 5000);
}

function update_UI() {
  // User address
  let user_address = httpGet(window.location.origin + '/get_user_address');
  $('#user_address').text(user_address.value);

  // User balance
  let user_balance = httpGet(window.location.origin + '/get_user_balance');
  $('#user_balance').text(user_balance.value);

  // User token
  let user_token = httpGet(window.location.origin + '/get_user_token');
  $('#user_token').text(user_token.value);

  // Program balance
  let program_address = httpGet(window.location.origin + '/get_program_address');
  $('#program_address').text(program_address.value);

  // Program balance
  let program_balance = httpGet(window.location.origin + '/get_program_balance');
  $('#program_balance').text(program_balance.value);

  // Program token
  let program_token = httpGet(window.location.origin + '/get_program_token');
  $('#program_token').text(program_token.value);
}

function httpGet(theUrl) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
  xmlHttp.send( null );
  return JSON.parse(xmlHttp.responseText);
}

function swap_sol_to_token() {
  let program_token = httpGet(window.location.origin + '/swap_sol_to_token?amount=1');
}

function swap_token_to_sol() {
  let program_token = httpGet(window.location.origin + '/swap_token_to_sol?amount=10');
}