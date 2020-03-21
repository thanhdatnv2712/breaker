// ==UserScript==
// @author       datnvt2712
// @name         breaker
// @namespace    http://tampermonkey.net/datnvt2712
// @version      0.1
// @description  try to take over the world!
// @match        *://*/*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @updateURL https://github.com/thanhdatnv2712/breaker/raw/master/tampermonkey.user.js
// @license MIT
// ==/UserScript==

// You are verified
// Click verify once there are none left.
// jQuery(".rc-imageselect-instructions div div strong").length

var idxs_box = "None";
var image_url = "None";
var label = "None";
var rows = 0;
var columns = 0;

function getCurrentURL() {
    return window.location.href;
}

function checkExists_reCaptcha(class_name) {
    var keyword = "div." + class_name;
    // 'div.recaptcha-checkbox-checkmark'
    var status = $(keyword).length;
    return status;
}

function click_image(row, col){
    $("tr:nth-child(" + row +")" + " td:nth-child(" + col + ")").click();
}

function convert_strtolist(s) {
    var res = s.split(' ');
    for (var i = 0; i < res.length; i++)
        res[i] = parseInt(res[i]) + 1;
    return res;
}

async function request_Server(data){
    const Url = 'http://127.0.0.1:8000/breaker';
    const Data = data;
    var res = "fduidhiuafhsdiufh";
    let promise = new Promise((resolve, reject) => {
        $.ajax({
            url: Url,
            type: "POST",
            data: Data,
            success: function(result) {
                if (result != "not found") {
                    res = convert_strtolist(result);
                    for (var i = 0; i < res.length; i++) {
                        var row = parseInt(res[i]/columns + 1);
                        var col = parseInt(res[i]%columns == 0 ? columns : res[i]%columns);
                        console.log(row + " " + col);
                        click_image(row, col);
                    }
                    $(".verify-button-holder button").click();
                }
                console.log("Done");
                resolve(res);
            },
            error: function(error) {
                console.log(`ERROR ${error}`);
            }
        });
    });

    return res;
}

function get_RC(){
    rows = $("tbody").children().length;
    columns = $("tr").children().length/rows;
    image_url = $("td div div img").attr('src');
    label = $(".rc-imageselect-instructions div div strong").html();
    console.log("Done to get Infomation");
}

function request_json() {
    return {
        "url": image_url,
        "label": label,
        "rows": rows,
        "columns": columns
    };
}

(function() {
    'use strict';

    // Your code here...
    var current_url = getCurrentURL();
    // auto click to Image Verification
    var recaptcha_checkbox = 'recaptcha-checkbox-checkmark';
    var label_dynamic = 'rc-imageselect-desc-no-canonical';
    var label_static = 'rc-imageselect-desc';
    var reCaptcha = false;

    setTimeout(function(){
        if (checkExists_reCaptcha('recaptcha-checkbox-checkmark')) {
            document.documentElement.getElementsByClassName('recaptcha-checkbox-checkmark')[0].click();
            reCaptcha = true;
        }
    }, 2000);

    setTimeout(function(){
        if (checkExists_reCaptcha(label_dynamic)) {
            console.log('dong');
            get_RC();
            var data = request_json();
            data = JSON.stringify(data);
            var res = request_Server(data, function(val){console.log(val); return val;});
            console.log(res);
        }
        else if (checkExists_reCaptcha(label_static)) {
            console.log('tinh');
            get_RC();
            var data = request_json();
            data = JSON.stringify(data);
            var res = request_Server(data, function(val){console.log(val); return val;});
            console.log(res);
        }
    }, 4500);
    // alert(ans);
    // document.documentElement.getElementsByClassName('recaptcha-checkbox-checkmark')[0].click();
})();
