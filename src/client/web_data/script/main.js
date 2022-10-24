var user_address = null;
var program_address = null;
var latest_transaction_address = null;
var user_token = null;
var last_user_token = 0;

function main() {
  update_UI();

  // Refresh UI at every 2 seconds
  setInterval(async () => {
    await update_UI();
  }, 2000);
}

async function update_UI() {
  // User address
  user_address = await httpGet(window.location.origin + '/get_user_address');
  $('#user_address').text(user_address.value);

  // Program address
  program_address = await httpGet(window.location.origin + '/get_program_address');
  $('#program_address').text(program_address.value);

  // User balance
  let user_balance = await httpGet(window.location.origin + '/get_user_balance');
  $('#user_balance').text(user_balance.value);

  // Program balance
  let program_balance = await httpGet(window.location.origin + '/get_program_balance');
  $('#program_balance').text(program_balance.value);

  // User token
  user_token = await httpGet(window.location.origin + '/get_user_token');
  $('#user_token').text(user_token.value);

  // Program token
  let program_token = await httpGet(window.location.origin + '/get_program_token');
  $('#program_token').text(program_token.value);
}

async function httpGet(theUrl) {
  let resp = await makeRequest("GET", theUrl);
  return JSON.parse(resp);
}

function makeRequest(method, url) {
  return new Promise(function (resolve, reject) {
      let xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.onload = function () {
          if (this.status >= 200 && this.status < 300) {
              resolve(xhr.response);
          } else {
              reject({
                  status: this.status,
                  statusText: xhr.statusText
              });
          }
      };
      xhr.onerror = function () {
          reject({
              status: this.status,
              statusText: xhr.statusText
          });
      };
      xhr.send();
  });
}

async function swap_sol_to_token() {
  disable_all_button();
  save_last_user_token();

  latest_transaction_address = await httpGet(window.location.origin + '/swap_sol_to_token?amount=1');

  check_user_token_update();
}

async function swap_token_to_sol() {
  disable_all_button();
  save_last_user_token();

  latest_transaction_address = await httpGet(window.location.origin + '/swap_token_to_sol?amount=10');

  check_user_token_update();
}

function save_last_user_token() {
  last_user_token = 0;
  if (user_token != null) {
    last_user_token = user_token.value;
  }
}

function check_user_token_update() {
  setTimeout(() => {
    if (user_token.value != last_user_token) {
      enable_all_button();
    } else {
      check_user_token_update();
    }
  }, 1000);
}

function disable_all_button() {
  $("#btn_sol_to_token").attr("class","btn btn-secondary mt-2 disabled");
  $("#btn_token_to_sol").attr("class","btn btn-secondary mt-2 disabled");
}

function enable_all_button() {
  $("#btn_sol_to_token").attr("class","btn btn-success mt-2");
  $("#btn_token_to_sol").attr("class","btn btn-success mt-2");
  update_latest_transaction();
}

function update_latest_transaction() {
  $('#latest_transaction_address').text(latest_transaction_address.value);
}

function go_to_user_address() {
  window.open("https://explorer.solana.com/address/" + user_address.value + "?cluster=devnet");
}

function go_to_program_address() {
  window.open("https://explorer.solana.com/address/" + program_address.value + "?cluster=devnet");
}

function go_to_latest_transaction() {
  window.open("https://explorer.solana.com/tx/" + latest_transaction_address.value + "?cluster=devnet");
}