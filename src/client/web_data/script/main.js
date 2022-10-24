
function main() {
  update_UI();

  // Refresh UI at every 5 seconds
  setInterval(async () => {
    await update_UI();
  }, 5000);
}

async function update_UI() {
  // User address
  let user_address = await httpGet(window.location.origin + '/get_user_address');
  $('#user_address').text(user_address.value);

  // Program address
  let program_address = await httpGet(window.location.origin + '/get_program_address');
  $('#program_address').text(program_address.value);

  // User balance
  let user_balance = await httpGet(window.location.origin + '/get_user_balance');
  $('#user_balance').text(user_balance.value);

  // Program balance
  let program_balance = await httpGet(window.location.origin + '/get_program_balance');
  $('#program_balance').text(program_balance.value);

  // User token
  let user_token = await httpGet(window.location.origin + '/get_user_token');
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
  let program_token = await httpGet(window.location.origin + '/swap_sol_to_token?amount=1');
  setTimeout(enable_all_button, 5000);
}

async function swap_token_to_sol() {
  disable_all_button();
  let program_token = await httpGet(window.location.origin + '/swap_token_to_sol?amount=10');
  setTimeout(enable_all_button, 5000);
}

function disable_all_button() {
  $("#btn_sol_to_token").attr("class","btn btn-secondary mt-2 disabled");
  $("#btn_token_to_sol").attr("class","btn btn-secondary mt-2 disabled");
}

function enable_all_button() {
  $("#btn_sol_to_token").attr("class","btn btn-success mt-2");
  $("#btn_token_to_sol").attr("class","btn btn-success mt-2");
}