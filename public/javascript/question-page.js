

window.addEventListener('DOMContentLoaded', () => {
  let threadViewBtn = document.querySelector('.view_thread_btn')
  threadViewBtn.addEventListener('click', async() =>{


  })
  let listItems = document.querySelectorAll('.listItem')
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
