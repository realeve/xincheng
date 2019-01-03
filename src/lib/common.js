function randomsort(a, b) {
  return Math.random() > 0.5 ? -1 : 1;
}

function getRandomArr(len) {
  let arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr.sort(randomsort);
}

// 乱序题目
function randomArr(arr) {
  let rdmArr = getRandomArr(arr.length);
  let newQuestions = [];
  rdmArr.forEach((item, i) => {
    arr[item].questionId = rdmArr[i];
    newQuestions.push(arr[item]);
  });
  return newQuestions;
}

// 乱序题目和答案
function randomAnswer(questions) {
  return questions.map((question, i) => {
    // 将题目选项乱序.
    let rdmArr = getRandomArr(question.option.length);

    // 存储乱序后的选项数组
    let newQuestions = [];
    rdmArr.forEach((item) => {
      newQuestions.push(question.option[item]);
    });

    let answer = question.answer;
    // 如果答案有多个
    let newAnswer = [];
    if (answer.length > 1) {
      answer.forEach((rightAnswer, i) =>
        rdmArr.forEach((item, i) => {
          if (item == rightAnswer) {
            newAnswer.push(i);
          }
        })
      );
    } else {
      // 重新排序后的新答案
      rdmArr.forEach((item, i) => {
        if (item == answer) {
          newAnswer.push(i);
        }
      });
    }
    newAnswer.sort((a, b) => a - b);
    Object.assign(question, {
      option: newQuestions,
      answer: newAnswer
    });
    return question;
  });
}

function getPaperData(json) {
  let questions = randomArr(json);
  let randomQuestions = randomAnswer(questions);

  var alphaArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  if (typeof randomQuestions[0].option[0] != 'string') {
    return randomQuestions;
  }
  return randomQuestions.map((item) => {
    item.option = item.option.map((value, key) => {
      return {
        key,
        value: alphaArr[key] + '、' + value
      };
    });
    return item;
  });
}

function getHarmoney(randomQuestions) {
  var alphaArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  if (typeof randomQuestions[0].option[0] != 'string') {
    return randomQuestions;
  }

  return randomQuestions.map((item) => {
    if (!item.option) {
      return item;
    }
    item.option = item.option.map((value, key) => {
      return {
        key,
        value: alphaArr[key] + '、' + value
      };
    });
    return item;
  });
}

export default {
  getRandomArr,
  randomArr,
  randomAnswer,
  getPaperData,
  getHarmoney
};
