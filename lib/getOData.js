//var http = require("http");
var OData = require('datajs');

var serviceRoot = "http://nav.bsecamp.net:7448/BSE-LIVE7446/OData/Company('VAT TEST')/BSEVATCompanyList?format=json";

getURL(serviceRoot);

function getURL(url) {
/*
    var body = "X";
    http.get(url, function (response) {
        response.on('data', function (chunk) {
            body+=chunk;
        });
        response.on('end', function () {
            console.log(body);
        });

    }).on('error', function(e) {
        console.log("ERROR: " + e.message);
    });
*/
    var request = {
        requestUri : serviceRoot,
        method : 'GET',
        user : 'Administrator',
        password : 'aocnf100djr!'
    };

    OData.request(request, function (data,res){
        console.log(data);
    });
}