class Queue {
    constructor() {
        this.items = [];
    }

    enqueue(element) {
        this.items.push(element);
    }

    dequeue() {
        if (this.isEmpty()) return null;
        return this.items.shift();
    }

    front() {
        if (this.isEmpty()) return null;
        return this.items[0];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }

    clear() {
        this.items = [];
    }

    toArray() {
        return [...this.items];
    }
}

class Stack {
    constructor() {
        this.items = [];
    }

    push(element) {
        this.items.push(element);
    }

    pop() {
        if (this.isEmpty()) return null;
        return this.items.pop();
    }

    peek() {
        if (this.isEmpty()) return null;
        return this.items[this.items.length - 1];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }

    clear() {
        this.items = [];
    }
}

class PriorityQueue {
    constructor() {
        this.items = [];
    }

    enqueue(element, priority) {
        const queueElement = { element, priority };
        let added = false;

        for (let i = 0; i < this.items.length; i++) {
            if (queueElement.priority < this.items[i].priority) {
                this.items.splice(i, 0, queueElement);
                added = true;
                break;
            }
        }

        if (!added) {
            this.items.push(queueElement);
        }
    }

    dequeue() {
        if (this.isEmpty()) return null;
        return this.items.shift().element;
    }

    front() {
        if (this.isEmpty()) return null;
        return this.items[0].element;
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }

    clear() {
        this.items = [];
    }

    toArray() {
        return this.items.map(item => item.element);
    }
}

class Process {
    constructor(name, arrivalTime, burstTime, priority = 5) {
        this.name = name;
        this.arrivalTime = arrivalTime;
        this.burstTime = burstTime;
        this.originalBurstTime = burstTime;
        this.priority = priority;
        this.completionTime = 0;
        this.turnaroundTime = 0;
        this.waitingTime = 0;
        this.responseTime = 0;
        this.firstResponseTime = -1;
        this.status = 'ready';
    }

    reset() {
        this.burstTime = this.originalBurstTime;
        this.completionTime = 0;
        this.turnaroundTime = 0;
        this.waitingTime = 0;
        this.responseTime = 0;
        this.firstResponseTime = -1;
        this.status = 'ready';
    }
}

class Scheduler {
    constructor() {
        this.processes = [];
        this.currentTime = 0;
        this.ganttChart = [];
        this.completedProcesses = [];
        this.readyQueue = new Queue();
        this.isRunning = false;
        this.isPaused = false;
        this.currentAlgorithm = 'fcfs';
        this.timeQuantum = 2;
        this.simulationSpeed = 1000;
        this.simulationInterval = null;
    }

    addProcess(name, arrivalTime, burstTime, priority) {
        const process = new Process(name, arrivalTime, burstTime, priority);
        this.processes.push(process);
        this.updateProcessTable();
        this.showToast(`Process ${name} added successfully!`, 'success');
    }

    removeProcess(index) {
        this.processes.splice(index, 1);
        this.updateProcessTable();
        this.showToast('Process removed successfully!', 'info');
    }

    reset() {
        this.processes.forEach(process => process.reset());
        this.currentTime = 0;
        this.ganttChart = [];
        this.completedProcesses = [];
        this.readyQueue.clear();
        this.isRunning = false;
        this.isPaused = false;
        this.updateProcessTable();
        this.updateGanttChart();
        this.updateStatistics();
        this.updateResultsTable();
        this.showToast('Simulation reset successfully!', 'info');
    }

    start() {
        if (this.processes.length === 0) {
            this.showToast('Please add some processes first!', 'warning');
            return;
        }

        this.isRunning = true;
        this.isPaused = false;
        this.reset();
        this.currentAlgorithm = document.getElementById('algorithmSelect').value;
        
        if (this.currentAlgorithm === 'rr') {
            this.timeQuantum = parseInt(document.getElementById('timeQuantum').value);
        }

        this.simulationInterval = setInterval(() => {
            if (!this.isPaused) {
                this.step();
            }
        }, this.simulationSpeed);

        this.updateControlButtons();
        this.showToast('Simulation started!', 'success');
    }

    pause() {
        this.isPaused = true;
        this.updateControlButtons();
        this.showToast('Simulation paused!', 'warning');
    }

    resume() {
        this.isPaused = false;
        this.updateControlButtons();
        this.showToast('Simulation resumed!', 'success');
    }

    step() {
        if (this.completedProcesses.length === this.processes.length) {
            this.stop();
            return;
        }

        this.executeStep();
        this.updateGanttChart();
        this.updateStatistics();
        this.updateResultsTable();
    }

