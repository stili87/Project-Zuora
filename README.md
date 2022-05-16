# Project-Zuora
  > Project Zuora is a Quora clone for practice with Express, Pug, CSS, and front end vanilla DOM manipulation. The full stack app will have functionality to ask a question that other users can answer.  Then comments can be made on those answers.

# Technologies Used
  > Express
  > Pug
  > CSS
  > Front End Vanilla JavaScript
  > Sequalize

# MVP Features for Project Zuora
  1.) Asking Questions

    > Users will be able to ask questions which will show up on the questions page of the application.
    > The user that asked the question will be able to edit it on a separate page.
    > The user that asked the question will be able to delete the question on the edit page.

  2.) Answering Questions

    > Users will be able to answer questions posted on the main question page.
    > To answer the question a popup will be available on the question page by clicking an answer button on each question.
    > The answer will be appended to the question without refreshing the page.
    > The user that made the answer will be able to delete it on a separate page.
    > The user that made the answer will be able to edit it on a separate page.

   3.) Commenting on Questions

    > Users will be able to comment on answers posted on the main question page.
    > To comment on the answer a popup will be available by a pop-up on the question page by clicking a comment button on each answer.
    > The comment will be appended to the answer without refreshing the page.
    > The user that made the comment will be able to delete it on a separate page.
    > The user that made the comment will be able to edit it on a separate page.

   4.) User functionality

    > Create a user with all functionality of the seeded users.
    > Site is secured that the logged in user can only edit/delete things that they created.
    > Site has a profile page with all the users questions and answers.

# Other Features

    > Splash Page - with option to use a demo user.

# Challenges
    > Challenged by getting all the database information on the front page with both Express and Front end API fetch requests.
      > Solved through a large amount of trial and error to make everything right.
    > Learning each person's strengths in coding and working together.
      > Adjusting to each other's personalities and working styles.

# Best Code
  > Stili - Although the nav bar is not that big of a deal I am proud of it.  As for the API routes and event listeners, I was happy with those too. Except where I had to copy and paste.

    `mixin navBar()
    .nav-bar-full
      .nav-bar-left
        img(src="/images/logo.jpeg", alt="Zuora Logo" id="logo-img")
        a(href="/" class='logo-text') Project Zuora
      .nav-bar-right
        ul(class='nav-link-list')
          li(class='nav-link-li')
            a(href="/questions" class="nav-link-anchor") Questions List

          if locals.authenticated
            li(class='nav-link-li')
              a(href=`/users/${locals.user.id}` class="nav-link-anchor") Profile
          if locals.authenticated
            li(class='nav-link-li')
              a(href="/questions/add" class="nav-link-anchor") Ask a Question
          if locals.authenticated
            li(class='nav-link-li')
              form(action="/users/logout" method='post')
                button(type="submit" class="nav-link-anchor logout") Logout
          else
            li(class='nav-link-li')
              a(href="/" class="nav-link-anchor login") Login
            li(class='nav-link-li')
              a(href="/users/register" class="nav-link-anchor") Register`

  > Waseem - I was proud of the questions page because it looks organized and I took my time with it. I learned how to easily create a fullstack website. All it takes is time and dedication.

`include utils.pug
doctype html
html
  head
      block head
        title="Project Zuora"
        link(rel='stylesheet' href='/stylesheets/questions.css')
        link(rel='stylesheet' href='/stylesheets/nav.css')

  body
    +navBar()
    h1(id='title-of-page') Project Zuora #{title}
    if(locals.authenticated)
      .ask_container
        a(href="/questions/add" id="ask-button") Ask a Question
    div.container
      div.sideBar
        ul.sideBarList
          p(class='side-bar-title') List of games
          each tag in tags
            li.listItem
              a(href=`/questions/tag/${tag.id}` class="tag-link")= tag.name
      div.main
        if(locals.authenticated)
          a(href= "/questions/add" class="question_link") Ask a Question
        each question in questions
          div.question
            div.question_head
              div.user_img
                if (question.User.picSrc)
                  img(src=question.User.picSrc class="user_profile_pic")
                else
                  img( class="user_profile_pic" src="https://pngset.com/images/the-legend-of-zelda-zelda-majoras-mask-zora-graphics-art-leisure-activities-person-transparent-png-1598670.png")
              div.head_text
                div.question_head_upper
                  a(href=`/users/${question.userId}` class='user_profile_link')= question.User.fullName
                div.question_head_lower
                  p= question.User.credentials
            div.question_body
              div.question_body_title
                p= (`Game: ${question.Tag.name}`)
                br
              div.question_body_title
                p= question.title
              div.question_body_content
                p= question.content
              if (question.media)
                div.question_body_img
                  img(class="questions_img" src=question.media)`

              
              
  > John ALlan - It might sound abnormal, but I'm honestly most proud of the seed data I provided. Just makes me feel like a sound programmer and that I'm proficient in the fundementals.

    'use strict';

    module.exports = {
      async up (queryInterface, Sequelize) {
      await queryInterface.bulkInsert('Answers', [{
        userId : 1,
        questionId : 1,
        streetCred : '10,000 hours of this game',
        content: "the sword is right around the corner.",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        userId : 2,
        questionId : 2,
        streetCred : 'Eat sleep and dream video games',
        content: "To get the heart piece have to jump off the cliff.",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        userId : 3,
        questionId : 3,
        streetCred : 'Have never played any games',
        content: "I dont know, just try harder.",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        userId : 4,
        questionId : 4,
        streetCred : 'Once saw a video game through a store window',
        content: "See the thing you have to do is stop playing video games,     it is bad for you.",
        createdAt: new Date(),
        updatedAt: new Date(),
    }], {});
      },

      async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Answers', null, {});
      }
    };
    
    
> Jeffrey - I was very please with writing this bit of code! It finds the delete button on a specific comment and deletes that comment from the DOM and the database.

`const deleteCommentButtons = document.getElementsByClassName('delete_comment_btn')

  for (let i = 0; i < deleteCommentButtons.length; i++) {
    const deleteCommentBtn = deleteCommentButtons[i];

    deleteCommentBtn.addEventListener('click', async () => {
      const commentToDelete = document.querySelector(`.total_comment_${deleteCommentBtn.name}`)
      commentToDelete.remove()

      const response = await fetch(`/comments/delete/${deleteCommentBtn.name}`, {
        method: 'DELETE'
      })
    })
}`

