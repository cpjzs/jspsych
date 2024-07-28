# Flanker任务实验教程

## HTML结构

下面是一个完整的HTML结构，用于创建一个Flanker任务实验网页。

```
html复制代码<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Flanker任务实验</title>
  <script src="jspsych/jspsych.js"></script>
  <link href="jspsych/css/jspsych.css" rel="stylesheet">
  <script src="jspsych/plugins/jspsych-html-keyboard-response.js"></script>
  <script src="jspsych/plugins/jspsych-image-keyboard-response.js"></script>
  <script src="jspsych/plugins/jspsych-instructions.js"></script>
  <style>
    body {
      display: flex;
      flex-direction: column;
      min-height: 100vh; 
      margin: 0;
      font-family: Arial, sans-serif;
    }
    header {
      background-color: #333;
      color: white;
      padding: 10px;
      text-align: center;
    }
    main {
      flex: 1; 
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    footer {
      background-color: #333;
      color: white;
      padding: 10px;
      text-align: center;
    }
  </style>
</head>
<body>
  <header>
    <h1>Flanker任务实验</h1>
  </header>
  
  <main>
  </main>

  <footer>
  </footer>

  <script src="experiment.js"></script>
</body>
</html>
```

### 解释

1. `<head>`部分包含了页面的元数据、jsPsych库和插件的引入、以及一些基本的样式定义。
2. `<body>`部分包含了页面的结构，包括`<header>`、`<main>`和`<footer>`区域。
3. `<script src="experiment.js"></script>`用于引入实验的JavaScript代码文件。

## JavaScript代码

在`experiment.js`文件中，我们定义了Flanker任务实验的具体逻辑。

```
javascript复制代码var jsPsych = initJsPsych({
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
```

### 解释

1. **初始化jsPsych**:

   ```
   javascript复制代码var jsPsych = initJsPsych({
     on_finish: function() {
       jsPsych.data.displayData();
     }
   });
   ```

   初始化jsPsych并定义实验结束时的回调函数。

2. **时间线定义**:

   ```
   javascript
   复制代码
   var timeline = [];
   ```

3. **欢迎屏幕**:

   ```
   javascript复制代码var welcome = {
     type: jsPsychHtmlKeyboardResponse,
     stimulus: '欢迎参加实验。按任意键继续。'
   };
   timeline.push(welcome);
   ```

4. **指示屏幕**:

   ```
   javascript复制代码var instructions = {
     type: jsPsychInstructions,
     pages: [
       '在这个实验中，你将会看到一些箭头和图片。',
       '请判断中间的箭头方向，左按F，右按J。',
       '请尽快且准确地做出判断。'
     ],
     show_clickable_nav: true
   };
   timeline.push(instructions);
   ```

5. **固定注视点**:

   ```
   javascript复制代码var fixation = {
     type: jsPsychHtmlKeyboardResponse,
     stimulus: '<p style="font-size: 48px;">+</p>',
     choices: "NO_KEYS",
     trial_duration: 500
   };
   ```

6. **情绪图片**:

   ```
   javascript复制代码var emotion_image = {
     type: jsPsychImageKeyboardResponse,
     stimulus: 'emotion_image.jpg', 
     choices: "NO_KEYS",
     trial_duration: 1000
   };
   ```

7. **Flanker任务刺激**:

   ```
   javascript复制代码var flanker_stimuli = [
     { stimulus: '<<<<<', correct_response: 'f' },
     { stimulus: '>>>>>', correct_response: 'j' },
     { stimulus: '<<><<', correct_response: 'f' },
     { stimulus: '>>><>', correct_response: 'j' }
   ];
   ```

8. **Flanker任务试次**:

   ```
   javascript复制代码var flanker_trial = {
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
   ```

9. **练习阶段**:

   ```
   javascript复制代码var practice = {
     timeline: [fixation, emotion_image, flanker_trial],
     timeline_variables: flanker_stimuli,
     repetitions: 2 
   };
   ```

10. **练习反馈**:

    ```
    javascript复制代码var practice_feedback = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: function() {
        var correct_trials = jsPsych.data.get().filter({task: 'flanker', correct: true}).count();
        var total_trials = jsPsych.data.get().filter({task: 'flanker'}).count();
        var accuracy = Math.round((correct_trials / total_trials) * 100);
        return `<p>你的正确率是 ${accuracy}% 。</p><p>按任意键继续。</p>`;
      }
    };
    ```

11. **练习循环节点**:

    ```
    javascript复制代码var practice_node = {
      timeline: [practice, practice_feedback],
      loop_function: function(data) {
        var correct_trials = jsPsych.data.get().filter({task: 'flanker', correct: true}).count();
        return correct_trials < 6; 
      }
    };
    timeline.push(practice_node);
    ```

12. **练习结束提示**:

    ```
    javascript复制代码var practice_end = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: '练习结束。按任意键继续到正式实验。'
    };
    timeline.push(practice_end);
    ```

13. **测试阶段**:

    ```
    javascript复制代码var test = {
      timeline: [fixation, emotion_image, flanker_trial],
      timeline_variables: flanker_stimuli,
      repetitions: 30 
    };
    timeline.push(test);
    ```

14. **运行实验**:

    ```
    javascript
    复制代码
    jsPsych.run(timeline);
    ```

通过以上步骤，我们定义了一个完整的Flanker任务实验，包括欢迎页面、指示页面、练习阶段、练习反馈和正式测试阶段。
