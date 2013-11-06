window.onload = function(){

    var timerIntervalId;
    var tasks = [];

    var supportsHtml5Storage = function () {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            alert(" HTML5 storage is not supported ");
        }
    }

    var deleteErrorMessage = function () {
        document.getElementById("error-message").textContent = '';
    }

    var displayErrorMessage = function (message) {
        document.getElementById("error-message").textContent = message;
    }

    var isNoTaskStarted = function () {
        var timeButtons = document.getElementsByClassName("control-time");
        var isStarted = true;
        for (var i=0; timeButtons[i]; i++) {
            if (timeButtons[i].innerHTML == 'STOP') {
                isStarted = false;
                break;
            }
        }
        return isStarted;
    }

    var convertToClockTime = function (time) {
        var hours = 0;
        var mins = 0;
        var secs = 0;
        if (time > 999) {
            secs = time / 1000;
            if (secs > 59) {
                mins = secs / 60;
                secs = secs % 60;
                if (mins > 59) {
                    hours = mins / 50;
                    mins = mins % 60;
                }
            }
        }
        var clockTime = ('0' + parseInt(hours)).slice(-2) + ":" + ('0' + parseInt(mins)).slice(-2) + ":" + ('0' + parseInt(secs)).slice(-2);
        return clockTime;
    }

    var createListItem = function(newTask, time) {
        time = typeof time == 'undefined'? 0 : time;
        // Create a list element for the new task.
        var li = document.createElement("li");
        var deleteButton = document.createElement("button");
        deleteButton.className = "delete-task";
        deleteButton.innerHTML = 'x';
        deleteButton.onclick = function(){deleteTask(this);};
        li.appendChild(deleteButton);
        var taskName = document.createElement("div");
        taskName.className = "task-name";
        taskName.innerHTML = newTask;
        li.appendChild(taskName);
        var timeButton = document.createElement("button");
        timeButton.className = "control-time";
        timeButton.innerHTML = 'START';
        timeButton.onclick = function(){controlTime(this, newTask);};

        if (time == 0 && isNoTaskStarted() == false) {
            timeButton.disabled = true;
        }

        li.appendChild(timeButton);
        var elapsedTime = document.createElement("span");
        elapsedTime.className = "elapsed-time";
        // figure out what clock time is
        var clockTime = convertToClockTime(time);
        elapsedTime.appendChild(document.createTextNode(clockTime));
        li.appendChild(elapsedTime);
        return li;
    }

    var restoreList = function() {
        if (supportsHtml5Storage()) {
            if (localStorage.length > 0) {
                var ul = document.getElementById("tasks");
                for (key in localStorage) {
                  ul.appendChild(createListItem(key, parseInt(localStorage[key])));
                  tasks[key] = parseInt(localStorage[key]);
                }
            }
        }
    }

    var setListItem = function (key, value) {
        if (supportsHtml5Storage()) {
            localStorage[key] = value;
        }
    }

    var deleteListItem = function (key) {
        if (supportsHtml5Storage()) {
            localStorage.removeItem(key);
        }
    }

    var deleteTask = function(deleteButton) {
        var task = deleteButton.parentNode;
        var taskName = deleteButton.nextSibling.firstChild.nodeValue;
        clearInterval(timerIntervalId);
        deleteListItem(taskName);
        delete tasks[taskName];
        task.remove();
    }

    var incrementTimer = function(timeButton, task, initialTime, startTime) {
        var elapsedTime = new Date();
        var elapsedTimeValue = timeButton.nextSibling.firstChild;
        //elapsedTime = Date.now() - startTime + initialTime; // initialTime is the problem
        elapsedTime = Date.now() - startTime + initialTime;
        tasks[task] = elapsedTime;
        setListItem(task, elapsedTime);
        elapsedTimeValue.nodeValue = convertToClockTime(elapsedTime);
    }

    // Disable/Enable all other buttons when a task has started/stopped.
    var disableButtons = function(disabledStatus) {
        var buttons = document.getElementsByClassName("control-time");
        if (buttons) {
            for (var i = 0; i < buttons.length; i++) {
                if (buttons[i].innerHTML == 'START') {
                    buttons[i].disabled = disabledStatus;
                }
            }
        }
    }

    // Event when start button is clicked.
    var controlTime = function(timeButton, task) {
        var initialTime = tasks[task];
        var elapsedTime;
        if (timeButton.innerHTML == 'START') {
            if (isNoTaskStarted() == true) {
                timeButton.innerHTML = 'STOP';
                disableButtons(true);

                // Initiate the start time.
                var startTime = new Date();
                timerIntervalId = setInterval(function(){incrementTimer(timeButton, task, initialTime, startTime);}, 1000);
            }
        }
        else {
            // Stop the clock and reset it.
            clearInterval(timerIntervalId);
            disableButtons(false);
            timeButton.innerHTML = 'START';
        }
    }

    var isTaskValid = function(newTask) {
        if (newTask) {
            for (var task in tasks) {
                if (task == newTask) {
                    displayErrorMessage("You have a duplicate task, please enter a new task.");
                    return false;
                }
            }
            return true;
        }
        else {
            displayErrorMessage(" Please enter a task. ");
            return false;
        }
    }

    var addTask = function() {
        deleteErrorMessage();
        var newTask = document.getElementById("new-task").value;

        if (isTaskValid(newTask)) {
            var ul = document.getElementById("tasks");
            ul.appendChild(createListItem(newTask));
            tasks[newTask] = 0;
            setListItem(newTask, 0);
        }
        // Clear the task input.
        document.getElementById("new-task").value = null;
    }

    restoreList();
    document.getElementById("add-task").onclick = function() {addTask();};

};
