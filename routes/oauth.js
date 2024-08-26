// this 'oauth.js file will be attatched to the app.use('/api/forge', require('./routes/oauth.js')) in start.js file.
//any request coming from our server starting with /api/forge' will be passed to this express router
const express = require("express");
const config = require("../config"); // secured code
const { OAuth } = require("./common/oauth");

let router = express.Router(); //any request coming from our server starting with /api/forge' will be passed to this express router
//this express router will try to process the request according to the following suffixes:
//if the GET request will contain this path : api/forge/callback/oauth this code will try to handle it
router.get("/callback/oauth", async (req, res, next) => {
  const { code } = req.query;
  const oauth = new OAuth(req.session);
  try {
    await oauth.setCode(code); //exchange the code for the token in theautodesk  aouthentication
    res.redirect("/"); //redirect us to the UI of our app (the request would bubble through the stack untill a middlewere will handle it)
  } catch (err) {
    next(err);
  }
});
//if the GET request will contain this path : api/forge/oauth/url this code will try to handle it by REDIRECTING TO THE URL of the authentication
router.get("/oauth/url", (req, res) => {
  const url =
    "https://developer.api.autodesk.com" +
    "/authentication/v2/authorize?response_type=code" +
    "&client_id=" +
    config.credentials.client_id +
    "&redirect_uri=" +
    config.credentials.callback_url +
    "&scope=" +
    config.scopes.internal.join(" "); //list of scopes  that the user will see
  res.end(url); //redurecting the user to this url
});
//if the GET request will contain this path : api/forge/oauth/signout this code will sign out by setting req.session property to null /
//a middlwere is sitting in our stack and looking for a cooklie  that is comming from a web request . if it finds any, the midddlewere will parse and de-cript it,
// and will store the coocike in a session propperty in a request object and pass is down the stack so any other request/ middlewere would be able to access it.

router.get("/oauth/signout", (req, res) => {
  req.session = null;
  res.redirect("/");
});

//if the GET request will contain this path : api/forge/oauth/token' this code will pass the oath token to provide access to forge content

router.get("/oauth/token", async (req, res, next) => {
  const oauth = new OAuth(req.session);
  if (!oauth.isAuthorized()) {
    res.status(401).end();
    return;
  }

  try {
    const accessToken = await oauth.getPublicToken();
    res.json(accessToken);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