    stop() {
        this.isRunning = false;
        this.isPaused = false;
        clearInterval(this.simulationInterval);
        this.updateControlButtons();
        this.showToast('Simulation completed!', 'success');
    }

    executeStep() {
        this.addArrivedProcesses();

        switch (this.currentAlgorithm) {
            case 'fcfs':
                this.executeFCFS();
                break;
            case 'sjf':
                this.executeSJF();
                break;
            case 'srtf':
                this.executeSRTF();
                break;
            case 'rr':
                this.executeRoundRobin();
                break;
            case 'priority':
                this.executePriority();
                break;
            case 'priority-preemptive':
                this.executePriorityPreemptive();
                break;
            case 'hrrn':
                this.executeHRRN();
                break;
            case 'multilevel':
                this.executeMultilevelQueue();
                break;
            case 'multilevel-feedback':
                this.executeMultilevelFeedback();
                break;
        }

        this.currentTime++;
    }

    addArrivedProcesses() {
        this.processes.forEach(process => {
            if (process.arrivalTime === this.currentTime && process.status === 'ready') {
                this.readyQueue.enqueue(process);
                process.status = 'waiting';
            }
        });
    }

    executeFCFS() {
        if (!this.readyQueue.isEmpty()) {
            const process = this.readyQueue.dequeue();
            process.status = 'running';
            
            if (process.firstResponseTime === -1) {
                process.firstResponseTime = this.currentTime;
                process.responseTime = process.firstResponseTime - process.arrivalTime;
            }

            this.ganttChart.push({
                process: process.name,
                startTime: this.currentTime,
                endTime: this.currentTime + 1
            });

            process.burstTime--;
            
            if (process.burstTime === 0) {
                process.completionTime = this.currentTime + 1;
                process.turnaroundTime = process.completionTime - process.arrivalTime;
                process.waitingTime = process.turnaroundTime - process.originalBurstTime;
                process.status = 'completed';
                this.completedProcesses.push(process);
            } else {
                this.readyQueue.enqueue(process);
                process.status = 'waiting';
            }
        }
    }

    executeSJF() {
        if (!this.readyQueue.isEmpty()) {
            const queueArray = this.readyQueue.toArray();
            let shortestIndex = 0;
            
            for (let i = 1; i < queueArray.length; i++) {
                if (queueArray[i].burstTime < queueArray[shortestIndex].burstTime) {
                    shortestIndex = i;
                }
            }

            const process = queueArray.splice(shortestIndex, 1)[0];
            this.readyQueue.items = queueArray;
            
            process.status = 'running';
            
            if (process.firstResponseTime === -1) {
                process.firstResponseTime = this.currentTime;
                process.responseTime = process.firstResponseTime - process.arrivalTime;
            }

            this.ganttChart.push({
                process: process.name,
                startTime: this.currentTime,
                endTime: this.currentTime + 1
            });

            process.burstTime--;
            
            if (process.burstTime === 0) {
                process.completionTime = this.currentTime + 1;
                process.turnaroundTime = process.completionTime - process.arrivalTime;
                process.waitingTime = process.turnaroundTime - process.originalBurstTime;
                process.status = 'completed';
                this.completedProcesses.push(process);
            } else {
                this.readyQueue.enqueue(process);
                process.status = 'waiting';
            }
        }
    }

    executeSRTF() {
        if (!this.readyQueue.isEmpty()) {
            const queueArray = this.readyQueue.toArray();
            let shortestIndex = 0;
            
            for (let i = 1; i < queueArray.length; i++) {
                if (queueArray[i].burstTime < queueArray[shortestIndex].burstTime) {
                    shortestIndex = i;
                }
            }

            const process = queueArray.splice(shortestIndex, 1)[0];
            this.readyQueue.items = queueArray;
            
            process.status = 'running';
            
            if (process.firstResponseTime === -1) {
                process.firstResponseTime = this.currentTime;
                process.responseTime = process.firstResponseTime - process.arrivalTime;
            }

            this.ganttChart.push({
                process: process.name,
                startTime: this.currentTime,
                endTime: this.currentTime + 1
            });

            process.burstTime--;
            
            if (process.burstTime === 0) {
                process.completionTime = this.currentTime + 1;
                process.turnaroundTime = process.completionTime - process.arrivalTime;
                process.waitingTime = process.turnaroundTime - process.originalBurstTime;
                process.status = 'completed';
                this.completedProcesses.push(process);
            } else {
                process.status = 'waiting';
                this.readyQueue.enqueue(process);
            }
        }
    }

