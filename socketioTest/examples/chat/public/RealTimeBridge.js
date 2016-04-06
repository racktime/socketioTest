define(["dojo/_base/declare"], function(declare) {
	return declare("main.pubSub.RealTimeBridge", null, {
		username : window._userNm_,
		reqObj:null,
		socket : io(pubSubUrl),

		constructor : function(callBack, scope) {
			var me = this;
			window._callBack_ = callBack;
			window._scope_ = scope;
			me.socket.emit('add user', me.username);
			me.socket.on('new message', function(data) {
				if (data.realTimeData) {
					window._callBack_.apply(window._scope_, [data.realTimeData, data.updateTime]);
				}
				me.sessionKeep();
			});
			
			me.socket.on('connect', function () {
				var obj = {
					realInfo : me.reqObj
				}
				$.post(proxyUrl + "?"+ initPubSubUrl + "/getData", obj, function(data) {
					window._callBack_.apply(window._scope_, [data.realTimeData, data.updateTime]);
					me.socket.emit('add user', me.username);
					me.socket.emit('new message', me.reqObj);
				}, "json").error(function(err) {
				});
		    });
		  
		    me.socket.on('disconnect', function () {
		        //console.log('disconnect');
		    });
		},

		reqInfoReg : function(reqObj, id) {
			var me = this;
			me.reqObj = reqObj;
			var obj = {
				realInfo : reqObj
			}
			$.post(proxyUrl + "?"+ initPubSubUrl + "/getData", obj, function(data) {
				window._callBack_.apply(window._scope_, [data.realTimeData, data.updateTime, id]);
				me.socket.emit('new message', reqObj)
			}, "json").error(function(err) {
			});
			me.sessionKeep();
		},

		sessionKeep : function() {
			$.post(meUrl + "/sessionKeep.aspx", {}, function(data) {
			}, "text").error(function(err) {
			});
		}
	});
});

