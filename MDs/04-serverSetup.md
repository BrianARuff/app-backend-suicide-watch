# Setup Node/Express Server

1. Install express `npm i express`;
2. Make middleware folder
   - Paste these into folder:
      ```
        const express = require("express");
        const helmet = require("helmet");
        const morgan = require("morgan");
        const cors = require("cors");
      ```
3. Install middleware
    - `npm i helmet`
    - `npm i morgan`
    - `npm i cors`

4. Export your modules as a function that takes a server as its input. You will import(require) the middleware where you are calling `server.use` to apply the middlware to given server. This is just one way to setup middlware of course, but here is a paste that you can use to help you.
  - Paste the following:
    ```
        module.exports = server => {
          server.use(morgan("dev"));
          server.use(cors());
          server.use(express.json());
          server.use(helmet());
      }
    ```