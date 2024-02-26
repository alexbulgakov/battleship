import * as fs from "fs";
import * as path from "path";
import * as http from "http";

export const httpServer = http.createServer(function (request, response) {
  const __dirname = path.resolve(path.dirname(""));
  const file_path =
    __dirname +
    (request.url === "/" ? "/front/index.html" : "/front" + request.url);

  fs.readFile(file_path, function (err, data) {
    if (err) {
      response.writeHead(404);
      response.end(JSON.stringify(err));
      return;
    }
    response.writeHead(200);
    response.end(data);
  });
});
