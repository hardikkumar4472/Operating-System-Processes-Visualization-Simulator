# OS Job Scheduler Visualizer

A comprehensive, interactive web-based simulator for CPU scheduling algorithms with real-time visualization and performance metrics.

## 🚀 Features

### Supported Scheduling Algorithms

1. **First-Come, First-Served (FCFS)**
   - Non-preemptive scheduling
   - Processes executed in arrival order
   - Simple queue-based approach

2. **Shortest Job First (SJF)**
   - Non-preemptive version
   - Process with smallest burst time runs first
   - Optimal for minimizing average waiting time

3. **Shortest Remaining Time First (SRTF)**
   - Preemptive version of SJF
   - Process with shortest remaining time gets CPU
   - Most optimal for minimizing average waiting time

4. **Round Robin (RR)**
   - Preemptive scheduling with time quantum
   - Each process gets fixed time slice
   - Fair scheduling for time-sharing systems

5. **Priority Scheduling**
   - Non-preemptive version
   - Higher priority (lower number) processes run first
   - Configurable priority levels (1-10)

6. **Priority Scheduling (Preemptive)**
   - Preemptive version of priority scheduling
   - Higher priority processes can preempt running processes

7. **Highest Response Ratio Next (HRRN)**
   - Non-preemptive algorithm
   - Selects process with highest response ratio
   - Response Ratio = (Waiting Time + Burst Time) / Burst Time

8. **Multilevel Queue Scheduling**
   - Two priority levels (High: 1-5, Low: 6-10)
   - High priority processes get preference
   - Simple implementation for demonstration

9. **Multilevel Feedback Queue**
   - Similar to multilevel queue with aging
   - Processes can change priority based on waiting time
   - Prevents starvation

### Data Structures Implemented

- **Queue**: Used for FCFS and general process management
- **Stack**: Available for future implementations
- **Priority Queue**: Used for priority-based scheduling
- **Arrays**: Used for process storage and sorting

### Visualization Features

- **Real-time Gantt Chart**: Visual representation of process execution
- **Process Table**: Shows current status of all processes
- **Performance Metrics**: Live calculation of:
  - Average Waiting Time
  - Average Turnaround Time
  - Average Response Time
  - CPU Utilization
  - Throughput
  - Total Execution Time
- **Detailed Results Table**: Complete breakdown of each process's metrics
- **Interactive Timeline**: Time markers for easy tracking

### User Interface

- **Modern, Responsive Design**: Works on desktop and mobile devices
- **Interactive Controls**: Start, pause, resume, reset, and step-by-step execution
- **Toast Notifications**: Real-time feedback for user actions
- **Color-coded Processes**: Each process has a unique color in the Gantt chart
- **Status Indicators**: Visual status badges for process states

## 🛠️ How to Use

### Getting Started

1. **Open the Application**: Simply open `index.html` in any modern web browser
2. **Add Processes**: Use the process input form to add processes with:
   - Process Name (e.g., P1, P2)
   - Arrival Time (when process arrives)
   - Burst Time (execution time needed)
   - Priority (1-10, lower number = higher priority)

### Running Simulations

1. **Select Algorithm**: Choose from the dropdown menu
2. **Configure Settings**: For Round Robin, set the time quantum
3. **Start Simulation**: Click "Start" to begin automatic execution
4. **Control Execution**:
   - **Pause/Resume**: Temporarily stop or continue simulation
   - **Step**: Execute one time unit at a time
   - **Reset**: Clear all results and start over

### Understanding the Results

- **Gantt Chart**: Shows the execution order and timing
- **Statistics Cards**: Display real-time performance metrics
- **Results Table**: Detailed breakdown for each completed process
- **Process Table**: Current status of all processes

## 📊 Performance Metrics Explained

### Waiting Time
- Time a process spends waiting in the ready queue
- Calculated as: Completion Time - Arrival Time - Burst Time

### Turnaround Time
- Total time from arrival to completion
- Calculated as: Completion Time - Arrival Time

### Response Time
- Time from arrival to first CPU allocation
- Important for interactive systems

### CPU Utilization
- Percentage of time CPU is busy
- Calculated as: (Total Burst Time / Total Time) × 100

### Throughput
- Number of processes completed per time unit
- Calculated as: Number of Processes / Total Time

## 🎯 Algorithm Comparison

| Algorithm | Preemptive | Average Waiting Time | CPU Utilization | Fairness |
|-----------|------------|---------------------|-----------------|----------|
| FCFS | No | High | Medium | High |
| SJF | No | Low | Medium | Low |
| SRTF | Yes | Lowest | Medium | Low |
| Round Robin | Yes | Medium | High | High |
| Priority | No | Medium | Medium | Low |
| HRRN | No | Low | Medium | Medium |

## 🏗️ Technical Implementation

### Architecture
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **No Dependencies**: Pure vanilla JavaScript
- **Responsive Design**: CSS Grid and Flexbox
- **Real-time Updates**: DOM manipulation for live visualization

### Key Classes
- `Process`: Represents individual processes with all properties
- `Queue`: FIFO data structure for process management
- `Stack`: LIFO data structure (available for future use)
- `PriorityQueue`: Priority-based queue implementation
- `Scheduler`: Main orchestrator class handling all algorithms

### Algorithm Implementation
Each algorithm is implemented as a separate method in the Scheduler class:
- `executeFCFS()`: First-Come, First-Served
- `executeSJF()`: Shortest Job First
- `executeSRTF()`: Shortest Remaining Time First
- `executeRoundRobin()`: Round Robin with time quantum
- `executePriority()`: Non-preemptive priority scheduling
- `executePriorityPreemptive()`: Preemptive priority scheduling
- `executeHRRN()`: Highest Response Ratio Next
- `executeMultilevelQueue()`: Multilevel queue scheduling
- `executeMultilevelFeedback()`: Multilevel feedback queue

## 🎨 Customization

### Adding New Algorithms
1. Add the algorithm name to the HTML dropdown
2. Implement the execution method in the Scheduler class
3. Add the case in the `executeStep()` method
4. Update the algorithm selection event listener if needed

### Styling
- Modify `styles.css` for visual changes
- Process colors are defined in CSS classes (`.process-p1`, `.process-p2`, etc.)
- Responsive breakpoints are defined for mobile devices

### Performance Tuning
- Adjust `simulationSpeed` in the Scheduler constructor
- Modify the time quantum for Round Robin
- Change the aging threshold in multilevel feedback queue

## 🚀 Future Enhancements

- **More Algorithms**: Add more scheduling algorithms
- **Process I/O**: Implement I/O-bound processes
- **Multiple CPUs**: Simulate multi-processor systems
- **Process Dependencies**: Add process precedence constraints
- **Export Results**: Save simulation results to file
- **Algorithm Comparison**: Side-by-side algorithm comparison
- **Custom Process Sets**: Save and load process configurations

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to contribute by:
- Adding new scheduling algorithms
- Improving the UI/UX
- Fixing bugs
- Adding new features
- Improving documentation

---

**Happy Scheduling! 🎉**
