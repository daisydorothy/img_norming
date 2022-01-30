//GLOBAL VARIABLES//


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
    present: exp.descriptors, // change from all_stims to descriptor
    present_handle: function(descriptor) {
      this.trial_start = Date.now();
      $(".err").hide();

      document.getElementById("insert_descriptor").innerHTML = descriptor.item;
      $("#insert_descriptor").show();


      //'Click on all the people that are '
      //document.getElementById("insert_descriptor_nonapplicable").innerHTML = "If you don't think any of them look like they are "+descriptor.item+" state why here:";
      //$("#insert_descriptor_nonapplicable").show();


      function randomize_ladies (){
        //exp.imgs = _.shuffle(img_fnames); //add this in to keep randomizing imgs (ie sample w replacement)
        // otherwise, set up is s.t. each set of girls is removed (popped) from the array
        exp.display_imgs = []
        for (var i = 0; i < exp.NUM_COLS; i++){
          popped = exp.imgs.pop();
          exp.display_imgs.push(popped); // a dict {item: vt hn bn}
        };

        //Put the full set of ladies in a list by stim name (rather than as dict values)
        exp.full_set = []
        for (var i = 0; i < exp.display_imgs.length; i++) {
          var img_id = exp.display_imgs[i]["item"]
          exp.full_set.push(img_id);
        }
        console.log(exp.full_set);

        // console.log('display imgs length' + exp.display_imgs.length);
        // console.log('imgs length ' +exp.imgs.length);

        if (document.getElementById("randomized_lady_table") != null){
            $("#randomized_lady_table tr").remove();
          }

        var table = document.createElement("table");

        while(exp.display_imgs.length) {
          var tr = document.createElement('tr');
          for (i = 0; i < exp.NUM_COLS; i++) {
            if (!exp.display_imgs.length) {
              break;
            }
            //Could fix this so that it still serves up the remaining girls (ie doesnt just break but has fewer cols)

            var img_td = document.createElement('td');
            var empty_td = document.createElement('td');

            empty_td.innerHTML = "&nbsp&nbsp&nbsp&nbsp"; // just adding extra space between cols
            var randomIndex = Math.floor(Math.random() * exp.display_imgs.length);

            var img_value = exp.display_imgs.splice(randomIndex, 1)[0];
            var img = document.createElement('img');
            img.src = 'static/images/'+img_value.item+'.jpg';
            img.id = img_value.item;
            img.onclick = function(){
              var id = $(this).attr("id");
              //If the id is already in the list, remove it
              if (exp.clicked.includes(id)){
                var index = exp.clicked.indexOf(id);
                exp.clicked.splice(index, 1);
                console.log(exp.clicked);

                $(this).css("border","2px transparent");
                document.getElementById(this).style.border = '';

              };

              exp.clicked.push(id);
              console.log(exp.clicked);
              $(this).css("border","2px solid red");

            };
            img.value = img_value.item;
            img_td.appendChild(img);
            tr.appendChild(img_td);
            tr.appendChild(empty_td);
            //tr.appendChild(empty_td); // this is just to add extra space
          }
          table.appendChild(tr);
          table.setAttribute('id', 'randomized_lady_table')
          document.getElementById("imgwrapper").appendChild(table);
        }
        console.log(table);
        console.log(exp.clicked);
        console.log('ladies, i am randomizing!!!');
      };


      //$("#imgwrapper").hide();
      randomize_ladies();
      $("#imgwrapper").show();
      this.descriptor = descriptor;




      descriptor_name = descriptor.item;
      if (descriptor_name == 'with blonde hair' || descriptor_name == 'wearing pants'){
        document.getElementById("insert_frame").innerHTML = 'Click on all the people:';
      } else{
        document.getElementById("insert_frame").innerHTML = 'Click on all the people that look like they are:';
      }
      $("#insert_frame").show();

      console.log(descriptor_name);
      console.log(this.descriptor);
      //this.descriptor = descriptor;

    },


      continue_this : function(e){
        if (exp.clicked.length == 0 & $("#why_no_select").val() == ''){
          $(".err").show();
        }
        else {
          // CLEAR CHECKBOX
          this.log_responses();
          _stream.apply(this);
          $('textarea').val('');
          exp.clicked = [];
          $(".err_part2").hide();
        }
        //$("#imgwrapper").show();
      },

      log_responses : function (){
        exp.data_trials.push({
          "rt" : Date.now() - _s.trial_start,
          'descriptor' : descriptor_name,
          'ladies_selected' : exp.clicked,
          'why_no_select' : $("#why_no_select").val(),
          'full_set' : exp.full_set,

        });
      }
      //};
      // exp.data_trials.push(response);
      // //this.log_responses();
      // _stream.apply(this);

  //  }
  });

  //then exp.go
  //keep going until adj-stims are done
  //initialize set of Girls at the beginning of exp

  //response = $('input[name="likert"]:checked').val()
  //   submit_this : function(e){
  //     age = $("#age").val();
  //     occupation  = $("#occupation").val();
  //     wherefrom = $("#wherefrom").val();
  //     howspeak = $("#howspeak").val();
  //     if(age == '' ||
  //     occupation == '' || wherefrom == '' || howspeak == '')
  //     {
  //       $(".err_part2").show();
  //     } else {
  //         $(".err_part2").hide();
  //
  //     var response = {
  //       'stim' : stimname, // THis should be the adjective displayed
  //       adj1 : exp.adj1,
  //       adj2 : exp.adj2,
  //       adj3 : exp.adj3,
  //       age : $("#age").val(),
  //       occupation : $("#occupation").val(),
  //       wherefrom : $("#wherefrom").val(),
  //       howspeak : $("#howspeak").val(),
  //       extra_descript : $("#extra_descript").val()
  //     };
  //     exp.data_trials.push(response);
  //     exp.go(); //use exp.go() if and only if there is no "present" data.
  //   }
  // }



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

  //HERE: handle the shuffling
  exp.descriptors = _.shuffle(descriptors);
  //exp.all_imgs = _.shuffle(img_fnames); //can randomize between subject conditions here. nb using underscore lib; just returns shuffled list of dicts
  exp.imgs = _.shuffle(img_fnames);
  //exp.display_imgs = [];

  exp.clicked = [];
  exp.NUM_COLS = 8
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

  exp.structure=["i0", "single_trial", 'subj_info','thanks'];

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
