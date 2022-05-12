window.addEventListener('DOMContentLoaded', () => {
  let threadViewBtn = document.querySelector('.view_thread_btn')

  let listItems = document.querySelectorAll('.listItem')
  let answerSections = document.querySelectorAll('.answer_section')
  let postAnswerBtns = document.querySelectorAll('.post_answer')
  let submitAnswerForms = document.querySelectorAll('.answer-inner-container')
  let userProfileLinks = document.querySelectorAll('.user_profile_link')
  let submitAnswerButtons = document.querySelectorAll('.submit-answer-button')


    // THIS is for submitting answers
    for (let i = 0; i < submitAnswerButtons.length; i++) {
      const subButton = submitAnswerButtons[i]
      subButton.addEventListener('click', async (e) => {
        e.preventDefault();
        const content = document.getElementById(`answer-content-${subButton.id}`)

        if(!content.value){
          return
        }

        const response = await fetch('/answers', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            questionId: subButton.id,
            content: content.value,
            userId: content.name
          })
        })

        const data = await response.json()
        
        if(data.message === "Success"){
          const answerSection =  document.getElementsByClassName(`answer-section-${subButton.id}`)[0]
          const jUser = await fetch('/users', {
            method: 'PATCH',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
              id: content.name
            })
          })

          const user = await jUser.json()
          
          

          const newHtml = `<div class="answer">
          <div class="answer_head">
          <img class="user_profile_pic" src=${user.picSrc}></div>
          </div><p class="answer_user_name">${user.fullName}</p>
          <p class="answer_creds"></p>
          <p class="answer_date">${new Date()}</p>
          <div class="answer_content"><p class="answer_content">${content.value}</p></div>
          `

         
          answerSection.innerHTML = newHtml + answerSection.innerHTML
          content.value = ''
        }


      })
    }




  /* HOVER EVENT OVER USERNAMES */
  for (let i = 0; i < userProfileLinks.length; i++) {
    const link = userProfileLinks[i];
    link.addEventListener('mouseover', function () {
      link.style.textDecoration = 'underline'
    })
    link.addEventListener('mouseout', function () {
      link.style.textDecoration = ''
    })
  }


  /* POSTING & VIEWING ANSWERS */
  for (let i = 0; i < answerSections.length; i++) {
    let clicked = false;
    postAnswerBtns[i].addEventListener('click', function (event) {
      if (clicked === false) {
        submitAnswerForms[i].style.display = 'flex';
        answerSections[i].style.display = 'block';
        clicked = true;
      } else {
        submitAnswerForms[i].style.display = 'none';
        answerSections[i].style.display = 'none';
        clicked = false;
      }
    })
  }



  /* HOVER EVENTS OVER SIDEBAR LIST ITEMS */
  for (let i = 0; i < listItems.length; i++) {
    const item = listItems[i];

    item.addEventListener('mouseover', () => {
      item.style.backgroundColor = '#7C8D88';
    })
    item.addEventListener('mouseout', () => {
      item.style.backgroundColor = '';
    })
  }



})
