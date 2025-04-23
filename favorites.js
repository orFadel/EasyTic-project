// Fetching logged-in user's data from localStorage.
const user = JSON.parse(localStorage.getItem('userInfo'));

// Function to update the icons for favorite attractions
function updateFavoriteIcons(favorites) {
    // Loop through each favorite attraction ID and update the icon on the page
    favorites.forEach(attractionId => {
        const button = document.getElementById(`fav-btn-${attractionId}`);
        if (!button) return;
        const icon = button.querySelector('i');
        if (!icon) return;
        icon.classList.remove('bi-bookmark-heart');
        icon.classList.add('bi-bookmark-heart-fill');
    });
}

// Mapping of attraction IDs to their corresponding image URLs
const attractionImages = {
    //  Dubai attractions
    1000: "dubaiPictures/towers/burjkahlifa/burjKhalifa.jpg",
    1001: "dubaiPictures/towers/dubaiframe/DubaiFrame.jpg",
    1002: "dubaiPictures/towers/palmjumeirah/PalmJumeirah.jpg",
    1003: "dubaiPictures/towers/skyview/SkyView.jpg",
    1004: "dubaiPictures/parks/miraclegarden/FlowersGarden.jpg",
    1005: "dubaiPictures/parks/globalvillage/GlobalVillage.jpg",
    1006: "dubaiPictures/parks/aquariumdubaimall/AquaMall.jpg",
    1007: "dubaiPictures/parks/aquaventure/WaterPark.jpg",
    1008: "dubaiPictures/boats/megayacht/lotusmegayacht.jpg",
    1009: "dubaiPictures/boats/sharedtourinhebrew/sharedtourinhebrew.jpg",
    1010: "dubaiPictures/boats/yellowboats/yellowboats.jpg",
    1011: "dubaiPictures/boats/aindubai/aindubai.jpg",
    1012: "dubaiPictures/museum/museumofthefuture/museumofthefuture.jpg",
    1013: "dubaiPictures/museum/AYA/AYA.jpg",
    1014: "dubaiPictures/museum/museumofillusions/illusions.jpg",
    1015: "dubaiPictures/museum/icedubai/icebar.jpg",
    // Paris attractions
    2000: "parisPictures/towers/EiffelTower/EiffelTower.jpg",
    2001: "parisPictures/towers/TheTriumphalArch/TheTriumphalArch.jpg",
    2002: "parisPictures/towers/ThePantheonofParis/ThePantheonofParis.jpg",
    2003: "parisPictures/towers/MontparnasseTower/MontparnasseTower.jpg",
    2004: "parisPictures/museum/wax/wax.jpg",
    2005: "parisPictures/museum/Louvre/Louvre.jpg",
    2006: "parisPictures/museum/chocolate/chocolate.jpg",
    2007: "parisPictures/museum/lights/lights.jpg",
    2008: "parisPictures/parks/Asterix/Asterix.jpg",
    2009: "parisPictures/parks/AquaBoulevard/AquaBoulevard.jpg",
    2010: "parisPictures/parks/Versailles/Versailles.jpg",
    2011: "parisPictures/parks/deFrance/deFrance.jpg",
    2012: "parisPictures/special/Disneyland/Disneyland.jpg",
    2013: "parisPictures/special/AquariumOfParis/AquariumOfParis.jpg",
    2014: "parisPictures/special/CruiseOnTheSeine/CruiseOnTheSeine.jpg",
    2015: "parisPictures/special/OperaGarnier/OperaGarnier.jpg",
    // Rome attractions
    3000: "romePictures/towers/GianicoloHill/GianicoloHill.jpg",
    3001: "romePictures/towers/CastelSant'Angelo/CastelSant'Angelo.jpg",
    3002: "romePictures/towers/TowerOfPisa/TowerOfPisa.jpg",
    3003: "romePictures/towers/SaintPeter/SaintPeter.jpg",
    3004: "romePictures/parks/VillaBorghese/VillaBorghese.jpg",
    3005: "romePictures/parks/TheOrangeGarden/TheOrangeGarden.jpg",
    3006: "romePictures/parks/RainbowFromJickland/RainbowFromJickland.jpg",
    3007: "romePictures/parks/VillaAda/VillaAda.jpg",
    3008: "romePictures/special/Coliseum/Coliseum.jpg",
    3009: "romePictures/special/TheGreatSynagogue/TheGreatSynagogue.jpg",
    3010: "romePictures/special/TreviFountain/TreviFountain.jpg",
    3011: "romePictures/special/bioparco/bioparco.jpg",
    3012: "romePictures/museums/TheVatican/TheVatican.jpg",
    3013: "romePictures/museums/Borghese/Borghese.jpg",
    3014: "romePictures/museums/AraPacis/AraPacis.jpg",
    3015: "romePictures/museums/Etruscan/Etruscan.jpg",
    // London attractions
    4000: "londonPictures/towers/TowerBridge/TowerBridge.jpg",
    4001: "londonPictures/towers/BigBen/BigBen.jpg",
    4002: "londonPictures/towers/LondonEye/LondonEye.jpg",
    4003: "londonPictures/towers/TowerOfLondon/TowerOfLondon.jpg",
    4004: "londonPictures/parks/HydePark/HydePark.jpg",
    4005: "londonPictures/parks/StJamesPark/StJamesPark.jpg",
    4006: "londonPictures/parks/KensingtonGardens/KensingtonGardens.jpg",
    4007: "londonPictures/parks/GreenPark/GreenPark.jpg",
    4008: "londonPictures/shows/BuckinghamPalace/BuckinghamPalace.jpg",
    4009: "londonPictures/shows/HarryPotter/HarryPotter.jpg",
    4010: "londonPictures/shows/JackTheRipper/JackTheRipper.jpg",
    4011: "londonPictures/shows/LionsKing/LionsKing.jpg",
    4012: "londonPictures/museums/WallaceGallery/WallaceGallery.jpg",
    4013: "londonPictures/museums/VictoriaAndAlbert/VictoriaAndAlbert.jpg",
    4014: "londonPictures/museums/NationalGallery/NationalGallery.jpg",
    4015: "londonPictures/museums/BritishMuseum/BritishMuseum.jpg"
};

