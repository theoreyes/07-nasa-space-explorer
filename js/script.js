const key = "DEMO_KEY";

// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

const gallery = document.getElementById('gallery')
let apodData = null;

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Grabs image data for requested dates using NASA's APOD API
async function getApodData() {
    try {
        const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${key}&start_date=${startDate.value}&end_date=${endInput.value}`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(`ERROR: Failed to fetch APOD data: ${error}`);
        return null;
    }
}

// Waits for all images to load
function waitForImagesToLoad(images) {
    const imgLoadPromises = images.map(img => {
        if (img.complete && img.naturalHeight !== 0) {
            return Promise.resolve();
        } else {
            return new Promise(resolve => {
                img.addEventListener("load", resolve, {once: true});
                img.addEventListener("error", resolve, {once: true});
            });
        }
    });
    return Promise.all(imgLoadPromises);
}

// Generates HTML content from APOD data
function generateAPODHtml(apodData) {
    let length = apodData.length;
    const galleryContent = [];
    for (let i = 0; i < length; i++) {
        let item = document.createElement('div');
        item.classList.add('gallery-item');
        // Adds content, either img/iframe
        if (apodData[i].media_type === "image") {
            let itemImage = document.createElement('img');
            itemImage.src = apodData[i].url;
            itemImage.setAttribute('data-hdurl', apodData[i].hdurl);
            item.appendChild(itemImage);
        } else {
            let itemVideo = document.createElement('iframe');
            itemVideo.src = apodData[i].url;
            item.appendChild(itemVideo);
        }
        // Adds title info
        let itemTitle = document.createElement('h2');
        itemTitle.classList.add('contentTitle');
        itemTitle.textContent = apodData[i].title;
        item.appendChild(itemTitle);
        // Adds date info
        let itemDate = document.createElement('p');
        itemDate.classList.add('contentDate');
        itemDate.textContent = apodData[i].date;
        item.appendChild(itemDate);
        // Adds item div to array, to be inserted to DOM at later point
        galleryContent.push(item);
    }
    return galleryContent;
}

// Displays space fact to screen
function displayLoadScreen() {
    gallery.innerHTML = "";
    const spaceFact = document.createElement('p');
    spaceFact.id = 'spaceFact';
    spaceFact.textContent = getFact();
    gallery.appendChild(spaceFact);
}

// Adds event listener to fetch and display APOD entries when button is pressed
document.getElementById('getApodDataBtn').addEventListener('click', async function () {
    // Display space fact while entries and images load
    displayLoadScreen();
    // Retrieves APOD data
    apodData = await getApodData();
    if (apodData) {
        // Generate HTML for the APOD entries
        const galleryContent = generateAPODHtml(apodData);
        console.log("Reached this point");
        console.log(galleryContent);
        // Wait to insert until all images are loaded
        const images = galleryContent.map(element => element.querySelector('img'))
                       .filter(img => img !== null); // Avoids grabbing iframes
        await waitForImagesToLoad(images);
        // Inserts content to DOM once images have all loaded
        gallery.innerHTML = "";
        for (let i = 0; i < galleryContent.length; i++)
            gallery.appendChild(galleryContent[i]);
    } else 
        console.log('ERROR: Failed to retrieve APOD data');
});