;(function (console) {
  console.save = function (data, filename) {
    if (!data) {
      console.error('Console.save: No data')
      return
    }

    if (!filename) filename = 'console.json'

    if (typeof data === 'object') {
      data = JSON.stringify(data, undefined, 4)
    }

    var blob = new Blob([data], { type: 'text/json' }),
      e = document.createEvent('MouseEvents'),
      a = document.createElement('a')

    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
    e.initMouseEvent(
      'click',
      true,
      false,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null
    )
    a.dispatchEvent(e)
  }
})(console)

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const getUser = async () => {
  const res = await fetch('https://www.blueapron.com/api/users', {
    credentials: 'include',
    headers: {
      accept: 'application/vnd.blueapron.com.v20150501+json',
      'accept-language': 'en-US,en;q=0.9',
      'x-newrelic-id': 'UwQCV1RWGwcFU1BbAQg=',
      'x-requested-with': 'XMLHttpRequest',
    },
    referrer: 'https://www.blueapron.com/account',
    referrerPolicy: 'no-referrer-when-downgrade',
    body: null,
    method: 'GET',
    mode: 'cors',
  })
  return res.json()
}

const main = async () => {
  const user = await getUser()
  const subscription = user.user.subscriptions[0].id
  let slugs = []
  let page = 1
  while (true) {
    const res = await fetch(
      `https://www.blueapron.com/api/subscriptions/${subscription}/orders/past?per_page=50&page=${page}`,
      {
        credentials: 'include',
        headers: {
          accept: 'application/json, text/javascript, */*; q=0.01',
          'accept-language': 'en-US,en;q=0.9',
          'x-requested-with': 'XMLHttpRequest',
        },
        referrer: 'https://www.blueapron.com/account',
        referrerPolicy: 'no-referrer-when-downgrade',
        body: null,
        method: 'GET',
        mode: 'cors',
      }
    )
    const data = await res.json()
    if (data.length === 0) {
      break
    }
    slugs = slugs.concat(
      data
        .map((d) => d.orders)
        .map((o) => o.recipes)
        .map((r) => r.slug)
    )
    await sleep(5000)
  }
  console.save(slugs)
}
