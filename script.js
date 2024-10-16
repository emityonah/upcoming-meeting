document.getElementById('announcementForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const description = document.getElementById('description').value;
    const secretCode = document.getElementById('secretCode').value;

    const announcement = {
        date,
        time,
        description,
        secretCode,
        createdAt: new Date().getTime() // Store the creation time for deletion after 24 hours
    };

    addAnnouncement(announcement);
    clearForm();
});

// Adds announcement to the DOM and stores it in local storage
function addAnnouncement(announcement) {
    const announcementItem = document.createElement('li');
    announcementItem.innerHTML = `
        <p class="meeting-date">📅 ${announcement.date} at ${announcement.time}</p>
        <p>${announcement.description}</p>
        <p>🔒 Secret Code: <strong>${announcement.secretCode}</strong></p>
    `;

    document.getElementById('announcementsList').appendChild(announcementItem);

    saveAnnouncement(announcement);
}

// Saves announcement to local storage
function saveAnnouncement(announcement) {
    let announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    announcements.push(announcement);
    localStorage.setItem('announcements', JSON.stringify(announcements));
    removeAfter24Hours(announcement);
}

// Automatically removes announcement after 24 hours
function removeAfter24Hours(announcement) {
    const now = new Date().getTime();
    const timeDiff = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    setTimeout(function() {
        removeAnnouncement(announcement);
    }, timeDiff);
}

// Removes the announcement from DOM and local storage
function removeAnnouncement(announcement) {
    let announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    announcements = announcements.filter(item => item.createdAt !== announcement.createdAt);
    localStorage.setItem('announcements', JSON.stringify(announcements));
    loadAnnouncements(); // Refresh the display
}

// Clears the form
function clearForm() {
    document.getElementById('date').value = '';
    document.getElementById('time').value = '';
    document.getElementById('description').value = '';
    document.getElementById('secretCode').value = '';
}

// Loads announcements from local storage on page load
function loadAnnouncements() {
    const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    const announcementsList = document.getElementById('announcementsList');
    announcementsList.innerHTML = ''; // Clear the list before loading

    announcements.forEach(announcement => {
        const announcementItem = document.createElement('li');
        announcementItem.innerHTML = `
            <p class="meeting-date">📅 ${announcement.date} at ${announcement.time}</p>
            <p>${announcement.description}</p>
            <p>🔒 Secret Code: <strong>${announcement.secretCode}</strong></p>
        `;

        announcementsList.appendChild(announcementItem);
        removeAfter24Hours(announcement); // Set up removal for existing announcements
    });
}

// Load announcements on page load
window.onload = function() {
    loadAnnouncements();
};
