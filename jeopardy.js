const BASE_API_URL = "http://jservice.io/api/";
const NUM_CATEGORIES = 6;
const NUM_CLUES_PER_CAT = 5;

// categories is the main data structure for the app; it should look like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: "4", showing: null},
//        {question: "1+1", answer: "2", showing: null}, ... 3 more clues ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null}, ...
//      ],
//    }, ...4 more categories ...
//  ]

let categories = [];

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids, eg [4, 12, 5, 9, 20, 1]
 */

async function getCategoryIds() {
  // ask for 100 categories [most we can ask for], so we can pick random
  let response = await axios.get(`${BASE_API_URL}categories`, {
    params: { count: 100 },
  });
  let catIds = response.data.map(c => c.id);
  return _.sampleSize(catIds, NUM_CATEGORIES);
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ... 3 more ...
 *   ]
 */

async function getCategory(catId) {
  let response = await axios.get(`${BASE_API_URL}category`, {
    params: { id: catId },
  });
  let cat = response.data;
  let randomClues = _.sampleSize(cat.clues, NUM_CLUES_PER_CAT).map(c => ({
    question: c.question,
    answer: c.answer,
    showing: null,
  }));
  return { title: cat.title, clues: randomClues };
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM-QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initially, just show a "?" where the question/answer would go.)
 */

function fillTable() {
  // clear the board if it's already filled
  $("#jeopardy thead").empty();
  $("#jeopardy tbody").empty();

  // Add row with headers for categories
  let $tr = $("<tr>");
  for (let category of categories) {
    $tr.append($("<th>").text(category.title));
  }
  $("#jeopardy thead").append($tr);

  // Add rows with questions for each category
  const $tBody = $("#jeopardy tbody");
  $tBody.empty();
  for (let clueIdx = 0; clueIdx < NUM_CLUES_PER_CAT; clueIdx++) {
    let $tr = $("<tr>");
    for (let catIdx = 0; catIdx < NUM_CATEGORIES; catIdx++) {
      $tr.append(
          $("<td>")
              .attr("id", `${catIdx}-${clueIdx}`)
              .append($("<i>").addClass("fas fa-question-circle fa-3x")));
    }
    $tBody.append($tr);
  }
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
  let $tgt = $(evt.target);
  let id = $tgt.attr("id");
  let [catId, clueId] = id.split("-");
  let clue = categories[catId].clues[clueId];

  let msg;

  if (!clue.showing) {
    msg = clue.question;
    clue.showing = "question";
  } else if (clue.showing === "question") {
    msg = clue.answer;
    clue.showing = "answer";
    $tgt.addClass("disabled");
  } else {
    // already showing answer; ignore
    return;
  }

  // Update text of cell
  $tgt.html(msg);
}

/** Setup game data and board:
 * - get random category Ids
 * - get data for each category
 * - call fillTable to create HTML table
 */

async function setupGameBoard() {
  let catIds = await getCategoryIds();

  categories = [];

  for (let catId of catIds) {
    categories.push(await getCategory(catId));
  }

  fillTable();
}

/** Start game: show loading state, setup game board, stop loading state */

async function setupAndStart() {
  // going to load data; show loading spinner; hide (re)start button & board
  $("#spin-container").show();
  $("#start").hide();
  $("#jeopardy").hide();

  await setupGameBoard();

  // finished setting up board: hide spinner; show button & board
  $("#jeopardy").show();
  $("#start").text("Restart!").show();
  $("#spin-container").hide();
}

/** At start:
 *
 * - Add a click handler to your start button that will run setupAndStart
 * - Add a click handler to your board that will run handleClick
 *   when you click on a clue
 */

$("#start").on("click", setupAndStart);
// bind the handler for clicking on table cells --- only need to do this once
$("#jeopardy").on("click", "td", handleClick);
