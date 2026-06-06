let window = {};
window.mockJobs = [];
let mockJobs = window.mockJobs;
window.mockJobs.unshift({ id: 1, title: 'Test', distance: 5 });
let activeRadius = 10;
let jobs = mockJobs.filter(j => j.distance === null || j.distance === undefined || j.distance <= activeRadius);
console.log(jobs.length);