// Function to display the favorites list in the personal area
function displayFavoritesList(favorites) {
    const favoritesContainer = document.getElementById('my-favorites');
    favoritesContainer.innerHTML = ''; // Clear the list before displaying new items

    favorites.forEach(attractionId => {
        // Determine the ID range the attraction belongs to
        let attractionPage = '';
        if (attractionId >= 1000 && attractionId <= 1015) {
            attractionPage = "dubai.html";
        } else if (attractionId >= 2000 && attractionId <= 2015) {
            attractionPage = "paris.html";
        } else if (attractionId >= 3000 && attractionId <= 3015) {
            attractionPage = "rome.html";
        } else if (attractionId >= 4000 && attractionId <= 4015) {
            attractionPage = "london.html";
        }

        // Fetch the page and image based on the range
        if (attractionPage) {
            // Create the HTML for the favorite attraction
            const attractionHTML = `
                <div style="position: relative;">
                    <button class="favorite-btn" id="fav-btn-${attractionId}" onclick="toggleFavorite(event, ${attractionId})">
                        <i class="bi bi-bookmark-heart-fill"></i>
                    </button>
                    <a class="image-link" href="${attractionPage}#fav-btn-${attractionId}">
                        <button class="btn btn-primary" type="button"  data-bs-toggle="offcanvas"
                        data-bs-target="#offCanvasMenu1">
                            <img src="${attractionImages[attractionId]}" class="image" alt="Attraction ${attractionId}">
                        </button>
                    </a>
                </div>
            `;

            // Append the attraction to the container
            favoritesContainer.innerHTML += attractionHTML;
        }
    });
}


// This function fetches the list of favorite attractions for the logged-in user.
async function fetchFavorites() {
    try {
        // Send request to the server to get user's favorite attractions
        const response = await axios.get(`/api/favorites/${user.userId}`);

        if (response.status === 200) {
            const favorites = response.data.favorites;
            updateFavoriteIcons(favorites); // Update the icons for favorite attractions across all attraction pages on the site.
            displayFavoritesList(favorites); // Display the list of favorite attractions in the user's personal section of the site.
        }
    } catch (error) {
        console.error('Error fetching favorites:', error);
    }
}

//   This function is triggered when the user clicks the favorite icon.
//   If the attraction is already favorite – it will be removed from the user's favorites.
//   If the attraction is not favorite – it will be added to the user's favorites.
//   The icon will only be updated if the server request is successful (status 200).
async function toggleFavorite(event, attractionId) {
    event.stopPropagation(); // Prevents the attraction card from opening when clicking the icon

    // Check if the user is logged in before allowing them to add attractions to favorites.
    if (!user || !user.userId) {
        alert('יש להתחבר לחשבון כדי להוסיף אטרקציות למועדפים שלך.');
        return;
    }

    const button = document.getElementById(`fav-btn-${attractionId}`);
    const icon = button.querySelector('i');
    const isFavorite = icon.classList.contains('bi-bookmark-heart-fill');

    try {
        if (isFavorite) {
            // The attraction is already a favorite — send request to remove it
            const response = await axios.put('/api/favorites/remove-attraction', {
                userId: user.userId,
                attractionId
            });

            if (response.status === 200) {
                // On success — update icon to empty
                icon.classList.remove('bi-bookmark-heart-fill');
                icon.classList.add('bi-bookmark-heart');

                await fetchFavorites();
            } else {
                console.warn('Failed to remove favorite');
                alert('אירעה שגיאה בהסרת האטרקציה מרשימת האטרקציות המועדפות, נסו שוב מאוחר יותר.')
            }
        } else {
            // The attraction is not a favorite — send request to add it
            const response = await axios.put('/api/favorites/add-attraction', {
                userId: user.userId,
                attractionId
            });

            if (response.status === 200) {
                // On success — update icon to filled
                icon.classList.remove('bi-bookmark-heart');
                icon.classList.add('bi-bookmark-heart-fill');
            } else {
                console.warn('Failed to add favorite');
                alert('אירעה שגיאה בהוספת האטרקציה לרשימת האטרקציות המועדפות, נסו שוב מאוחר יותר.')
            }
        }
    } catch (error) {
        console.error('Request failed:', error);
    }
}

// This code runs as soon as the page is fully loaded. 
document.addEventListener("DOMContentLoaded", async () => {
    // Calls a function to fetch the user's favorite attractions from the database.
    await fetchFavorites();
});