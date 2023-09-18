function moveUrl(url, direction) {
  chrome.storage.sync.get('pinnedTabs', (data) => {
    const pinnedTabs = data.pinnedTabs;
    const currentOrder = pinnedTabs[url];
    const targetOrder = currentOrder + direction;

    // Find the URL that currently has the target order
    const targetUrl = Object.keys(pinnedTabs).find(key => pinnedTabs[key] === targetOrder);

    if (targetUrl) {
      // Swap the orders
      pinnedTabs[url] = targetOrder;
      pinnedTabs[targetUrl] = currentOrder;
    }

    // Save the updated pinnedTabs object
    chrome.storage.sync.set({ pinnedTabs }, () => {
      // Refresh the table
      const table = document.getElementById('tabsTable');
      while (table.firstChild) {
        table.removeChild(table.firstChild);
      }
      loadTable();  // Assuming you've wrapped the table loading logic in a function called loadTable
    });
  });
}

function loadTable() {
  chrome.storage.sync.get('pinnedTabs', (data) => {
    const pinnedTabs = data.pinnedTabs;
    const table = document.getElementById('tabsTable');
    const sortedUrls = Object.keys(pinnedTabs).sort((a, b) => pinnedTabs[a] - pinnedTabs[b]);
    
    sortedUrls.forEach((url) => {
      const row = table.insertRow();
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      const cell3 = row.insertCell(2);
      cell1.innerHTML = url;
      cell2.innerHTML = '<button class="btn btn-icon btn-secondary"><i class="fas fa-arrow-up"></i></button>';  // Up arrow icon
      cell3.innerHTML = '<button class="btn btn-icon btn-secondary"><i class="fas fa-arrow-down"></i></button>';  // Down arrow icon
            
      // Add event listeners for move up and move down
      cell2.childNodes[0].addEventListener('click', () => moveUrl(url, -1));
      cell3.childNodes[0].addEventListener('click', () => moveUrl(url, 1));
    });
  });
}

document.addEventListener('DOMContentLoaded', loadTable);
