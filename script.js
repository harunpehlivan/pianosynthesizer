var audiolet = new Audiolet();
var lowPass = 200;
var highPass = 300;

var maximumDelayTime = 10.0;
var delayTime = 0.3;

var feedback = 0.5;
var mix = 0.5;

var gate = 1;
var attack = 1;
var decay = .2;
var sustain = .9;
var release = 2;

var sines = [];
var sawes = [];

var lpFilter = new LowPassFilter(audiolet, lowPass);
var hpFilter = new HighPassFilter(audiolet, highPass);
var feedbackDelay = new FeedbackDelay(audiolet, maximumDelayTime, delayTime, feedback, mix);


lpFilter.connect(hpFilter);
hpFilter.connect(feedbackDelay);
feedbackDelay.connect(audiolet.output);

var stoppingKeys = [];

var transposeUp = false;

function makeTone(frequency, stopHandler) {
  sines.push(new Sine(audiolet, frequency));
  //sawes.push(new Saw(audiolet,frequency));

  sines[sines.length - 1].connect(lpFilter);
  //sawes[sawes.length-1].connect(lpFilter);

  //sawes[sawes.length-1].phase = 0;

  stoppingKeys[sines.length - 1] = stopHandler;

  return sines.length - 1;
};

function stopMe(index) {
  sines[index].remove();

  var returnValue = stoppingKeys[index];
  stoppingKeys.splice(index);

  return returnValue;
}

$(".key").bind("mousedown touchstart", function() {

  var className = this.className;
  var tone = className.substring(4, 5);
  var cross = $(this).hasClass("cross");

  var frequency = 0.0;

  $(this).addClass("active");

  var index = $(this).index() - 21;
  frequency = 440 * Math.pow(2, (index / 12));

  var index = makeTone(frequency, $(this));
  $(this).bind("mouseup touchend mouseleave", function() {
    stopMe(index);

    $(this).removeClass("active").unbind("mouseup touchend mouseleave");
  });

});

var keysPressed = [];

$(window).bind("keydown keyup", function(e) {
 
  var up = (e.type == "keyup");
  var key = "";

  if (!up && keysPressed[e.which] == true) {
    e.preventDefault();
    return false;
  } else {

    var zeroClass = (transposeUp ? "one" : "zero");
    var oneClass = (transposeUp ? "two" : "one");
    var twoClass = (transposeUp ? "three" : "two");

    keysPressed[e.which] = !up;
    switch (e.which) {

      case keyCZero: // Y
        key = ".key." + zeroClass + ".c";
        break;
      case 83: // S
        key = ".key." + zeroClass + ".c.cross";
        break;
      case 88: // X
        key = ".key." + zeroClass + ".d";
        break;
      case 68: // D
        key = ".key." + zeroClass + ".d.cross";
        break;
      case 67: // C
        key = ".key." + zeroClass + ".e";
        break;
      case 86: // V
        key = ".key." + zeroClass + ".f";
        break;
      case 71: // G
        key = ".key." + zeroClass + ".f.cross";
        break;
      case 66: // B
        key = ".key." + zeroClass + ".g";
        break;
      case 72: // H
        key = ".key." + zeroClass + ".g.cross";
        break;
      case 78: // N
        key = ".key." + zeroClass + ".a";
        break;
      case 74: // J
        key = ".key." + zeroClass + ".a.cross";
        break;
      case 77: // M
        key = ".key." + zeroClass + ".b";
        break;

      case 188: // , ;
      case keyCOne: // Q
        key = ".key." + oneClass + ".c";
        break;

      case 76: // L 
      case 50: // 2
        key = ".key." + oneClass + ".c.cross";
        break;
      case 190: // . :
      case 87: // W    
        key = ".key." + oneClass + ".d";
        break;
      case 192: // Ö ( GERMAN keyboard )
      case 51: //  3
        key = ".key." + oneClass + ".d.cross";
        break;

      case 189: // -_
      case 69: // E
        key = ".key." + oneClass + ".e";
        break;
      case 82:
        key = ".key." + oneClass + ".f";
        break;
      case 53:
        key = ".key." + oneClass + ".f.cross";
        break;
      case 84:
        key = ".key." + oneClass + ".g";
        break;

      case 54:
        key = ".key." + oneClass + ".g.cross";
        break;
      case keyAOne: // Z 
        key = ".key." + oneClass + ".a";
        break;
      case 55: // 7 
        key = ".key." + oneClass + ".a.cross";
        break;
      case 85: // U 
        key = ".key." + oneClass + ".b";
        break;

      case 73: // I 
        key = ".key." + twoClass + ".c";
        break;
      case 57: // 9 
        key = ".key." + twoClass + ".c.cross";
        break;
      case 79: // O (Ooohhhh)
        key = ".key." + twoClass + ".d";
        break;
      case 48: // 0 (NULL)
        key = ".key." + twoClass + ".d.cross";
        break;
      case 80: // P
        key = ".key." + twoClass + ".e";
        break;
      case 186: // Ü (German keyboard)
        key = ".key." + twoClass + ".f";
        break;

    }

    if (key) {
      if (up) {
        $(key).first().mouseup();
      } else {
        $(key).first().mousedown();
      }

      e.preventDefault();
      return false;
    }
  }

});

