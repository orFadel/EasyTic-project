function toggleQuestions(category) {
  // Hide all question lists
  document.querySelectorAll('.question-list').forEach(function (list) {
    list.classList.remove('active');
  });

  // Show the selected question list
  const selectedList = document.getElementById(category + '-questions');
  if (selectedList) {
    selectedList.classList.add('active');
  }
}

function toggleAnswer(questionContainer) {
  // Toggle the visibility of the answer related to the clicked question
  const answer = questionContainer.nextElementSibling;
  answer.classList.toggle('active');
}

function submitForm() {
  //disabled text area
  document.getElementById('message').disabled = true;
  //disabled submit button
  document.getElementById('submitButton').style.display = 'none';
  //success message appear
  document.getElementById('successMessage').style.display = 'block';
}
