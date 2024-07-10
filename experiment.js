
var jsPsych = initJsPsych({
  on_finish: function() {
    jsPsych.data.displayData();
  }
});

var timeline = [];

var welcome = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '欢迎参加实验。按任意键继续。'
};
timeline.push(welcome);

var instructions = {
  type: jsPsychInstructions,
  pages: [
    '在这个实验中，你将会看到一些箭头和图片。',
    '请判断中间的箭头方向，左按F，右按J。',
    '请尽快且准确地做出判断。'
  ],
  show_clickable_nav: true
};
timeline.push(instructions);

var fixation = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<p style="font-size: 48px;">+</p>',
  choices: "NO_KEYS",
  trial_duration: 500
};

var emotion_image = {
  type: jsPsychImageKeyboardResponse,
  stimulus: 'emotion_image.jpg', 
  choices: "NO_KEYS",
  trial_duration: 1000
};

var flanker_stimuli = [
  { stimulus: '<<<<<', correct_response: 'f' },
  { stimulus: '>>>>>', correct_response: 'j' },
  { stimulus: '<<><<', correct_response: 'f' },
  { stimulus: '>>><>', correct_response: 'j' }
];

var flanker_trial = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: jsPsych.timelineVariable('stimulus'),
  choices: ['f', 'j'],
  prompt: "<p>请判断中间的箭头方向，左按F，右按J。</p>",
  data: {
    task: 'flanker',
    correct_response: jsPsych.timelineVariable('correct_response')
  },
  on_finish: function(data) {
    data.correct = data.response == data.correct_response;
  }
};

var practice = {
  timeline: [fixation, emotion_image, flanker_trial],
  timeline_variables: flanker_stimuli,
  repetitions: 2 
};

var practice_feedback = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function() {
    var correct_trials = jsPsych.data.get().filter({task: 'flanker', correct: true}).count();
    var total_trials = jsPsych.data.get().filter({task: 'flanker'}).count();
    var accuracy = Math.round((correct_trials / total_trials) * 100);
    return `<p>你的正确率是 ${accuracy}% 。</p><p>按任意键继续。</p>`;
  }
};

var practice_node = {
  timeline: [practice, practice_feedback],
  loop_function: function(data) {
    var correct_trials = jsPsych.data.get().filter({task: 'flanker', correct: true}).count();
    return correct_trials < 6; 
  }
};

timeline.push(practice_node);

var practice_end = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '练习结束。按任意键继续到正式实验。'
};
timeline.push(practice_end);

var test = {
  timeline: [fixation, emotion_image, flanker_trial],
  timeline_variables: flanker_stimuli,
  repetitions: 30 
};
timeline.push(test);

jsPsych.run(timeline);
