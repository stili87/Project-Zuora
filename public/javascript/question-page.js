
window.addEventListener('DOMContentLoaded', () => {
  let threadViewBtn = document.querySelector('.view_thread_btn')
  let listItems = document.querySelectorAll('.listItem')
  let answerSections = document.querySelectorAll('.answer_section')
  let postAnswerBtns = document.querySelectorAll('.post_answer')
  let submitAnswerForms = document.querySelectorAll('.answer-inner-container')
  let userProfileLinks = document.querySelectorAll('.user_profile_link')
  let submitAnswerButtons = document.querySelectorAll('.submit-answer-button')
  let deleteButtons = document.querySelectorAll('.delete_answer_btn')
  let editButtons = document.querySelectorAll('.edit_answer_btn');

  for (let i = 0; i < deleteButtons.length; i++) {
    const deleteBtn = deleteButtons[i];
    deleteBtn.addEventListener('click', async (e) => {
      const response = await fetch(`/answers/delete/${deleteBtn.name}`, {
        method: 'DELETE'
      });
      const resJas = await response.json()
      const answer = document.getElementById(`answer-div-${deleteBtn.name}`);
      const answerComments = document.getElementById(`full_comment_${deleteBtn.name}`);
      const commentHead = document.getElementById(`comment_head_${deleteBtn.name}`);
      if(commentHead){
        commentHead.remove();
      }
      if(answerComments){
        answerComments.remove();
      }
      answer.remove();;
    })
  }

  // THIS is for submitting answers
  for (let i = 0; i < submitAnswerButtons.length; i++) {
    const subButton = submitAnswerButtons[i]
    subButton.addEventListener('click', async (e) => {
      e.preventDefault();
      const content = document.getElementById(`answer-content-${subButton.id}`)
      
      if (!content.value) {
        alert("You must answer the question")
        return
      }else if(content.length > 1000){
        alert('Answer is too long')
        return
      }

      const response = await fetch('/answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: subButton.id,
          content: content.value,
          userId: content.name
        })
      })

      const data = await response.json()

      if (data.message === "Success") {
        const answerSection = document.getElementsByClassName(`answer-section-${subButton.id}`)[0]
        const jUser = await fetch('/users', {
          method: 'PATCH',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: content.name
          })
        })

        const user = await jUser.json()
        const newAnswer = document.createElement('div')
        newAnswer.innerHTML = `<div class="answer_section answer-section-${data.id}" style="display: block;">
        <div class="answer" id="answer-div-${data.id}"><div class="answer_head">
        <img class="user_profile_pic" src=${user.picSrc}>
        <div class="answer_details"><p class="answer_user_name">${user.fullName}</p>
        <p class="answer_date">${new Date()}</p></div></div><div class="answer_content">
        <p class="p_answer_content" id="answer_content_${data.id}">${content.value}</p>
        <button id="tempReply_${data.id}" class="show_comments_btn reply_answer_btn">Reply</button>
        <button class="edit_answer_btn" id="temp_edit_${data.id}" name=${data.id}>Edit</button>
        <button class="delete_answer_btn" name=${data.id} id="tempDelete_${data.id}">Delete</button></div></div>
        <div class="comment_section"><div class="entire_comments" id="full_comment_${data.id}"></div></div>
        `

        answerSection.prepend(newAnswer)
        content.value = ''
        const newDeleteButton = document.getElementById(`tempDelete_${data.id}`)
        newDeleteButton.addEventListener('click', async (e) => {
          const response = await fetch(`/answers/delete/${newDeleteButton.name}`, {
            method: 'DELETE'
          });
          const resJas = await response.json()
          const answer = document.getElementById(`answer-div-${newDeleteButton.name}`);
          const answerComments = document.getElementById(`full_comment_${newDeleteButton.name}`);
          const commentHead = document.getElementById(`comment_head_${newDeleteButton.name}`);
          if(commentHead){
            commentHead.remove();
          }
          if(answerComments){
            answerComments.remove();
          }
          answer.remove();;
        })
        const newEditButton = document.getElementById(`temp_edit_${data.id}`)
        newEditButton.addEventListener('click', (e) =>{
          const answerContent = document.getElementById(`answer_content_${newEditButton.name}`);
          const answerInnerText = answerContent.innerText;
          answerContent.innerHTML = `<input type="text" id="edit_box_${newEditButton.name}" value="${answerInnerText}"></input><button class="edit_answer_btn" id="edit_button_${newEditButton.name}">Submit Edit</button>`;
          newEditButton.style.display = 'none';
  
  
          const submitEditButton = document.getElementById(`edit_button_${newEditButton.name}`);
          submitEditButton.addEventListener('click', async (e) => {
            const newContent = document.getElementById(`edit_box_${newEditButton.name}`).value;
            if (!newContent) {
              alert('Please enter an answer')
            } else if(newContent.length > 1000){
              alert('Answer is too long')
            }else {
              answerContent.innerHTML = newContent;
              newEditButton.style.display = 'block';
              const response = await fetch(`/answers/edit/${newEditButton.name}`, {
                method: 'PATCH',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  content: newContent
                })
              })
            }
        })
  
      })

      const replyButton = document.getElementById(`tempReply_${data.id}`)
      replyButton.setAttribute(`ansId`, data.id)
      replyButton.setAttribute('userId', data.userId)
      replyButton.addEventListener('click', async (e) => {
        const ansId = replyButton.getAttribute('ansId')
        const usrId = replyButton.getAttribute('userId')
        const answerSection = document.getElementById(`answer-div-${ansId}`)
        const newCommentBox = document.createElement('textarea')
        const newCommentBoxHead = document.createElement('h4')
        const checkBox = document.getElementById(`new_comment_${ansId}`)
        const submitButton = document.createElement('button')
        if(!checkBox){
          newCommentBoxHead.innerText = 'Leave a Comment Below'
          newCommentBoxHead.style.textAlign = 'center'
          newCommentBoxHead.style.marginTop = '7px'
          newCommentBox.id = `new_comment_${ansId}`
          newCommentBox.style.marginLeft = "135px"
          newCommentBox.style.marginTop = "10px"
          newCommentBox.rows = 6
          newCommentBox.cols = 35
          submitButton.innerText = "Submit Comment"
          submitButton.className = "reply_answer_btn"
          submitButton.style.marginLeft = "225px"
          answerSection.appendChild(newCommentBoxHead)
          answerSection.appendChild(newCommentBox)
          answerSection.appendChild(submitButton)
    
          submitButton.addEventListener('click', async (e)=> {
            const content = newCommentBox.value
            const answerId = ansId
            const userId = usrId
            if (!content) {
              alert("You must type a comment")
              return
            }else if (content.length > 500){
              alert("Your comment is too long")
              return
            }
            const res = await fetch(`/comments/add`, {
              method: "POST",
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                answerId,
                content,
                userId
            })
          })


          const data = await res.json()
          const jUser = await fetch('/users', {
              method: 'PATCH',
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: userId
              })
            })
            const user = await jUser.json()
    
    
          newCommentBox.remove()
          newCommentBoxHead.remove()
          submitButton.remove()

          const commentsSection = document.getElementById(`full_comment_${ansId}`);
          const newTotalComment = document.createElement('div')
          let newCommentDivInner = `
            <div class="total_comment total_comment_${data.id}" id="comment_answer_${data.id}" name="${data.id}">
            <div class="comment_head">
            <img class="user_profile_pic_comment" src="${user.picSrc}">
            <div class="user_comment_details">
            <p class="user_of_comment">${user.fullName}</p>
            <p>${new Date}</p>
            </div></div>
            <div class="comment_body">
            <p class="comment_content" id="comment_content_${data.id}">${content}</p>
            <button class="edit_comment_btn" id="tempEdit_${data.id}" name="${data.id}">Edit</button>
            <button class="delete_comment_btn" id="tempDelete_${data.id}" name="${data.id}">Delete</button>
            </div>
            </div>
          `
            
            newTotalComment.innerHTML = newCommentDivInner
            commentsSection.prepend(newTotalComment)
    
    
            const deleteCommentButton = document.getElementById(`tempDelete_${data.id}`)

              deleteCommentButton.addEventListener('click', async () => {

                const commentToDelete = document.querySelector(`.total_comment_${data.id}`)
                commentToDelete.remove()
                const response = await fetch(`/comments/delete/${data.id}`, {
                  method: 'DELETE'
                })
              })
            
              const editCommentBtn = document.getElementById(`tempEdit_${data.id}`)
              editCommentBtn.addEventListener('click', () => {
                const commentContent = document.getElementById(`comment_content_${data.id}`);
                const commentInnerText = commentContent.innerText;
            
                commentContent.innerHTML = `<input type="text" id="edit_box_${data.id}" value="${commentInnerText}"></input><button class="edit_comment_btn" id="edit_button_${data.id}">Submit Edit</button>`;
                editCommentBtn.style.display = 'none';
            
                const submitCommentEditBtn = document.getElementById(`edit_button_${data.id}`);
                submitCommentEditBtn.addEventListener('click', async () => {
                  const newComment = document.getElementById(`edit_box_${data.id}`).value;
                  if (!newComment) {
                    alert('Please enter a comment.')
                    return
                  }else if (newComment.length > 500){
                    alert("Your comment is too long")
                    return
                  } else {
                    commentContent.innerHTML = newComment;
                    editCommentBtn.style.display = 'block';
            
                    const response = await fetch(`/comments/edit/${editCommentBtn.name}`, {
                      method: 'PATCH',
                      headers: {'Content-Type': 'application/json'},
                      body: JSON.stringify({
                        content: newComment
                      })
                    })
                  }
                })
                })
    
    
    
        })
      }})
        ///////////////////insert above this }
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
  const answerSect = answerSections[i]
  const postAnswerBtn = document.getElementById(`post_answer_${answerSect.id}`)
  const submitAnswerForm = document.getElementById(`inner_container_${answerSect.id}`)
  let clicked = false;
  postAnswerBtn.addEventListener('click', function (event) {
    if (clicked === false) {
      submitAnswerForm.style.display = 'flex';
      answerSect.style.display = 'block';
      clicked = true;
    } else {
      submitAnswerForm.style.display = 'none';
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

///Editing answer button
for (let i = 0; i < editButtons.length; i++) {
  const editButton = editButtons[i];

  editButton.addEventListener('click', async (e) => {
    const answerContent = document.getElementById(`answer_content_${editButton.name}`);
    const answerInnerText = answerContent.innerText;
    answerContent.innerHTML = `<input type="text" id="edit_box_${editButton.name}" value="${answerInnerText}"></input><button class="edit_answer_btn" id="edit_button_${editButton.name}">Submit Edit</button>`;
    editButton.style.display = 'none';


    const submitEditButton = document.getElementById(`edit_button_${editButton.name}`);
    submitEditButton.addEventListener('click', async (e) => {
      const newContent = document.getElementById(`edit_box_${editButton.name}`).value;
      if (!newContent) {
        alert('Please enter an answer')
        return
      }else if(newContent.length > 1000){
        alert('Answer is too long')
        return
      } else {
        answerContent.innerHTML = newContent;
          editButton.style.display = 'block';
          const response = await fetch(`/answers/edit/${editButton.name}`, {
            method: 'PATCH',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              content: newContent
            })
          })
        }
      })
    })
  }

  /* EDIT FOR COMMENTS */
  const editCommentBtns = document.querySelectorAll('.edit_comment_btn')

  for (let i = 0; i < editCommentBtns.length; i++) {
    const editCommentBtn = editCommentBtns[i];

    editCommentBtn.addEventListener('click', () => {
    const commentContent = document.getElementById(`comment_content_${editCommentBtn.name}`);
    const commentInnerText = commentContent.innerText;

    commentContent.innerHTML = `<input type="text" id="edit_box_${editCommentBtn.name}" value="${commentInnerText}"></input><button class="edit_comment_btn" id="edit_button_${editCommentBtn.name}">Submit Edit</button>`;
    editCommentBtn.style.display = 'none';

    const submitCommentEditBtn = document.getElementById(`edit_button_${editCommentBtn.name}`);
    submitCommentEditBtn.addEventListener('click', async () => {
      const newComment = document.getElementById(`edit_box_${editCommentBtn.name}`).value;
      if (!newComment) {
        alert('Please enter a comment.')
        return
      }else if (newComment.length > 500){
        alert("Your comment is too long")
        return
      } else {
        commentContent.innerHTML = newComment;
        editCommentBtn.style.display = 'block';

        const response = await fetch(`/comments/edit/${editCommentBtn.name}`, {
          method: 'PATCH',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            content: newComment
          })
        })
      }
    })
    })
  }

