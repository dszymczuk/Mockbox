"use strict";function checkSupport(){var e="MozWebSocket"in window?"MozWebSocket":"WebSocket"in window?"WebSocket":null;return null===e?(Materialize.toast("Your browser doesn't support Websockets! You won't be able to use this service...",1e6,"warning-toast"),!1):!0}function checkNotify(){window.Notification&&Notify.needsPermission&&Notify.requestPermission()}function notifyEmail(e){if(!document.hasFocus()&&$("#sendNotifications").is(":checked")){var s=new Notify(e.from,{icon:"/img/ios-desktop.png",body:e.body,timeout:4});s.show(),unreadEmails+=1,document.title="Mockbox ("+unreadEmails+" new)"}}function showRaw(e){$("#rawArea").text(messages[e].raw),$("#rawModal").openModal()}function getAttachments(e){if(0===messages[e].attachments.length)return"No Attachments";var s=messages[e].attachments.length+" attachment";messages[e].attachments.length>1&&(s+="s"),s+=": ";var o=messages[e].attachments.map(function(e){var s="data:"+e.type+";"+e.transferEncoding+","+e.data;return'<a href="'+s+'" target="_blank">'+e.name+"</a>"}).join(", "),t=s+o;return t}function processDisconnect(e){Materialize.toast("Server connection lost - please refresh",1e6,"warning-toast")}function processMessage(e){if(!addressLoaded){var s=JSON.parse(e.data);return $("#serverAddress, #quickServerAddress").html(host),$("#mailAddress, #quickMailAddress").html(s[0]),$("#serverPort, #quickServerPort").html(s[1]),$("#dropSize, #quickDropSize").html(s[2]/1e3),$("#copyLink, #quickCopyLink").attr("data-clipboard-text",s[0]),void(addressLoaded=!0)}var o=JSON.parse(e.data);messages.push(o);var t=messages.length-1;null===o.body&&(o.body="[no body]",messages.pop(),messages.push(o),t=messages.length-1);var a='<li class="collection-item avatar"><i class="material-icons circle">mail</i><span class="title"><strong>'+escapeHtml(o.subject)+"</strong></span><p>"+escapeHtml(o.from)+" (at "+escapeHtml(o.fromIP[0])+")<br>"+(new Date).toLocaleString()+"<br>"+getAttachments(t)+'</p><a href="#!" onClick="showRaw('+t+');" class="secondary-content" title="View Raw Message"><i class="material-icons">code</i></a><div class="inlineCode">'+escapeHtml(o.body).replace(/(?:\r\n|\r|\n)/g,"<br />")+"</div></li>";$("#noMessages").hide(),$("#messageCollection").prepend(a),notifyEmail(o)}function showDemo(){$.ajax({url:"demo.txt",dataType:"text",success:function(e){var s={};s.data=e,processMessage(s)}})}function clearEmails(){messages=[],$("#noMessages").show(),$("#messageCollection").empty()}var host=window.location.hostname,messages=[],addressLoaded=!1,unreadEmails=0,removeUnread=function(e){unreadEmails=0,document.title="Mockbox"};if(document.body.addEventListener("focus",removeUnread,!0),document.body.onfocusin=removeUnread,window.onbeforeunload=function(e){return messages.length>0?"You will lose access to the contents of this Mockbox and be unable to use this address again.":void 0},"?quick"===location.search&&($("#fullInfo").hide(),$("#quickInfo").show()),checkSupport()){var wsProto="https:"===window.location.protocol?"wss":"ws",mailSocket=new WebSocket(wsProto+"://"+host+":9000");mailSocket.onmessage=processMessage,mailSocket.onclose=processDisconnect;var clipboard=new Clipboard("#copyLink"),quickClipboard=new Clipboard("#quickCopyLink");checkNotify()}