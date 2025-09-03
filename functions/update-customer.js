export async function onRequestPut(context) {
  const BC_STORE_HASH = context.env["store-hash"];
  const BC_API_TOKEN = context.env["X-Auth-Token"];

  if (!BC_STORE_HASH || !BC_API_TOKEN) {
    return new Response(
      JSON.stringify({ error: "Missing environment variables" }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }

  // Manual extraction of customerId from the URL
  const urlParts = context.request.url.split('/');
  const customerId = urlParts[urlParts.length - 1]; // last segment

  if (!customerId || isNaN(customerId)) {
    return new Response(
      JSON.stringify({ error: "Invalid customerId" }),
      { headers: { "Content-Type": "application/json" }, status: 400 }
    );
  }

  const url = `https://api.bigcommerce.com/stores/${BC_STORE_HASH}/v3/customers/${customerId}`;
  const body = JSON.stringify({ customer_group_id: 0 });

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "X-Auth-Token": BC_API_TOKEN,
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body
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
        { headers: { "Content-Type": "application/json" }, status: response.status }
      );
    }

    return new Response(text, { headers: { "Content-Type": "application/json" } });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Exception", message: err.message }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
}
