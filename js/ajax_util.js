var TjAjaxUtil ={
    requests:{
        defaultNotReadyFn:function(x){
            //console.log("xhr.readyState:"+x.readyState+",xhr.status:"+x.status+",xhr.responseText:"+x.responseText);
        },
        post:function(rest,data,callbackFn,notReadyFn,asysn){
            var xhr = new XMLHttpRequest();
            asysn=asysn?false:true;
            if(!notReadyFn)notReadyFn=this.defaultNotReadyFn;
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    resp = xhr.responseText;
                    callbackFn(resp)
                } else {
                    notReadyFn(xhr);
                }
                return false;

            }
            xhr.timeout = 360000;
            xhr.open('post', rest, asysn);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('AccessToken','DDIHNZJZL5RW5G7GSPJGSJFGWDSFRV4ZYK4YE42WHTC657LAR5DA1108a2d');
            if(typeof (data)=="object"){
                xhr.send(JSON.stringify(data));
            }else if(typeof (data)=="string"){
                xhr.send(data);
            }else{
                xhr.send(null);
            }


        },

        postWithHeaders:function(rest,data,callbackFn,headers){
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    resp = xhr.responseText;
                    callbackFn(resp)
                }
                return false;

            }
            xhr.open('post', rest, false);
            xhr.setRequestHeader('Content-Type', 'application/json');
            for(var k in headers){
                xhr.setRequestHeader(k, headers[k]);
            }

            if(typeof (data)=="object"){
                xhr.send(JSON.stringify(data));
            }else if(typeof (data)=="string"){
                xhr.send(data);
            }else{
                xhr.send(null);
            }


        },
        get:function(rest,data,callbackFn,notReadyFn,asysn){
            var xhr = new XMLHttpRequest();
            asysn=asysn?true:false;
            if(!notReadyFn)notReadyFn=this.defaultNotReadyFn;
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    resp = xhr.responseText;
                    callbackFn(resp)
                } else {
                    notReadyFn(xhr);
                }
                return false;

            }
            xhr.open('get', rest, asysn);
            if(typeof (data)=="object"){
                xhr.send(JSON.stringify(data));
            }else if(typeof (data)=="string"){
                xhr.send(data);
            }else{
                xhr.send(null);
            }
        },
        postForm:function(rest,data,callbackFn,notReadyFn,asysn){
            var xhr = new XMLHttpRequest();
            asysn=asysn?true:false;
            if(!notReadyFn)notReadyFn=this.defaultNotReadyFn;
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    resp = xhr.responseText;
                    callbackFn(resp)
                } else {
                    notReadyFn(xhr);
                }
                return false;

            }
            xhr.open('post', rest, asysn);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            if(typeof (data)=="object"){
                xhr.send(JSON.stringify(data));
            }else if(typeof (data)=="string"){
                xhr.send(data);
            }else{
                xhr.send(null);
            }
        }
    }
}