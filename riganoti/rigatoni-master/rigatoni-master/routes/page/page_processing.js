var Request = require("request");
var parseString = require("xml2js").parseString;
var urlencode = require("urlencode");

exports.login = function(req, res) {
  res.render("login");
};
exports.manage = function(req, res) {
  res.render("manage");
};
exports.submit = function(req, res) {
  res.render("submit");
};
exports.ai = function(req, res) {
  var text = req.param("text");
  text = urlencode(text);
  //아담 ai api 발급 (http://adams.ai)
  var query = "***" + text;

  var options = {
    url: query
  };
  Request.get(options, (error, response, body) => {
    res.json({ result: body });
  });
};

// 여기서만 작업할듯?
exports.main = function(req, res) {
  Request.get(
  //전기 자동차 충전소 api 발급 (data.go.kr)
    "***",
    (error, response, body) => {
      if (error) {
        return console.dir(error);
      }
      var cleanedString = body.replace("\ufeff", "");
      parseString(cleanedString, function(err, result) {
        sResult = result.response.body[0].items[0];
        // for(let i = 0; i < 3; i++) {
        // 	sResult += "<p>" + JSON.stringify(result.response.body[0].items[0].item[i]) + "</p>" + "\n";
        // }\
        res.render("main", { data: sResult });
      });
    }
  );
};
