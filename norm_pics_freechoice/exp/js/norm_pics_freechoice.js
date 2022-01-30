//GLOBAL VARIABLES//
var stimname = ''

function make_slides(f) {
  var   slides = {};

  slides.i0 = slide({
    name : "i0",
    start: function() {
      exp.startT = Date.now();
    }
  });

  slides.training = slide({
    name : "training",
    finish_training_and_go : function(e){
      exp.go();
    }
  });


  slides.single_trial = slide({
    name: "single_trial",
    present: exp.all_stims,
    present_handle: function(stim) {
      $(".err_part1").hide();
      $(".err_part2").hide();

      //hide additional qs until adjectives filled out
      $("#otherqs").hide();
      $("#languageq").hide();
      $("#extra_descript").hide();
      $("#extra_descript_instruct").hide();
      $("#submit_button").hide();

      $("#stim_img").attr("src", 'static/images/'+stim.item+".jpg");

      //Randomize
      $(function () {
        var parent = $("#otherqs");
        var divs = $("#otherqs tr");
        console.log(divs);
        while (divs.length) {
          parent.append(divs.splice(Math.floor(Math.random() * divs.length), 1)[0]);
        }
      });

      this.stim = stim;
      console.log(stim.item);
      stimname = stim.item;
    },

      next_qs : function(e){
        exp.adj1 = $("#adjective1").val();
        exp.adj2 = $("#adjective2").val();
        exp.adj3 = $("#adjective3").val();
        if(exp.adj1 == '' || exp.adj2 == '' || exp.adj3 == ''){
          $(".err_part1").show();
        } else {
          //Hide the first part
          $(".err_part1").hide();
          //$("#instructions_for_adjs").hide();
          $("#adj_table").hide();

          //Show the second part
          $("#next_qs").hide();
          $("#otherqs").show();
          $("#languageq").show();
          $("#extra_descript").show();
          $("#extra_descript_instruct").show();
          $("#submit_button").show();
      }
    },
      //response = $('input[name="likert"]:checked').val()
      submit_this : function(e){
        age = $("#age").val();
        occupation  = $("#occupation").val();
        wherefrom = $("#wherefrom").val();
        howspeak = $("#howspeak").val();
        if(age == '' ||
        occupation == '' || wherefrom == '' || howspeak == '')
        {
          $(".err_part2").show();
        } else {
            $(".err_part2").hide();

        var response = {
          'stim' : stimname,
          adj1 : exp.adj1,
          adj2 : exp.adj2,
          adj3 : exp.adj3,
          age : $("#age").val(),
          occupation : $("#occupation").val(),
          wherefrom : $("#wherefrom").val(),
          howspeak : $("#howspeak").val(),
          extra_descript : $("#extra_descript").val()
        };
        exp.data_trials.push(response);
        exp.go(); //use exp.go() if and only if there is no "present" data.
      }
    }
  });


  slides.subj_info =  slide({
    name : "subj_info",
    submit : function(e){
      lg = $("#language").val();
      age = $("#participantage").val();
      gend = $("#gender").val();
      educ = $("#education").val();
      if(lg == '' || age == '' || gend == '' || educ == '-1'){
          $(".err_part2").show();
      } else {
        $(".err_part2").hide();
      //if (e.preventDefault) e.preventDefault(); // I don't know what this means.
      exp.subj_data = {
        language : $("#language").val(),
        age : $("#age").val(),
        gender : $("#gender").val(),
        education : $("#education").val(),
        comments : $("#comments").val(),
      };
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  }
  });



  slides.thanks = slide({
    name : "thanks",
    start : function() {
      exp.data= {
        "trials" : exp.data_trials,
        "catch_trials" : exp.catch_trials,
        "system" : exp.system,
        "condition" : exp.condition,
        "subject_information" : exp.subj_data,
        "debrief_consent" : exp.consent,
        "time_in_minutes" : (Date.now() - exp.startT)/60000
      };
      console.log(turk);
      setTimeout(function() {turk.submit(exp.data);}, 1000);
    }
  });

  return slides;
}

/// init ///
function init() {


  exp.trials = [];
  exp.catch_trials = [];
  //THIS IS WHERE I NEED A LIST OF SRCS IMGS (see randm_stims)- should be a list of fnames (not audio)
  //exp.all_stims = _.shuffle(audio_fnames); //can randomize between subject conditions here. nb using underscore lib; just returns shuffled list of dicts
  exp.all_stims = _.shuffle(image_fnames); //can randomize between subject conditions here. nb using underscore lib; just returns shuffled list of dicts

  //exp.other_stims = _.shuffle(dances);
  exp.system = {
    Browser : BrowserDetect.browser,
    OS : BrowserDetect.OS,
    screenH: screen.height,
    screenUH: exp.height,
    screenW: screen.width,
    screenUW: exp.width
  };
  //blocks of the experiment:

  exp.structure=["i0", "training","single_trial", 'subj_info','thanks'];

  exp.data_trials = [];
  //make corresponding slides:
  exp.slides = make_slides(exp);

  exp.nQs = utils.get_exp_length(); //this does not work if there are stacks of stims (but does work for an experiment with this structure)
  //relies on structure and slides being defined

  $('.slide').hide(); //hide everything

  //make sure turkers have accepted HIT (or you're not in mturk)
  $("#start_button").click(function() {
    if (turk.previewMode) {
      $("#mustaccept").show();
    } else {
      $("#start_button").click(function() {$("#mustaccept").show();});
      exp.go();
    }
  });

  $(".response_button").click(function(){
    var val = $(this).val();
    _s.continue_button(val);
  });
  exp.go(); //show first slide
}
