const jwt = require("jsonwebtoken");
const { config } = require("../config/secrets");

exports.auth = (req,res,next) => {
  let token = req.header("x-api-key");
  if(!token){
    return res.status(401).json({msg:"You must send token in the header to this endpoint"})
  }
  try{
    // Checks if the token is valid or under attack
    let decodeToken = jwt.verify(token,config.token_secret);
    // req -> will be the same in all the functions connected to the same router
    req.tokenData = decodeToken;
    // Move to the next function in the chain
    next();
  }
  catch(err){
    return res.status(401).json({msg:"Token invalid or expired"})
  }
}

// auth for admin only
exports.authAdmin = (req,res,next) => {
  let token = req.header("x-api-key");
  if(!token){
    return res.status(401).json({msg:"You must send token in the header to this endpoint"})
  }
  try{
    // Checks if the token is valid or under attack
    let decodeToken = jwt.verify(token,config.token_secret);
    if(decodeToken.role != "admin"){
      return res.status(401).json({msg:"Just admin can be in this endpoint"})
    }
     // req -> will be the same in all the functions connected to the same router
    req.tokenData = decodeToken;
   // Move to the next function in the chain
    next();
  }
  catch(err){
    return res.status(401).json({msg:"Token invalid or expired"})
  }
}