    executeRoundRobin() {
        if (!this.readyQueue.isEmpty()) {
            const process = this.readyQueue.dequeue();
            process.status = 'running';
            
            if (process.firstResponseTime === -1) {
                process.firstResponseTime = this.currentTime;
                process.responseTime = process.firstResponseTime - process.arrivalTime;
            }

            const executionTime = Math.min(this.timeQuantum, process.burstTime);
            
            for (let i = 0; i < executionTime; i++) {
                this.ganttChart.push({
                    process: process.name,
                    startTime: this.currentTime + i,
                    endTime: this.currentTime + i + 1
                });
            }

            process.burstTime -= executionTime;
            this.currentTime += executionTime - 1;
            
            if (process.burstTime === 0) {
                process.completionTime = this.currentTime + 1;
                process.turnaroundTime = process.completionTime - process.arrivalTime;
                process.waitingTime = process.turnaroundTime - process.originalBurstTime;
                process.status = 'completed';
                this.completedProcesses.push(process);
            } else {
                process.status = 'waiting';
                this.readyQueue.enqueue(process);
            }
        }
    }

    executePriority() {
        if (!this.readyQueue.isEmpty()) {
            const queueArray = this.readyQueue.toArray();
            let highestPriorityIndex = 0;
            
            for (let i = 1; i < queueArray.length; i++) {
                if (queueArray[i].priority < queueArray[highestPriorityIndex].priority) {
                    highestPriorityIndex = i;
                }
            }

            const process = queueArray.splice(highestPriorityIndex, 1)[0];
            this.readyQueue.items = queueArray;
            
            process.status = 'running';
            
            if (process.firstResponseTime === -1) {
                process.firstResponseTime = this.currentTime;
                process.responseTime = process.firstResponseTime - process.arrivalTime;
            }

            this.ganttChart.push({
                process: process.name,
                startTime: this.currentTime,
                endTime: this.currentTime + 1
            });

            process.burstTime--;
            
            if (process.burstTime === 0) {
                process.completionTime = this.currentTime + 1;
                process.turnaroundTime = process.completionTime - process.arrivalTime;
                process.waitingTime = process.turnaroundTime - process.originalBurstTime;
                process.status = 'completed';
                this.completedProcesses.push(process);
            } else {
                this.readyQueue.enqueue(process);
                process.status = 'waiting';
            }
        }
    }

    executePriorityPreemptive() {
        if (!this.readyQueue.isEmpty()) {
            const queueArray = this.readyQueue.toArray();
            let highestPriorityIndex = 0;
            
            for (let i = 1; i < queueArray.length; i++) {
                if (queueArray[i].priority < queueArray[highestPriorityIndex].priority) {
                    highestPriorityIndex = i;
                }
            }

            const process = queueArray.splice(highestPriorityIndex, 1)[0];
            this.readyQueue.items = queueArray;
            
            process.status = 'running';
            
            if (process.firstResponseTime === -1) {
                process.firstResponseTime = this.currentTime;
                process.responseTime = process.firstResponseTime - process.arrivalTime;
            }

            this.ganttChart.push({
                process: process.name,
                startTime: this.currentTime,
                endTime: this.currentTime + 1
            });

            process.burstTime--;
            
            if (process.burstTime === 0) {
                process.completionTime = this.currentTime + 1;
                process.turnaroundTime = process.completionTime - process.arrivalTime;
                process.waitingTime = process.turnaroundTime - process.originalBurstTime;
                process.status = 'completed';
                this.completedProcesses.push(process);
            } else {
                process.status = 'waiting';
                this.readyQueue.enqueue(process);
            }
        }
    }

    executeHRRN() {
        if (!this.readyQueue.isEmpty()) {
            const queueArray = this.readyQueue.toArray();
            let highestRatioIndex = 0;
            let highestRatio = 0;
            
            for (let i = 0; i < queueArray.length; i++) {
                const process = queueArray[i];
                const waitingTime = this.currentTime - process.arrivalTime;
                const responseRatio = (waitingTime + process.originalBurstTime) / process.originalBurstTime;
                
                if (responseRatio > highestRatio) {
                    highestRatio = responseRatio;
                    highestRatioIndex = i;
                }
            }

            const process = queueArray.splice(highestRatioIndex, 1)[0];
            this.readyQueue.items = queueArray;
            
            process.status = 'running';
            
            if (process.firstResponseTime === -1) {
                process.firstResponseTime = this.currentTime;
                process.responseTime = process.firstResponseTime - process.arrivalTime;
            }

            this.ganttChart.push({
                process: process.name,
                startTime: this.currentTime,
                endTime: this.currentTime + 1
            });

            process.burstTime--;
            
            if (process.burstTime === 0) {
                process.completionTime = this.currentTime + 1;
                process.turnaroundTime = process.completionTime - process.arrivalTime;
                process.waitingTime = process.turnaroundTime - process.originalBurstTime;
                process.status = 'completed';
                this.completedProcesses.push(process);
            } else {
                this.readyQueue.enqueue(process);
                process.status = 'waiting';
            }
        }
    }

