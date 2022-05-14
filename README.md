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
