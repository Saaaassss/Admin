const form = document.getElementById('linkForm');
const linksList = document.getElementById('linksList');

// Display nested tree
function displayLinksTree(links, loadStartTime) {
    linksList.innerHTML = '';
    let totalLinks = 0;

    for (const category in links) {
        const catLi = document.createElement('li');
        catLi.innerHTML = `<strong>${category}</strong>`;
        const teamUl = document.createElement('ul');

        for (const team in links[category]) {
            const teamLi = document.createElement('li');
            teamLi.innerHTML = `<em>${team}</em>`;
            const linkUl = document.createElement('ul');

            links[category][team].forEach(link => {
                totalLinks++;
                const li = document.createElement('li');
                li.innerHTML = `
                    <a href="${link.url}" target="_blank">${link.url}</a> | ${link.description}
                    <button onclick="editLink('${category}','${team}','${link.url}','${link.description}')">Edit</button>
                    <button onclick="deleteLink('${category}','${team}','${link.url}','${link.description}')">Delete</button>
                `;
                linkUl.appendChild(li);
            });

            teamLi.appendChild(linkUl);
            teamUl.appendChild(teamLi);
        }

        catLi.appendChild(teamUl);
        linksList.appendChild(catLi);
    }

    if (typeof loadStartTime === 'number') {
        const loadEndTime = performance.now();
        const timeTaken = (loadEndTime - loadStartTime).toFixed(2);
        console.log(`Loaded and rendered ${totalLinks} links in ${timeTaken} ms.`);
        // Optionally, display on page:
        let timingDiv = document.getElementById('timing-info');
        if (!timingDiv) {
            timingDiv = document.createElement('div');
            timingDiv.id = 'timing-info';
            timingDiv.style.margin = '10px 0';
            linksList.parentNode.insertBefore(timingDiv, linksList);
        }
        timingDiv.textContent = `Loaded and rendered ${totalLinks} links in ${timeTaken} ms.`;
    }
}

// Load links from server
function loadLinks() {
    const loadStartTime = performance.now();
    fetch('/api/links')
        .then(res => res.json())
        .then(data => displayLinksTree(data, loadStartTime));
}

loadLinks();

// Add new link
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const linkData = {
        category: document.getElementById('category').value,
        team: document.getElementById('team').value,
        url: document.getElementById('url').value,
        description: document.getElementById('description').value
    };

    fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(linkData)
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            loadLinks();
            form.reset();
            alert('Link added successfully!');
        }
    });
});

// Delete link
function deleteLink(category, team, url, description) {
    if (!confirm("Are you sure you want to delete this link?")) return;

    fetch('/api/links/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, team, url, description })
    })
    .then(res => res.json())
    .then(() => loadLinks());
}

// Edit link (all fields)
function editLink(category, team, url, description) {
    const new_category = prompt("Enter new Category:", category);
    if (new_category === null) return;
    const new_team = prompt("Enter new Team:", team);
    if (new_team === null) return;
    const new_url = prompt("Enter new URL:", url);
    if (new_url === null) return;
    const new_description = prompt("Enter new Description:", description);
    if (new_description === null) return;

    fetch('/api/links/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            old_category: category,
            old_team: team,
            old_url: url,
            old_description: description,
            new_category,
            new_team,
            new_url,
            new_description
        })
    })
    .then(res => res.json())
    .then(() => loadLinks());
}
