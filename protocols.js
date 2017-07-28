(function(exports){
    class Protocol{
        constructor(webSocket){
            const Factory = new Events.Factory();
            this.addEventListener = this.addListener = this.on = Factory.addEventListener;
            this.removeEventListener = this.removeListener = Factory.removeEventListener;
            this.dispatchEvent = this.emit = Factory.dispatchEvent;

            this.WebSocket = websocket;
            this.WebSocket.addEventListener('message', this.handleMessage.bind(this));
            this.WebSocket.addEventListener('close', this.handleClose.bind(this));
        }
        handleMessage(event){
            const message = (typeof event.data === 'undefined' ? event : event.data);
            const messageType = (typeof message === 'string' ? 'textmessage' : 'binarymessage');
            this.dispatchEvent(messageType, event);
        }
        handleClose(event){
            delete this;
        }
    }
    class JsonProtocol extends Protocol{
        constructor(){
            super();
            this.addEventListener('textmessage', this.handleTextMessage.bind(this));
        }
        handleTextMessage(event){
            var json = JSON.parse(event.data);

            if(json){
                event.details.data = json;
                this.dispatchEvent('jsonmessage', event);
            }
        }
        sendJson(object){
            this.WebSocket.send(JSON.stringify(object));
        }
    }
    exports.Protocol = Protocol;
    exports.JsonProtocol = JsonProtocol;
})(typeof exports === 'undefined'? this['Protocols']={}: exports);