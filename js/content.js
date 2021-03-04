window.addEventListener("load", myMain, false);
var orders = [];
function getHtml(token) {
    /**/
    var l = document.getElementsByTagName("script").length;
    var url = document.URL;
    if (url.indexOf("http://yangkeduo.com/orders.html") == -1) return;
    if (url.indexOf("login.html") != -1) {
        alert("尊敬的用户,需要您登录");
        throw new Error("login");
        return;
    }
    var orderMsg;
    for (var i = 0; i < l; i++) {
        var html = document.getElementsByTagName("script")[i].innerHTML;
        html = html.trim();
        var keyword = "window.rawData=";
        var pos = html.indexOf(keyword)
        if (pos != -1) {
            pos += keyword.length;
            html = html.substring(pos, html.length - 1);
            var info = formatOrders(html);
            orders = info.orders;
            if (orders && orders.length > 0) {
                orderMsg = info;
                break;
            }
        }

    }
    forPage(orderMsg, token);

}

function getCookies(url) {
    chrome.runtime.sendMessage({url: url}, function (response) {
        if (response == "pdd") {
            alert("请刷新页面");
            return
        } ;
        deal(response);
    });
}

function deal(token) {
    try {
        getHtml(token);
    } catch (err) {
        console.log(err);
    }
}

function myMain(evt) {
    var reffer = getQueryVariable("mt");
    if (reffer <= 0) return;
    console.log("document ready to work!");
    getCookies(document.URL);
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return -999;
}


function formatDate(orderTime) {
    var time = new Date(orderTime * 1000)
    var year = time.getFullYear()
    var month = time.getMonth() + 1
    var date = time.getDate()
    var hours = time.getHours()
    var minute = time.getMinutes()
    var second = time.getSeconds()

    if (month < 10) {
        month = '0' + month
    }
    if (date < 10) {
        date = '0' + date
    }
    if (hours < 10) {
        hours = '0' + hours
    }
    if (minute < 10) {
        minute = '0' + minute
    }
    if (second < 10) {
        second = '0' + second
    }
    return year + '-' + month + '-' + date + ' ' + hours + ':' + minute + ':' + second
}

function trim(str) { //删除左右两端的空格
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

function getJsData(content) {
    var start = content.indexOf('{"ordersStore"')
    if (start == -1) return null;
    var m = 'window.leo'
    var end = content.indexOf(m)
    if (end == -1) return null;
    var info = content.substring(start, end);
    info = trim(info)
    info = info.substring(0, info.length - 1);
    var rawData = JSON.parse(info);
    return rawData["ordersStore"];
}

function formatOrders(content) {
    var rawData = getJsData(content);
    if (!rawData) return null;
    var arr = rawData["orders"];
    if (arr.length == 0) return null;
    var page_id = getQueryVariable("refer_page_id");
    var result = {pageId: page_id}
    var orders = [];
    for (var i = 0; i < arr.length; i++) {
        var orderInfo = arr[i];
        var orderSn = orderInfo["orderSn"];
        var orderAmount = orderInfo["orderAmount"];
        var orderTime = orderInfo["orderTime"];
        var orderStatus = orderInfo["orderStatus"];
        var payStatus = orderInfo["payStatus"];
        var orderLinkUrl = orderInfo["orderLinkUrl"];
        var orderStatusPrompt = orderInfo["orderStatusPrompt"];
        var goodsName = orderInfo["orderGoods"][0]["goodsName"];
        var groupTime = "";
        if ("groupOrder" in orderInfo) {
            groupTime = formatDate(orderInfo["groupOrder"]["successTime"])
        }
        const orderTimeStr = formatDate(orderTime);
        var order = {
            orderSn: orderSn,
            orderAmount: orderAmount,
            orderTime: orderTime,
            orderTimeStr: orderTimeStr,
            orderStatus: orderStatus,
            payStatus: payStatus,
            orderLinkUrl: orderLinkUrl,
            orderStatusPrompt: orderStatusPrompt,
            goodsName: goodsName,
            orderDay: orderTimeStr.substring(0, 10),
            groupTime: groupTime

        }
        orders.push(order);
    }
    result["orders"] = orders;
    var appIDSet = rawData["appIDSet"];
    if (appIDSet) {
        var ret = [];
        for (var k in appIDSet) {
            ret.push(appIDSet[k] + "")
        }
        result["pay_channel_list"] = ret;
    }
    result["offset"] = rawData["ordersService"]["offset"]["0"];
    result["pdduid"] = rawData["uid"];
    return result
}

function forPage(info, token) {
    info["cookie"] = token;
    info["reffer"] = document.URL;
    info["page"] = getQueryVariable("mt");
    exportOut(JSON.stringify(info))
}

function exportOut(txt) {
    var uri = "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(txt);
    var link = document.createElement("a");
    link.href = uri;
    link.download = "data.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

}

