const BASE_URL = "https://rsapi.goong.io";

export const forwardGeocoding = (accessToken, address) => {
  return fetch(`${BASE_URL}/geocode?address=${address}&api_key=${accessToken}`)
};

export const tracking= (url, authUsername, authPassword, body) => {
  const headers = new Headers();
  headers.set("Authorization", "Basic " + btoa(authUsername + ":" + authPassword))
  headers.set("Content-Type", 'application/json')
  return fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body)
  })
}