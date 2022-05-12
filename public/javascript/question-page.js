window.addEventListener('DOMContentLoaded', () => {
  let threadViewBtn = document.querySelector('.view_thread_btn')

  let listItems = document.querySelectorAll('.listItem')
  let answerSections = document.querySelectorAll('.answer_section')
  let postAnswerBtns = document.querySelectorAll('.post_answer')

  let userProfileLinks = document.querySelectorAll('.user_profile_link')



  /* HOVER EVENT OVER USERNAMES */
  for (let i = 0; i < userProfileLinks.length; i++) {
    const link = userProfileLinks[i];
    link.addEventListener('mouseover', function(){
      link.style.textDecoration = 'underline'
    })
    link.addEventListener('mouseout', function(){
      link.style.textDecoration = ''
    })
  }


  /* POSTING & VIEWING ANSWERS */
  for (let i = 0; i < answerSections.length; i++) {
    let clicked = false;
    postAnswerBtns[i].addEventListener('click', function(event){
      if(clicked === false){
        answerSections[i].style.display = 'block';
        clicked = true;
      } else {
        answerSections[i].style.display = 'none';
        clicked = false;
      }
    })
  }



  /* HOVER EVENTS OVER SIDEBAR LIST ITEMS */
  for (let i = 0; i < listItems.length; i++) {
    const item = listItems[i];

    item.addEventListener('mouseover', ()=> {
      item.style.backgroundColor = '#7C8D88';
    })
    item.addEventListener('mouseout', ()=> {
      item.style.backgroundColor = '';
    })
  }



})
