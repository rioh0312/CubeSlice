"use strict"
class Timer {

    constructor(limit, listeners) {
        this.timer = '';
        this.time = 0;
        this.isRunning = false;
        this.limit = limit
        this.listeners = listeners;
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.loop();
        }
    }

    loop() {
        if (this.isRunning) {
            var that = this;
            this.time += 1;
            if(this.time > this.limit) {
                this.stop();
                return;
            }
            this.timer = setTimeout(function () { that.loop() }, 1000);
            this.fireEventListeners();
        }
    }

    stop() {
        if (this.isRunning) {
            this.isRunning = false;
            clearTimeout(this.timer);
        }
    }

    setTime(time) {
        this.time = time;
        this.fireEventListeners();
    }

    fireEventListeners() {
        if (this.listeners) {
            for (var i = 0; i < this.listeners.length; i++) {
                this.listeners[i](this.time);
            }
        }
    }
}
