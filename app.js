async function main() {
  try {
    const data = await fetch('/api', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({data: 'hello world!'}),
    }).then(async (response) => {
      return await response.json()
    })
    const body = document.querySelector('body')
    const div = document.createElement('div')
    div.innerText = data
    body.appendChild(div)
  } catch (err) {
    console.log('fetch failed', err)
  }
}
main()