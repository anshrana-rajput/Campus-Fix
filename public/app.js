const socket = io();
const issuesContainer = document.getElementById('issues');
const form = document.getElementById('issue-form');
const submitMessage = document.getElementById('submit-message');

const state = {
  issues: []
};

function severityClass(severity) {
  if (severity === 'high') return 'sev-high';
  if (severity === 'medium') return 'sev-medium';
  return 'sev-low';
}

function renderIssues() {
  issuesContainer.innerHTML = '';

  if (!state.issues.length) {
    issuesContainer.innerHTML = '<p>No issues submitted yet.</p>';
    return;
  }

  state.issues
    .slice()
    .sort((a, b) => b.id - a.id)
    .forEach((issue) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'issue';
      wrapper.innerHTML = `
        <strong>${issue.title || 'Untitled issue'}</strong>
        <div>${issue.description || ''}</div>
        <div class="meta">Location: ${issue.location || 'Not provided'}</div>
        <div class="meta ${severityClass(issue.severity)}">Severity: ${issue.severity}</div>
        <div class="meta">Status: ${issue.status}</div>
      `;

      const select = document.createElement('select');
      ['under process', 'resolved'].forEach((status) => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status;
        option.selected = issue.status === status;
        select.appendChild(option);
      });

      select.addEventListener('change', async () => {
        await fetch(`/api/issues/${issue.id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: select.value })
        });
      });

      wrapper.appendChild(select);
      issuesContainer.appendChild(wrapper);
    });
}

async function loadIssues() {
  const response = await fetch('/api/issues');
  state.issues = await response.json();
  renderIssues();
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  submitMessage.textContent = '';

  const payload = {
    title: document.getElementById('title').value.trim(),
    description: document.getElementById('description').value.trim(),
    location: document.getElementById('location').value.trim()
  };

  const response = await fetch('/api/issues', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    submitMessage.textContent = 'Please provide issue details.';
    return;
  }

  form.reset();
  submitMessage.textContent = 'Issue submitted successfully.';
});

socket.on('issue:created', (issue) => {
  state.issues.push(issue);
  renderIssues();
});

socket.on('issue:updated', (updatedIssue) => {
  state.issues = state.issues.map((issue) =>
    issue.id === updatedIssue.id ? updatedIssue : issue
  );
  renderIssues();
});

loadIssues();
