// Shhh don't read this D:
const key = "GAjl0E5QIUaSmSdQQvyBHNJHKfTO34h0DyLa6p0N";

// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
let apodData = null;

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

//console.log(startDate.value)
//console.log(endInput.value);

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

// Adds event listener to grab APOD images when button is pressed
document.getElementById('getApodDataBtn').addEventListener('click', async function () {
    apodData = await getApodData();
    // TODO: refactor this event listener, its insane lol
    if (apodData) {
        console.log(apodData);
        const gallery = document.getElementById('gallery');
        gallery.innerHTML = "";
        const spaceFact = document.createElement('p');
        spaceFact.id = 'spaceFact';
        // TODO: Replace space fact with random space fact call
        spaceFact.textContent = "The Sun is over 864,000 miles wide. It's so big that you could fit 1,300,000 planet Earths inside!";
        gallery.appendChild(spaceFact);
 
        // Generates HTML content for each apod entry
        let length = apodData.length;
        const galleryContent = [];
        console.log(length);
        for (let i = 0; i < length; i++) {
            let item = document.createElement('div');
            item.classList.add('contentDiv');
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

        // TODO: Wait here for all images to load

        gallery.innerHTML = "";
        for (let i = 0; i < length; i++) {
            gallery.appendChild(galleryContent[i]);
        }

    } else 
        console.log('ERROR: Apod data was not found');
});