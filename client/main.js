import axios from 'axios'

axios.get('/api')
  .then(res => res.data)
  .then(data => {
    const div = document.createElement('div')
    div.innerHTML = data
    const body = document.querySelector('body')
    body.appendChild(div)
  })

