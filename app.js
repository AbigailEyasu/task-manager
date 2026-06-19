
const fs = require('fs');

const task = process.argv[2];

let tasks = [];

if (fs.existsSync('tasks.json')) {
	tasks = JSON.parse(fs.readFileSync('tasks.json'));
}

if (task) {
	tasks.push(task);
	fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
	console.log('Task added:', task);
} else {
	console.log('Tasks:');
	tasks.forEach((t, i) => {
		console.log(`${i + 1}. ${t}`);
	});
}
