const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { classifyProblemSeverity } = require('./src/severity');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static('public'));

let issueIdCounter = 1;
const issues = [];

app.get('/api/issues', (_req, res) => {
  res.json(issues);
});

app.post('/api/issues', (req, res) => {
  const { title = '', description = '', location = '' } = req.body || {};
  const details = `${title} ${description} ${location}`.trim();

  if (!details) {
    return res.status(400).json({ error: 'Issue details are required.' });
  }

  const issue = {
    id: issueIdCounter++,
    title,
    description,
    location,
    severity: classifyProblemSeverity(details),
    status: 'submitted',
    createdAt: new Date().toISOString()
  };

  issues.push(issue);
  io.emit('issue:created', issue);
  return res.status(201).json(issue);
});

app.patch('/api/issues/:id/status', (req, res) => {
  const { status } = req.body || {};
  const allowedStatuses = new Set(['under process', 'resolved']);

  if (!allowedStatuses.has(status)) {
    return res.status(400).json({ error: 'Invalid status.' });
  }

  const issue = issues.find((item) => item.id === Number(req.params.id));
  if (!issue) {
    return res.status(404).json({ error: 'Issue not found.' });
  }

  issue.status = status;
  io.emit('issue:updated', issue);
  return res.json(issue);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Campus Fix server running on http://localhost:${PORT}`);
});
