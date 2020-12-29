var today = Date.now();
// creating day navigation
var navItems = document.querySelectorAll('.nav-item');
for (var i = 0; i < navItems.length; i++) {
    var newDate = new Date(today + (3600 * 1000 * (24 * i)));
    navItems[i].innerText = newDate.getDate() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getFullYear();
    navItems[i].dataset.year = newDate.getFullYear();
    navItems[i].dataset.month = newDate.getMonth();
    navItems[i].dataset.day = newDate.getDate();
}

var moviesData = [
    {
        title: 'AVATAR',
        descrition: "On the lush alien world of Pandora live the Na'vi, beings who appear primitive but are highly evolved. Because the planet's environment is poisonous, human/Na'vi hybrids, called Avatars, must link to human minds to allow for free movement on Pandora. Jake Sully (Sam Worthington), a paralyzed former Marine,...",
        times: ['10:00', '14:00', '18:00'],
        bookedSeats: [1, 2, 3, 20, 21, 50, 77, 78, 79, 80]
    },
    {
        title: 'BATMAN & ROBIN',
        descrition: "This superhero adventure finds Batman (George Clooney) and his partner, Robin (Chris O'Donnell), attempting to the foil the sinister schemes of a deranged set of new villains, most notably the melancholy Mr. Freeze (Arnold Schwarzenegger), who wants to make Gotham into an arctic region, and the sultry...",
        times: ['10:00', '12:00', '16:00', '18:00'],
        bookedSeats: [10, 20, 30, 41, 45, 77, 78, 79, 90]
    },
    {
        title: 'FIGHT CLUB',
        descrition: "A depressed man (Edward Norton) suffering from insomnia meets a strange soap salesman named Tyler Durden (Brad Pitt) and soon finds himself living in his squalid house after his perfect apartment is destroyed. The two bored men form an underground club with strict rules and fight other men who are fed...",
        times: ['10:00', '12:00', '16:00', '18:00'],
        bookedSeats: [1, 2, 41, 45, 57, 58, 59, 90]
    },
    {
        title: 'THE GODFATHER',
        descrition: "Widely regarded as one of the greatest films of all time, this mob drama, based on Mario Puzo's novel of the same name, focuses on the powerful Italian-American crime family of Don Vito Corleone (Marlon Brando). When the don's youngest son, Michael (Al Pacino), reluctantly joins the Mafia, he becomes...",
        times: ['10:00', '13:00', '16:00'],
        bookedSeats: [1, 20, 30, 40, 42, 45, 67, 78, 79, 90]
    },
    {
        title: 'HEAT',
        descrition: "Master criminal Neil McCauley (Robert De Niro) is trying to control the rogue actions of one of his men, while also planning one last big heist before retiring. Meanwhile, Lieutenant Hanna (Al Pacino) attempts to track down McCauley as he deals with the chaos in his own life, including the infidelity...",
        times: ['11:00', '14:00', '17:00', '20:00'],
        bookedSeats: [9, 10, 11, 41, 45, 77, 88, 89, 90]
    },
];

var templates = document.querySelector('.templates');
var movieList = document.querySelector('.movie-list');
var movieCard = templates.querySelector('.movie-card');
var movieInfo = templates.querySelector('.seats-selection');
var movieIndex;

// creating movie cards
for (var i = 0; i < moviesData.length; i++) {
    var movieCardClone = movieCard.cloneNode(true);
    var timesBox = movieCardClone.querySelector('.times-box');
    movieCardClone.querySelector('h1').innerText = moviesData[i].title;
    movieCardClone.querySelector('p').innerText = moviesData[i].descrition;
    timesBox.dataset.index = i;
    for (var index = 0; index < moviesData[i].times.length; index++) {
        var timeSpan = document.createElement('span');
        timeSpan.classList.add('time');
        timeSpan.innerText = moviesData[i].times[index];
        timesBox.insertAdjacentElement('beforeend', timeSpan)
    }
    movieList.insertAdjacentElement('beforeend', movieCardClone);
}


