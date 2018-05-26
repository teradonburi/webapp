async function main() {
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : await fetch('/api/users', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({name: 'test'}),
  }).then(async (response) => {
    return await response.json()
  })

  console.log(user.token)
  localStorage.setItem('user', JSON.stringify(user))

  const ret = await fetch(`/api/users/${user.id}`, {
    method: 'GET',
    headers: {'Authorization': `Bearer ${user.token}`},
  }).then(async (response) => {
    return await response.json()
  })
  console.log(ret)
  const body = document.querySelector('body')
  const div = document.createElement('div')
  div.innerHTML = ret.name
  body.appendChild(div)
}
main()


