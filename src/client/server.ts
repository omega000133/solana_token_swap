
import { createServer, IncomingMessage, ServerResponse } from 'http';
import * as fs from 'fs';

const port = 8080;
const web_data_path = 'src/client/web_data';

export function start_server() {
  const server = createServer((request: IncomingMessage, response: ServerResponse) => {
    console.log("request.url = ", request.url);

    // index.html
    if (request.url == '/') {
      response.statusCode = 200;
      send_file_from_folder(web_data_path + '/templates/index.html', response);
    }
    // Route group: libraries
    else if (request.url?.indexOf('/libraries/') == 0) {
      response.statusCode = 200;
      send_file_from_folder(web_data_path + request.url, response);
    }
    // Bad Request
    else {
      send_file_from_folder(web_data_path + '/templates/bad_request_404.html', response);
    }
  });

  server.listen(port, () => {
    console.log("Server is running at:", "http://localhost:" + port.toString());
  });
}

function send_file_from_folder(file_path: string, response: ServerResponse) {
  fs.readFile(file_path, (err: NodeJS.ErrnoException | null, data: Buffer) => {
    response.end(data);
  });
}
