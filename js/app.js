/*
 * Create a list that holds all of your cards
 */
let cards = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor' , 'fa-bolt',
			  'fa-cube' , 'fa-leaf', 'fa-bicycle', 'fa-bomb'];
cards = [...cards,...cards];
let shuffledCards = [];
const deck = $('.deck');
let openCard = {index: -1, name: '', isOpen: false};
let matchedCards = [];
const movesSpan = $('.moves');
let moves = 0;
let stars = 3;
const starsBreaks = [10, 16];
const starsElem = $('.stars');
const overlay = $('.overlay');
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function updateMoves(){
	movesSpan.text(moves);
}

function updateStars(){
	starsElem.empty();
	let newElement = '';
	let icon = '';
	for(let i = 0; i < 3; i++){
		icon = (i < stars) ? 'fa-star' : 'fa-star-o';
		newElement = $(`<li><i class="fa ${icon}"></i></li>`);
		starsElem.append(newElement);
	}
}

function resetGame() {
	shuffledCards = shuffle(cards);
	deck.empty();
	openCard = {index: -1, name: '', isOpen: false};
    matchedCards = [];
	moves = 0;
	stars = 3;
	updateMoves();
	updateStars();
	overlay.hide();
	let newElement = ``;
	for(let i = 0; i < shuffledCards.length; i++){
		newElement = $(`<li class="card">
						<i class="fa ${shuffledCards[i]}"></i>
					  </li>`);
		newElement.data('index', i);
		deck.append(newElement);
	}
}
resetGame();

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
function cardMatches(ind) {
	return (shuffledCards[ind] == openCard.name) ? true : false;
}

function cardClick(){
	let $_this = $(this);
	if(matchedCards.includes($_this.data('index'))) return 0;
	$_this.toggleClass('open').toggleClass('show');
	if (!openCard.isOpen){
		openCard.isOpen = true;
		openCard.index = $_this.data('index');
		openCard.name = shuffledCards[$_this.data('index')];
	}else{
		const cardIndex = openCard.index;
		const exCard = $('.card').eq(cardIndex);
		if(cardMatches($_this.data('index'))){
			matchedCards.push($_this.data('index'), cardIndex);
			openCard.isOpen = false;
			$_this.addClass('animate2');
			exCard.addClass('animate2');
			//check win
			setTimeout(function(){
				$('.stat-moves').text(moves);
				$('.stat-stars').text(stars);
				overlay.show();
			},1000);
		}else{
			openCard.isOpen = false;
			$_this.addClass('animate wrong');
			exCard.addClass('animate wrong');
			setTimeout(function(){
				$_this.toggleClass('open').toggleClass('show');
				exCard.toggleClass('open').toggleClass('show');
				$_this.removeClass('animate wrong');
				exCard.removeClass('animate wrong');
			},500);
		}
		moves++;
		updateMoves();
		if(starsBreaks.includes(moves)) {
			stars--;
			updateStars();
		}
	}
}

 $('.deck').on('click', '.card', function(){
	cardClick.call(this);
 });
 
 $('.restart').click(function(){
	resetGame();
 });