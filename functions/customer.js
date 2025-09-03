export async function onRequestGet(context) {
  const { BC_STORE_HASH, BC_API_TOKEN } = context.env;

  const url = `https://api.bigcommerce.com/stores/${BC_STORE_HASH}/v3/customers`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-Auth-Token": BC_API_TOKEN,
      "Accept": "application/json",
      "Content-Type": "application/json"
    }
  });

  const data = await response.json();

  return new Response(JSON.stringify(data, null, 2), {
    headers: { "Content-Type": "application/json" }
  });
}
