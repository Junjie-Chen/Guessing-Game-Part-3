function Game() {
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function() {
  return Math.abs(this.playersGuess - this.winningNumber);
};

Game.prototype.isLower = function() {
  return this.playersGuess < this.winningNumber;
};

Game.prototype.playersGuessSubmission = function(num) {
  if (num < 1 || num > 100 || typeof num !== "number") {
    throw "That is an invalid guess.";
  } else {
    this.playersGuess = num;

    return this.checkGuess();
  }
};

Game.prototype.checkGuess = function() {
  if (this.playersGuess === this.winningNumber) {
    $("#subtitle").text("Press the Reset button to play again!");
    $("#hint, #submit").prop("disabled", true);

    return "You Win!";
  } else {
    if (this.pastGuesses.indexOf(this.playersGuess) > -1) {
      return "You have already guessed that number.";
    } else {
      this.pastGuesses.push(this.playersGuess);

      $("#guess-list li:nth-child(" + this.pastGuesses.length + ")").text(this.playersGuess);

      if (this.pastGuesses.length === 5) {
        $("#subtitle").text("Press the Reset button to play again!");
        $("#hint, #submit").prop("disabled", true);

        return "You Lose.";
      } else {
        var diff = this.difference();

        if(this.isLower()) {
          $("#subtitle").text("Guess Higher!");
        } else {
          $("#subtitle").text("Guess Lower!");
        }

        if (diff < 10) {
          return "You\'re burning up!";
        } else if (diff < 25) {
          return "You\'re lukewarm.";
        } else if (diff < 50) {
          return "You\'re a bit chilly.";
        } else {
          return "You\'re ice cold!";
        }
      }
    }
  }
};

Game.prototype.provideHint = function() {
  var hintArr = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];

  return shuffle(hintArr);
};

function generateWinningNumber() {
  return Math.floor(Math.random() * 100 + 1);
}

function shuffle(arr) {
  var m = arr.length, i, t;

  while (m) {
    i = Math.floor(Math.random() * m--);

    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }

  return arr;
}

function newGame() {
  return new Game();
};

function makeAGuess(game) {
  var guess = $("#player-input").val();

  $("#player-input").val("");

  var output = game.playersGuessSubmission(parseInt(guess, 10));

  $("#title").text(output);
}

$(document).ready(function() {
  var game = new Game();

  $("#submit").on("click", function() {
    makeAGuess(game);
  });

  $("#player-input").on("keypress", function(event) {
    if (event.which === 13) {
      makeAGuess(game);
    }
  });

  $("#reset").on("click", function() {
    game = newGame();

    $("#title").text("Play the Guessing Game!");
    $("#subtitle").text("Guess a number between 1-100!");
    $(".guess").text("-");
    $("#hint, #submit").prop("disabled", false);
  });

  $("#hint").on("click", function() {
    var hints = game.provideHint();

    $("#title").text("The winning number is " + hints[0] + ", " + hints[1] + ", or " + hints[2]);
  });
});