    executeMultilevelQueue() {
        if (!this.readyQueue.isEmpty()) {
            const queueArray = this.readyQueue.toArray();
            let selectedIndex = 0;
            
            for (let i = 0; i < queueArray.length; i++) {
                if (queueArray[i].priority <= 5) {
                    selectedIndex = i;
                    break;
                }
            }
            
            if (queueArray[selectedIndex].priority > 5) {
                selectedIndex = 0;
            }

            const process = queueArray.splice(selectedIndex, 1)[0];
            this.readyQueue.items = queueArray;
            
            process.status = 'running';
            
            if (process.firstResponseTime === -1) {
                process.firstResponseTime = this.currentTime;
                process.responseTime = process.firstResponseTime - process.arrivalTime;
            }

            this.ganttChart.push({
                process: process.name,
                startTime: this.currentTime,
                endTime: this.currentTime + 1
            });

            process.burstTime--;
            
            if (process.burstTime === 0) {
                process.completionTime = this.currentTime + 1;
                process.turnaroundTime = process.completionTime - process.arrivalTime;
                process.waitingTime = process.turnaroundTime - process.originalBurstTime;
                process.status = 'completed';
                this.completedProcesses.push(process);
            } else {
                this.readyQueue.enqueue(process);
                process.status = 'waiting';
            }
        }
    }

    executeMultilevelFeedback() {
        if (!this.readyQueue.isEmpty()) {
            const queueArray = this.readyQueue.toArray();
            let selectedIndex = 0;
            
            queueArray.forEach(process => {
                const waitingTime = this.currentTime - process.arrivalTime;
                if (waitingTime > 10 && process.priority > 1) {
                    process.priority--;
                }
            });
            
            for (let i = 1; i < queueArray.length; i++) {
                if (queueArray[i].priority < queueArray[selectedIndex].priority) {
                    selectedIndex = i;
                }
            }

            const process = queueArray.splice(selectedIndex, 1)[0];
            this.readyQueue.items = queueArray;
            
            process.status = 'running';
            
            if (process.firstResponseTime === -1) {
                process.firstResponseTime = this.currentTime;
                process.responseTime = process.firstResponseTime - process.arrivalTime;
            }

            this.ganttChart.push({
                process: process.name,
                startTime: this.currentTime,
                endTime: this.currentTime + 1
            });

            process.burstTime--;
            
            if (process.burstTime === 0) {
                process.completionTime = this.currentTime + 1;
                process.turnaroundTime = process.completionTime - process.arrivalTime;
                process.waitingTime = process.turnaroundTime - process.originalBurstTime;
                process.status = 'completed';
                this.completedProcesses.push(process);
            } else {
                this.readyQueue.enqueue(process);
                process.status = 'waiting';
            }
        }
    }

