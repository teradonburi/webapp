import axios from 'axios'


axios.interceptors.request.use(req => {
  const token = localStorage.getItem('token')

  if (token) {
    // 認証トークン
    req.headers.Authorization = `Bearer ${token}`
  }
  return req
}, err => Promise.reject(err))

axios.interceptors.response.use(res => res, err => {
  if (axios.isCancel(err)) {
    return Promise.reject({code: 999, message: 'cancel'})
  }
  if (err.response.status && err.response.status === 401) {
    // connectしていないので明示的にdispatchを渡す
    localStorage.setItem('token', '')
  }
  return Promise.reject(err.response || {})
})


function main() {
  axios.post('/api/users', {name: 'test'})
  .then(res => res.data)
  .then(data => {
    console.log(data)
    localStorage.setItem('token', data.token)
    axios.get('/api/users')
      .then(res => res.data)
      .then(data => console.log(data))
  })
}
main()