// modal
var modal = document.getElementById("myModal");
var seatsTable = modal.querySelector('.seats-table');
var seats = modal.querySelectorAll('td');
var movieInfoValues = modal.querySelectorAll('.move-info-value');
var selectedSeats = [];
var bookingDate;


// click handler
window.onclick = function (event) {
    bookingDate = document.querySelector('.nav-item.active').innerText;
    var target = event.target;
    if (target.classList.contains('close')) {
        modal.style.display = "none";
    } else if (target.classList.contains('time')) {
        openSeatsModal(target);
    } else if (target.classList.contains('seat')) {
        selectSeats(target);
    } else if (target.classList.contains('success')) {
        var bookingData = {
            bookingDate: document.querySelector('.nav-item.active').dataset,
            bookingTime: movieInfoValues[1].innerText,
            movieName: movieInfoValues[0].innerText,
            selectedSeats: movieInfoValues[4].innerText
        }
        localStorage.setItem(bookingDate + bookingData.bookingTime + bookingData.movieName, JSON.stringify(bookingData));
    }
}

function openSeatsModal(target) {
    modal.style.display = "block";
    movieIndex = target.parentElement.dataset.index
    // 0 - movie name, 1 - start time, 2 - total seats, 3 - available seats, 4 - selected seats
    movieInfoValues[0].innerText = moviesData[movieIndex].title;
    movieInfoValues[1].innerText = target.innerText;
    movieInfoValues[3].innerText = 90 - moviesData[movieIndex].bookedSeats.length;
    var localData = JSON.parse(localStorage.getItem(bookingDate + movieInfoValues[1].innerText + movieInfoValues[0].innerText));
    // clean all seats
    selectedSeats = []
    movieInfoValues[4].innerText = 'none';
    for (var i = 0; i < seats.length; i++) {
        seats[i].className = 'seat';
    }
    var bookingDate = document.querySelector('.nav-item.active').dataset
    var dateNow = new Date();
    var showDate = new Date(bookingDate.year, bookingDate.month, bookingDate.day ,movieInfoValues[1].innerText.substr(0, movieInfoValues[1].innerText.indexOf(':')));

    if (dateNow > showDate) {
        seatsTable.classList.add('no-pointer-events');
    } else {
        seatsTable.classList.remove('no-pointer-events');
    }

    if (localData) {

        // var localDate = new Date(localData.bookingDate.year, localData.bookingDate.month, localData.bookingDate.day, localData.bookingTime.substr(0, localData.bookingTime.indexOf(':')))
        // if (dateNow > localDate) {
        //     seatsTable.classList.add('no-pointer-events');
        // } else {
        //     seatsTable.classList.remove('no-pointer-events');
        // }

        selectedSeats = localData.selectedSeats.split(',');
        movieInfoValues[4].innerText = selectedSeats;

        // mark selected seats
        for (var i = 0; i < selectedSeats.length; i++) {
            seats[selectedSeats[i] - 1].classList.add('selected');
        }

    }

    // mark booked seats
    for (var i = 0; i < moviesData[movieIndex].bookedSeats.length; i++) {
        seats[moviesData[movieIndex].bookedSeats[i] - 1].classList.add('booked');
    }
    if (target.nodeName === 'TD' && target.className !== 'booked') {
        if (target.className === 'selected') {
            target.classList.remove('selected');
        } else {
            target.classList.add('selected');
        }
    }
}

function selectSeats(target) {
    if (!target.classList.contains('booked')) {
        if (target.classList.contains('selected')) {
            target.classList.remove('selected');
            selectedSeats = selectedSeats.filter(function (seat) {
                return seat !== target.innerText;
            })
        } else {
            target.classList.add('selected');
            selectedSeats.push(target.innerText);
        }
    }

    movieInfoValues[3].innerText = 90 - (moviesData[movieIndex].bookedSeats.length + selectedSeats.length);

    if (selectedSeats.length) {
        movieInfoValues[4].innerText = selectedSeats;
    } else {
        movieInfoValues[4].innerText = 'none';
    }
    console.log(selectedSeats)
}
