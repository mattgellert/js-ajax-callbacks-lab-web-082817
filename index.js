const baseAPI = 'https://api.github.com'
const token = '4d2bd8d8d6d449e8981521dadd98b3cf0c95ed48'
const form = document.getElementById('searchForm')
const results = document.getElementById('results')
const details = document.getElementById('details')


//event listeners
form.addEventListener('submit', function(e) {
  const input = document.getElementById('searchTerms').value
  searchRepositories(input)
})

function displayError(){

}

function searchRepositories(user){
  fetch(`${baseAPI}/users/${user}/repos`,
  {
    method: 'get',
    headers: {
      Authorization: `token ${token}`
    }
  })
  .then(resp => resp.json()).then(json => {
    displayRepositories(json, user)
  })
  .catch (err => {
    const errorDiv = document.getElementById('errors')
    errorDiv.innerHTML = `<p style='color: red'>${err}</p>`
  })
}

function displayRepositories(json, user){
  const list = '<ul>' + json.map(repo => {
    return `<li data-user='${user}' data-repo='${repo.name}'>${repo.name} - <a href='${repo.html_url}'>link</a></li>`
  }).join('') + '</ul>'
  results.innerHTML = list
  Array.from(results.children[0].children).forEach(item => {
    item.addEventListener('click', (ev) => {
    getCommits(ev.target)
    })
  })
}

function getCommits(target){
  fetch(`${baseAPI}/repos/${target.dataset.user}/${target.dataset.repo}/commits`, {
    method: 'get',
    headers: {
      Authorization: `token ${token}`
    }
  }).then(resp => resp.json()).then(json => {showCommits(json)}).catch (err => {
      const errorDiv = document.getElementById('errors')
      errorDiv.innerHTML = `<p style='color: red'>${err}</p>`
    })
}

function showCommits(json){
  const commits = '<ul>' + json.map(commit => {
    return `<li><img src='${commit.author.avatar_url} width='15px' height='15px'>${commit.author.login}<dl>SHA: ${commit.sha}</dl></li>`
  }).join('') + '</ul>'
  details.innerHTML = commits
}