// DELETE COMMENT
const deleteCommentButtons = document.getElementsByClassName('delete_comment_btn')

for (let i = 0; i < deleteCommentButtons.length; i++) {
  const deleteCommentBtn = deleteCommentButtons[i];

  deleteCommentBtn.addEventListener('click', async () => {
    const commentToDelete = document.querySelector(`.total_comment_${deleteCommentBtn.name}`)
    commentToDelete.remove()

    const response = await fetch(`/comments/delete/${deleteCommentBtn.name}`, {
      method: 'DELETE'
    })
  })
}

// ADD COMMENT
const addCommentButtons = document.getElementsByClassName('reply_answer_btn')
for (let i = 0; i < addCommentButtons.length; i++) {
  const replyButton = addCommentButtons[i];
  replyButton.addEventListener('click', async (e) => {
    const answerSection = document.getElementById(`answer-div-${replyButton.id}`)
    const newCommentBox = document.createElement('textarea')
    const newCommentBoxHead = document.createElement('h4')
    const checkBox = document.getElementById(`new_comment_${replyButton.id}`)
    const submitButton = document.createElement('button')
    if(!checkBox){
      newCommentBoxHead.innerText = 'Leave a Comment Below'
      newCommentBoxHead.style.textAlign = 'center'
      newCommentBoxHead.style.marginTop = '7px'
      newCommentBox.id = `new_comment_${replyButton.id}`
      newCommentBox.style.marginLeft = "135px"
      newCommentBox.style.marginTop = "10px"
      newCommentBox.rows = 6
      newCommentBox.cols = 35
      submitButton.innerText = "Submit Comment"
      submitButton.className = "reply_answer_btn"
      submitButton.style.marginLeft = "225px"
      answerSection.appendChild(newCommentBoxHead)
      answerSection.appendChild(newCommentBox)
      answerSection.appendChild(submitButton)

      submitButton.addEventListener('click', async (e)=> {
        const content = newCommentBox.value
        const answerId = replyButton.id
        const userId = replyButton.name
        if (!content) {
          alert("You must type a comment")
          return
        }else if (content.length > 500){
          alert("Your comment is too long")
          return
        }
        const res = await fetch(`/comments/add`, {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            answerId,
            content,
            userId
        })
      })
      const data = await res.json()

      const jUser = await fetch('/users', {
          method: 'PATCH',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: userId
          })
        })
        const user = await jUser.json()


      newCommentBox.remove()
      newCommentBoxHead.remove()
      submitButton.remove()
      
      const commentsSection = document.getElementById(`full_comment_${answerId}`);
      const newTotalComment = document.createElement('div')
      let newCommentDivInner = `
        <div class="total_comment total_comment_${data.id}" id="comment_answer_${data.id}" name="${data.id}">
        <div class="comment_head">
        <img class="user_profile_pic_comment" src="${user.picSrc}">
        <div class="user_comment_details">
        <p class="user_of_comment">${user.fullName}</p>
        <p>${new Date}</p>
        </div></div>
        <div class="comment_body">
        <p class="comment_content" id="comment_content_${data.id}">${content}</p>
        <button class="edit_comment_btn" id="tempEdit_${data.id}" name="${data.id}">Edit</button>
        <button class="delete_comment_btn" id="tempDelete_${data.id}" name="${data.id}">Delete</button>
        </div>
        </div>
      `

        newTotalComment.innerHTML = newCommentDivInner
        commentsSection.prepend(newTotalComment)


        const deleteCommentButton = document.getElementById(`tempDelete_${data.id}`)
        deleteCommentButton.addEventListener('click', async () => {
            const commentToDelete = document.querySelector(`.total_comment_${data.id}`)
            commentToDelete.remove()
            const response = await fetch(`/comments/delete/${data.id}`, {
              method: 'DELETE'
            })
          })
        
          const editCommentBtn = document.getElementById(`tempEdit_${data.id}`)
          editCommentBtn.addEventListener('click', () => {
            const commentContent = document.getElementById(`comment_content_${data.id}`);
            const commentInnerText = commentContent.innerText;
        
            commentContent.innerHTML = `<input type="text" id="edit_box_${data.id}" value="${commentInnerText}"></input><button class="edit_comment_btn" id="edit_button_${data.id}">Submit Edit</button>`;
            editCommentBtn.style.display = 'none';
        
            const submitCommentEditBtn = document.getElementById(`edit_button_${data.id}`);
            submitCommentEditBtn.addEventListener('click', async () => {
              const newComment = document.getElementById(`edit_box_${data.id}`).value;
              if (!newComment) {
                alert('Please enter a comment.')
                return
              }else if (newComment.length > 500){
                alert("Your comment is too long")
                return
              } else {
                commentContent.innerHTML = newComment;
                editCommentBtn.style.display = 'block';
        
                const response = await fetch(`/comments/edit/${editCommentBtn.name}`, {
                  method: 'PATCH',
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify({
                    content: newComment
                  })
                })
              }
            })
            })



    })
  }})
}





})