$("input[name=lowPass]").bind("change", function() {
  console.log("change detected!");
  
  lowPass = parseInt(this.value);
  lpFilter.frequency.setValue(lowPass);

});
$("input[name=highPass]").bind("change", function() {
  highPass = parseInt(this.value);
  hpFilter.frequency.setValue(highPass);
});

$("input[name=delayTime]").bind("change",function() {
  val = parseFloat(this.value);

  delayTime = val;
  feedbackDelay.delayTime.setValue(delayTime);
});
$("input[name=delayFeedback]").bind("change",function() {
  val = parseFloat(this.value);

  delayFeedback = val;
  feedbackDelay.feedback.setValue(delayFeedback);
});
$("input[name=delayMix]").change(function() {
  val = parseFloat(this.value);

  delayMix = val;
  feedbackDelay.mix.setValue(delayMix);

});

$("input[name=enableDelay]").change(function() {
  if (this.checked) {
    feedbackDelay.feedback.setValue($("input[name=delayFeedback]").val());
    feedbackDelay.mix.setValue($("input[name=delayMix]").val());
    feedbackDelay.delayTime.setValue($("input[name=delayTime]").val());

    $(this).parents("fieldset").find("input").not(this).removeAttr("disabled");
  } else {
    feedbackDelay.feedback.setValue(0);
    feedbackDelay.mix.setValue(0);
    feedbackDelay.delayTime.setValue(0.3);

    $(this).parents("fieldset").find("input").not(this).attr("disabled", "disabled");
  }
});

$("input[name=showKeyboardKeys]").change(function(e) {
  if (this.checked) {
    $("body").removeClass("hideKeyboardKeys");

  } else {
    $("body").addClass("hideKeyboardKeys");
  }
});

var keyCZero = 89; // Y (german)
var keyCOne = 81; // Q (german)
var keyAOne = 90; // Z (german)

$("select[name=keyboardLayout]").change(function() {
  if (this.value == "de") {
    keyCZero = 89;
    keyCOne = 81;
    keyAOne = 90;

    $("#germanY").html("Y");
    $("#germanZ").html("Z");
  } else {
    keyCZero = 90;
    keyAOne = 89;  
    
    if (this.value == "fr") {
      keyCOne = 65; // A
    } else {
    	keyCOne = 81;
    }

    $("#germanY").html("Z");
    $("#germanZ").html("Y");
  }

});


var userLang = navigator.language || navigator.userLanguage; 
if (userLang.indexOf("de")<0) {
  // keys should also be correct at the beginning on an english keyboard
  $("select[name=keyboardLayout]").val("en").trigger("change");
}

$("input[name=transposeUp]").change(function() {
  transposeUp = this.checked;
  $("input[name=showKeyboardKeys]").removeAttr("checked").change();
});


$("input.number").knobby();