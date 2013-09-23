window.onload = function(){

    var timerIntervalId;
    var tasks = [];

    var deleteTask = function(deleteButton) {
        var task = deleteButton.parentNode;
        clearInterval(timerIntervalId);
        task.remove();
    }

    var incrementTimer = function(timeButton, task, initialTime, startTime) {
        var elapsedTime = new Date();
        var elapsedTimeValue = timeButton.previousSibling.firstChild;
        elapsedTime = Date.now() - startTime + initialTime;

        // Update the tasks variable.
        tasks[task] = elapsedTime;

        var hours = 0;
        var mins = 0;
        var secs = 0;
        if (elapsedTime > 999) {
            secs = elapsedTime / 1000;
            if (secs > 59) {
                mins = secs / 60;
                secs = secs % 60;
                if (mins > 59) {
                    hours = mins / 50;
                    mins = mins % 60;
                }
            }
        }

        var time = ('0' + parseInt(hours)).slice(-2) + ":" + ('0' + parseInt(mins)).slice(-2) + ":" + ('0' + parseInt(secs)).slice(-2);
        elapsedTimeValue.nodeValue = time;
    }

    // Event when start button is clicked.
    var controlTime = function(timeButton, task) {
        var initialTime = tasks[task];
        var elapsedTime;
        if (timeButton.innerHTML == 'START') {
            var timeButtons = document.getElementsByClassName("control-time");
            var startTimer = true;
            for (var i=0; timeButtons[i]; i++) {
                if (timeButtons[i].innerHTML == 'STOP') {
                    startTimer = false;
                    break;
                }
            }
            if (startTimer == true) {
                timeButton.innerHTML = 'STOP';
                // Initiate the start time.
                var startTime = new Date();
                timerIntervalId = setInterval(function(){incrementTimer(timeButton, task, initialTime, startTime);}, 1000);

            }
            else {
                alert(" You can't start a new task as another one is ongoing ");
            }
        }
        else {
            // Stop the clock and reset it.
            clearInterval(timerIntervalId);
            timeButton.innerHTML = 'START';
        }
    }

    var isTaskValid = function(newTask) {
        if (newTask) {
            for (var task in tasks) {
                if (task == newTask) {
                    alert("You have a duplicate task, please enter a new task.");
                    return false;
                }
            }
            return true;
        }
        else {
            alert(" Please enter a task. ");
            return false;
        }
    }

    var addTask = function() {
        var newTask = document.getElementById("new-task").value;

        if (isTaskValid(newTask)) {
            var ul = document.getElementById("tasks");
            // Create a list element for the new task.
            var li = document.createElement("li");
            var deleteButton = document.createElement("button");
            deleteButton.className = "delete-task";
            deleteButton.innerHTML = 'x';
            deleteButton.onclick = function(){deleteTask(this);};
            li.appendChild(deleteButton);
            var taskName = document.createTextNode(newTask);
            li.appendChild(taskName);
            var elapsedTime = document.createElement("span");
            elapsedTime.className = "elapsed-time";
            elapsedTime.appendChild(document.createTextNode('00:00:00'));
            li.appendChild(elapsedTime);
            var timeButton = document.createElement("button");
            timeButton.className = "control-time";
            timeButton.innerHTML = 'START';
            timeButton.onclick = function(){controlTime(this, newTask);};
            li.appendChild(timeButton);
            // Append the li element to the list of tasks.
            ul.appendChild(li);

            // Add that task to the tasks variable.
            tasks[newTask] = 0;
        }
        // Clear the task input.
        document.getElementById("new-task").value = null;
    }

    document.getElementById("add-task").onclick = function() {addTask();};
};