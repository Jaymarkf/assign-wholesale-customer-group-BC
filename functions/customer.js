export async function onRequestGet(context) {
  const BC_STORE_HASH = context.env["store-hash"];
  const BC_API_TOKEN = context.env["X-Auth-Token"];

  if (!BC_STORE_HASH || !BC_API_TOKEN) {
    return new Response(
      JSON.stringify({
        error: "Missing environment variables",
        debug: { BC_STORE_HASH, BC_API_TOKEN }
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const url = `https://api.bigcommerce.com/stores/${BC_STORE_HASH}/v3/customers`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-Auth-Token": BC_API_TOKEN,
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    });

    const text = await response.text();

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: "BigCommerce API error",
          status: response.status,
          statusText: response.statusText,
          debug: text
        }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return new Response(
        JSON.stringify({
          error: "Failed to parse JSON",
          raw: text
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(data, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Exception", message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