    updateProcessTable() {
        const tbody = document.getElementById('processTableBody');
        tbody.innerHTML = '';

        this.processes.forEach((process, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${process.name}</td>
                <td>${process.arrivalTime}</td>
                <td>${process.originalBurstTime}</td>
                <td>${process.priority}</td>
                <td><span class="status ${process.status}">${process.status}</span></td>
                <td>
                    <button onclick="scheduler.removeProcess(${index})" class="btn btn-danger" style="padding: 5px 10px; font-size: 0.8rem;">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    updateGanttChart() {
        const ganttChart = document.getElementById('ganttChart');
        const timeline = document.getElementById('timeline');
        
        ganttChart.innerHTML = '';
        timeline.innerHTML = '';

        for (let i = 0; i <= this.currentTime; i++) {
            const mark = document.createElement('div');
            mark.className = 'timeline-mark';
            mark.textContent = i;
            timeline.appendChild(mark);
        }

        this.ganttChart.forEach(block => {
            const ganttBlock = document.createElement('div');
            ganttBlock.className = `gantt-block process-${block.process.toLowerCase()}`;
            ganttBlock.textContent = block.process;
            ganttBlock.style.width = `${(block.endTime - block.startTime) * 40}px`;
            ganttChart.appendChild(ganttBlock);
        });
    }

    updateStatistics() {
        if (this.completedProcesses.length === 0) return;

        const totalProcesses = this.completedProcesses.length;
        const totalWaitingTime = this.completedProcesses.reduce((sum, p) => sum + p.waitingTime, 0);
        const totalTurnaroundTime = this.completedProcesses.reduce((sum, p) => sum + p.turnaroundTime, 0);
        const totalResponseTime = this.completedProcesses.reduce((sum, p) => sum + p.responseTime, 0);
        const totalBurstTime = this.completedProcesses.reduce((sum, p) => sum + p.originalBurstTime, 0);

        const avgWaitingTime = totalWaitingTime / totalProcesses;
        const avgTurnaroundTime = totalTurnaroundTime / totalProcesses;
        const avgResponseTime = totalResponseTime / totalProcesses;
        const cpuUtilization = (totalBurstTime / this.currentTime) * 100;
        const throughput = totalProcesses / this.currentTime;

        document.getElementById('avgWaitingTime').textContent = avgWaitingTime.toFixed(2);
        document.getElementById('avgTurnaroundTime').textContent = avgTurnaroundTime.toFixed(2);
        document.getElementById('avgResponseTime').textContent = avgResponseTime.toFixed(2);
        document.getElementById('cpuUtilization').textContent = `${cpuUtilization.toFixed(2)}%`;
        document.getElementById('throughput').textContent = throughput.toFixed(2);
        document.getElementById('totalTime').textContent = this.currentTime;
    }

    updateResultsTable() {
        const tbody = document.getElementById('resultsTableBody');
        tbody.innerHTML = '';

        this.completedProcesses.forEach(process => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${process.name}</td>
                <td>${process.arrivalTime}</td>
                <td>${process.originalBurstTime}</td>
                <td>${process.completionTime}</td>
                <td>${process.turnaroundTime}</td>
                <td>${process.waitingTime}</td>
                <td>${process.responseTime}</td>
            `;
            tbody.appendChild(row);
        });
    }

    updateControlButtons() {
        const startBtn = document.getElementById('startSimulation');
        const pauseBtn = document.getElementById('pauseSimulation');
        const resetBtn = document.getElementById('resetSimulation');
        const stepBtn = document.getElementById('stepSimulation');

        if (this.isRunning) {
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            stepBtn.disabled = true;
        } else {
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            stepBtn.disabled = false;
        }

        if (this.isPaused) {
            pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
            pauseBtn.onclick = () => this.resume();
        } else {
            pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
            pauseBtn.onclick = () => this.pause();
        }
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

const scheduler = new Scheduler();

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('algorithmSelect').addEventListener('change', function() {
        const quantumInput = document.getElementById('quantumInput');
        if (this.value === 'rr') {
            quantumInput.style.display = 'flex';
        } else {
            quantumInput.style.display = 'none';
        }
    });

    document.getElementById('addProcess').addEventListener('click', function() {
        const name = document.getElementById('processName').value.trim();
        const arrivalTime = parseInt(document.getElementById('arrivalTime').value);
        const burstTime = parseInt(document.getElementById('burstTime').value);
        const priority = parseInt(document.getElementById('priority').value) || 5;

        if (!name || isNaN(arrivalTime) || isNaN(burstTime) || burstTime <= 0) {
            scheduler.showToast('Please fill all required fields correctly!', 'error');
            return;
        }

        scheduler.addProcess(name, arrivalTime, burstTime, priority);
        
        document.getElementById('processName').value = '';
        document.getElementById('arrivalTime').value = '';
        document.getElementById('burstTime').value = '';
        document.getElementById('priority').value = '';
    });

    document.getElementById('startSimulation').addEventListener('click', () => scheduler.start());
    document.getElementById('pauseSimulation').addEventListener('click', () => scheduler.pause());
    document.getElementById('resetSimulation').addEventListener('click', () => scheduler.reset());
    document.getElementById('stepSimulation').addEventListener('click', () => scheduler.step());

    document.getElementById('processName').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('addProcess').click();
        }
    });

    scheduler.addProcess('P1', 0, 4, 2);
    scheduler.addProcess('P2', 1, 3, 1);
    scheduler.addProcess('P3', 2, 1, 3);
    scheduler.addProcess('P4', 3, 5, 2);
    scheduler.addProcess('P5', 4, 2, 1);
});
