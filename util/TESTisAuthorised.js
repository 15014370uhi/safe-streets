const jwt = require ('jsonwebtoken');

function isAuthorised (req, res, next) {
  /////////////////////TEST
  // Get user ID from cookie
  const rawCookie = req.header ('cookie').split ('=');
  const token = rawCookie[1];
  let payload; // Declare variable to hold payload

  // if cookie not set, return unauthorized error
  if (!rawCookie) {
    console.log ('No token found');
    return res.status (401).end ();
  } else {
    try {
      payload = jwt.verify (token, process.env.JWTSECRET);
      res.json(verified);
      next();
      return
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        //JWT unauthorized return 401 error
        return res.status (401).end ();
      }
      // Otherwise, return bad request error
      return res.status (400).end ();
    }
  }

  // try {
  //   const token = req.cookies.token;
  //   if (!token) return res.status(401).json({ errorMessage: "Unauthorized" });

  //   const verified = jwt.verify(token, process.env.JWT_SECRET);
  //   req.user = verified.user;

  //   next();
  // } catch (err) {
  //   console.error(err);
  //   res.status(401).json({ errorMessage: "Unauthorized" });
  // }
}

module.exports = isAuthorised;
