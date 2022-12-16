import websocket
import time
import threading
import json

class StreamingCommunication:
    def __init__(self):
        self.isInitialized = False

    def initialize(self):
        self.isInitialized = True
        
        websocket.enableTrace(True)
        self.ws = websocket.WebSocketApp(
            "ws://localhost:8080/", on_message=on_message, on_error=on_error, on_close=on_close)
        
        t = threading.Thread(target=self.ws.run_forever)
        t.daemon = True
        t.start()

    def send_objects(self, objects):
        print(objects)
        self.ws.send(json.dumps(objects))


def on_message(ws, message):
    print(message)


def on_error(ws, error):
    print(error)


def on_close(ws):
    print("### closed ###")
