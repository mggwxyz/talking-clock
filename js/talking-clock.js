
var TalkingClock = (function(){

    'use strict';

    var Word = function(text){
        this.text = text;
        this.status = false;
    };

    var data = {
        date: new Date(),
        words: {
            it: new Word("It"),
            is: new Word("is"),
            fiveMin: new Word("five"),
            tenMin: new Word("ten"),
            quarter: new Word("quarter"),
            half: new Word("half"),
            to: new Word("to"),
            past: new Word("past"),
            one: new Word("one"),
            two: new Word("two"),
            three: new Word("three"),
            four: new Word("four"),
            five: new Word("five"),
            six: new Word("six"),
            seven: new Word("seven"),
            eight: new Word("eight"),
            nine: new Word("nine"),
            ten: new Word("ten"),
            eleven: new Word("eleven"),
            twelve: new Word("twelve"),
            oclock: new Word("o'clock"),
            am: new Word("AM"),
            pm: new Word("PM")
        },
        minuteWords: {
            fiveMin: new Word("five"),
            tenMin: new Word("ten"),
            quarter: new Word("quarter"),
            half: new Word("half")
        }
    };

    var controller = {
        start: function(){
            this.setClock();
            view.init();
        },
        setClock: function(){
            for (var word in data.words) {
                data.words[word].status = false;
            }
            this.setVerbiage();
            this.setMinutes();
            this.setHours();
            this.setMeridian();
        },
        setVerbiage: function(){
            var minutes = data.date.getMinutes();
            data.words.it.status = true;
            data.words.is.status = true;
            data.words.oclock.status = true;
            if ( (minutes >= 3) && ( minutes <= 38)){
                data.words.past.status = true;
            } else if ( (minutes >= 39) && (minutes <= 57)){
                data.words.to.status = true;
            }
        },
        setMinutes: function(number){
            var minutes = data.date.getMinutes();
            if ( ((3 <= minutes) && (minutes <= 7)) || ((minutes >= 53) && (minutes <= 57))) {
                data.words.fiveMin.status = true;
            } else if (((8 <= minutes) && (minutes <= 12)) || ((minutes >= 48) && (minutes <= 52))) {
                data.words.tenMin.status = true;
            } else if (((13 <= minutes) && (minutes <= 23)) || ((minutes >= 39) && (minutes <= 47))) {
                data.words.quarter.status = true;
            } else if ((24 <= minutes) && (minutes <= 38)) {
                data.words.half.status = true;
            }
        },
        setHours: function(){
            var hours = data.date.getHours();
            var hoursArray = [
                "twelve",
                "one",
                "two",
                "three",
                "four",
                "five",
                "six",
                "seven",
                "eight",
                "nine",
                "ten",
                "eleven",
                "twelve"
            ];
            if (data.words.to.status){
                data.words[hoursArray[(hours % 12) + 1]].status = true;
            } else {
                data.words[hoursArray[(hours % 12)]].status = true;
            }
        },
        setMeridian: function(){
            var hours = data.date.getHours();
            if( (hours / 12) >= 1 ){
                data.words.pm.status = true;
            } else {
                data.words.am.status = true;
            }
        },
        getWords: function(){
            return data.words;
        },
        update: function(){
            console.log("Web clock updating...");
            var newDate = new Date();
            if (newDate.getMinutes() != data.date.getMinutes()){
                data.date = newDate;
                this.setClock();
                view.render();
            }
        },
        sayTime: function() {
            var words = this.getWords();
            var sentence = "";
            for (var word in words) {
                if (words[word].status) {
                    sentence += " " + words[word].text;
                }
            }
            var msg = new SpeechSynthesisUtterance(sentence);
            window.speechSynthesis.speak(msg);
        }
    };

    var view = {
        init: function(){
            document.addEventListener('click', function(){
                controller.sayTime();
            });
            var words = controller.getWords();
            for (var word in words) {
                var container = document.getElementById('wordList');
                var node = document.createElement('LI');
                var textNode = document.createTextNode(words[word].text);
                node.id = word;
                if (words[word].status) node.className = "on";
                node.appendChild(textNode);
                container.appendChild(node);
            }
        },
        render: function(){
            var words = controller.getWords();
            for (var word in words) {
                var node = document.getElementById(word);
                if(words[word].status){
                    node.className = "on";
                } else {
                    node.className = "";
                }
            }
        }
    };

    controller.start();
    const update = controller.update.bind(controller);

    setInterval(update, 1000);

})();


