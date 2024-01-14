var userMax = 10;
var count = 11;
var score = 0;
var stringToShow;
var randomNumber1;
var randomNumber2;
var symbols = ["+", "-", "*", "/"];
var randomIndex;
var randomSymbol;
var result;
var highestScores = [];

var storedScores = localStorage.getItem("highestScores");
if (storedScores) {
	highestScores = JSON.parse(storedScores);
}

var saveScoresToLocalStorage = function () {
	localStorage.setItem("highestScores", JSON.stringify(highestScores));
};

var calcResult = function (num1, symbol, num2) {
	switch (symbol) {
		case "+":
			result = num1 + num2;
			break;
		case "-":
			result = num1 - num2;
			break;
		case "*":
			result = num1 * num2;
			break;
		case "/":
			result = num1 / num2;
			break;
		default:
			break;
	}
	return result;
};

var getQuiz = function () {
	randomNumber1 = Math.trunc(Math.random() * userMax) + 1;
	randomNumber2 = Math.trunc(Math.random() * userMax) + 1;
	if (randomNumber1 < randomNumber2) {
		var temp = randomNumber1;
		randomNumber1 = randomNumber2;
		randomNumber2 = temp;
	}
	randomIndex = Math.floor(Math.random() * symbols.length);
	randomSymbol = symbols[randomIndex];
	stringToShow = randomNumber1 + randomSymbol + randomNumber2;
	result = calcResult(randomNumber1, randomSymbol, randomNumber2);
	return stringToShow;
};

var showScores = function () {
	$(".main").empty();
	$(".sec").empty();
	$(".main").addClass("flex-column align-items-center");
	highestScores.sort(function (a, b) {
		return b.score - a.score;
	});

	$(".main").append("<p class='txt-lg'>Top 10:</p><ol class='txt-md'></ol>");

	for (var i = 0; i < Math.min(highestScores.length, 10); i++) {
		var name = highestScores[i].name;
		var score = highestScores[i].score;
		$(".txt-md").append("<li>" + name + ": " + score + "</li>");
	}

	$(".main").append(
		"<button class='btn back'><a href='index.html'>Back</a></button>"
	);
};

$(document).ready(function () {
	var countdown = function () {
		var updateCountdown = function () {
			if (count === 0) {
				count = 11;
			} else {
				count--;
				$(".countdown").text(count);
			}

			if (count > 0) {
				setTimeout(updateCountdown, 1000);
			}
		};
		updateCountdown();
	};
	var isGameStarted = false;
	var resetGame = function () {
		isGameStarted = false;
		count = 11;
		score = 0;
		$(".countdown").text(count);
		$(".answer").val("");
	};

	var startGame = function () {
		var timeOut;
		$(".main").empty();
		$(".sec").empty();
		$(".main").addClass("flex-column align-items-center");
		$(".main").append(
			"<p class='txt-lg'>You have 10 seconds to make your guess. Good luck!</p>" +
				"<p class='txt-md'>Choose your highest number : <input type='number' value='10' class='num'/><button class='btn' id='max'>Submit</button></p>" +
				"<p class='txt-md'>Enter your name : <input type='text' class='name'/></p>" +
				"<div class='btns'><button class='btn back'><a href='index.html'>Back</a></button><button class='btn new-game' id='name-btn'>Start</button></div>" +
				"<div class='mtop'><p class='txt-md inline'>Countdown: <span class='countdown'></span></p><p class='txt-md inline'>Score: <span class='currscore'></span></p></div>" +
				"<div class='txt-xl quiz-container'><span>Quiz:</span><span class='quiz txt-xl'></span><input type='number' class='answer txt-md'/></div>"
		);

		$("#max").on("click", function () {
			userMax = $(".num").val();
			getQuiz();
		});

		var game = function () {
			var userData = {};
			var userName = $(".name").val();
			userData.name = userName;
			if (userName !== "") {
				if (!isGameStarted && count !== 0) {
					isGameStarted = true;
					$(".quiz").text(stringToShow);
					countdown();
				}

				$(".answer").on("input", function () {
					clearTimeout(timeOut);
					timeOut = setTimeout(function () {
						var answer = Math.floor(parseInt($(".answer").val(), 10));
						if (answer == result && count > 0) {
							count += 1;
							score += 1;
							getQuiz();
							result = Math.floor(
								calcResult(randomNumber1, randomSymbol, randomNumber2)
							);
							$(".quiz").text(stringToShow);
							$(".currscore").text(score);

							$(".answer").val("");
							saveScoresToLocalStorage();
						} else if (count === 0) {
							$(".answer").off("input");
							$(".answer").prop("disabled", true);
							userData.score = score;
							highestScores.push(userData);
							console.log(highestScores);
							saveScoresToLocalStorage();
							if ($("#restart").length === 0) {
								$(".main").append(
									"<button class='btn' id='restart'>Restart</button>"
								);
							}

							$("#name-btn").remove();
							$("#restart").on("click", function () {
								resetGame();
								$(".answer").on("input");
								$(".answer").prop("disabled", false);
								getQuiz();
								game();
								result = Math.floor(
									calcResult(randomNumber1, randomSymbol, randomNumber2)
								);
								$(".quiz").text(stringToShow);
							});
						}
					}, 500);
				});
			} else {
				alert("Please enter your name before starting the game.");
			}
		};

		$(".new-game").on("click", game);
	};

	$(".start").on("click", startGame);
	$(".scores").on("click", showScores);
});
