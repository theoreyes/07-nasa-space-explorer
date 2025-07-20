const key = "GAjl0E5QIUaSmSdQQvyBHNJHKfTO34h0DyLa6p0N";

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

function pauseAllVideos() {
  const iframes = document.querySelectorAll('.video');
  iframes.forEach((iframe) => {
    iframe.pauseVideo();
  });
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
            item.appendChild(itemImage);
        } else {
            let itemVideo = document.createElement('iframe');
            itemVideo.src = `${apodData[i].url}?enablejsapi=1`;
            itemVideo.classList.add('video');
            console.log(itemVideo.src);
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
        // Adds explanation info to element
        item.dataset.info = apodData[i].explanation;
        // Adds event listener for modal view of the gallery item
        item.addEventListener('click', () => displayModal(item));
        // Adds item div to array, to be inserted to DOM at later point
        galleryContent.push(item);
    }
    return galleryContent;
}

function getScrollbarWidth() {
  return (window.innerWidth - document.documentElement.clientWidth);
}

function disableBodyScroll() {
  const scrollbarWidth = getScrollbarWidth();
  document.body.classList.add('modal-open');
  document.body.style.overflowY = 'hidden';
  document.body.style.marginRight = `${scrollbarWidth}px`;
}

function enableBodyScroll() {
  document.body.classList.remove('modal-open');
  document.body.style.overflowY = '';
  document.body.style.marginRight = '';
}

function pauseAllVideos() {
    const videos = document.querySelectorAll('iframe');
    videos.forEach((video) => {
        video.contentWindow.postMessage(
            JSON.stringify({
                event: 'command',
                func: 'pauseVideo',
                args: []
            }),
            '*'
        )
    })
}

// Responsible for generating modal containing info on selected item
function displayModal(item) {
    pauseAllVideos();
    const modalBg = document.getElementById('modalBg');
    const modal = document.getElementById('galleryModal');
    const modalContent = document.getElementById('modalContent');
    disableBodyScroll();
    modalContent.innerHTML = '';
    // Adds modal close button & event listener
    closeModalBtn = document.createElement('button');
    closeModalBtn.id = "closeModalBtn";
    closeModalBtn.innerHTML = 'X';
    closeModalBtn.addEventListener('click', function () {
        modal.style.display = 'none';
        modalBg.style.display = 'none';
        modalContent.innerHTML = '';
        enableBodyScroll();
    })
    modalContent.appendChild(closeModalBtn);
    // Adds image/iframe to modal content
    if (item.querySelector('img') !== null) {
        const image = document.createElement('img');
        image.classList.add('modalImage');
        image.src = item.children[0].src;
        modalContent.appendChild(image);
    } else {
        const video = document.createElement('iframe')
        video.classList.add('modalVideo');
        video.src = item.children[0].src;
        modalContent.appendChild(video);
    }
    // Adds title
    const title = document.createElement('h2');
    title.classList.add('modalTitle');
    title.textContent = item.children[1].textContent;
    modalContent.appendChild(title);
    // Adds date
    const date = document.createElement('p');
    date.classList.add('modalDate');
    date.textContent = item.children[2].textContent;
    modalContent.appendChild(date);
    // Adds explanation info
    const info = document.createElement('p');
    info.classList.add('modalInfo');
    info.textContent = `${item.dataset.info}`;
    modalContent.appendChild(info);
    modal.style.display = 'flex';
    modal.style.direction = 'column';
    modalBg.style.display = 'flex';
    // Lastly adds click event listener to greyed-out background for closing modal
    document.getElementById('modalBg').addEventListener('click', function (event) {
        if (!modal.contains(event.target)) {
            // Clicked outside modal → close
            modal.style.display = 'none';
            this.style.display = 'none';
            enableBodyScroll();
        }
    });
    modalContent.scrollTop = 0;
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