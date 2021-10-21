const BASE_URL = "https://rsapi.goong.io";

export const forwardGeocoding = (accessToken, address) => {
  return fetch(`${BASE_URL}/geocode?address=${address}&api_key=${accessToken}`)
};