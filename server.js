const path = require("path");
const express = require("express");
const app = require("./public/App.js");

const server = express();

server.use(express.static(path.join(__dirname, "public")));

server.get("*", function (req, res) {
  const { html } = app.render({ url: req.url });

  res.write(`
    <!DOCTYPE html>
    <script src="https://cdn.amplify.aws/packages/core/4.3.0/aws-amplify-core.min.js" integrity="sha384-7Oh+5w0l7XGyYvSqbKi2Q7SA5K640V5nyW2/LEbevDQEV1HMJqJLA1A00z2hu8fJ" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://cdn.amplify.aws/packages/auth/4.3.8/aws-amplify-auth.min.js" integrity="sha384-jfkXCEfYyVmDXYKlgWNwv54xRaZgk14m7sjeb2jLVBtUXCD2p+WU8YZ2mPZ9Xbdw" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <link rel='stylesheet' href='/global.css'>
    <link rel='stylesheet' href='/bundle.css'>
    <body id="body">
    <div id="app">${html}</div>
    </body>
    <script src="/bundle.js"></script>
    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
  `);

  res.end();
});

const port = 8082;
server.listen(port, () => console.log(`Listening on port ${port}`));
