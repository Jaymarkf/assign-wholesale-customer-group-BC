export async function onRequestGet(context) {
  const { request, params } = context;
  const customerId = params.customerId; // assumes route like /customer/[customerId]

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

  // If a customerId exists in the path -> do a PUT update
  if (customerId) {
    const url = `https://api.bigcommerce.com/stores/${BC_STORE_HASH}/v3/customers/${customerId}`;
    const body = {
      customer_group_id: 3 // 👈 test payload
    };

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "X-Auth-Token": BC_API_TOKEN,
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const text = await response.text();

      return new Response(text, {
        status: response.status,
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      return new Response(
        JSON.stringify({ error: "Exception in PUT", message: err.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // Otherwise -> do your original GET
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

    return new Response(text, {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Exception in GET", message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
