export async function onRequestPut(context) {
  const BC_STORE_HASH = context.env["store-hash"];
  const BC_API_TOKEN = context.env["X-Auth-Token"];
  const APPROVED_CUSTOMER_ID = context.env["approved-customer-group-id"];

  if (!BC_STORE_HASH || !BC_API_TOKEN) {
    return new Response(JSON.stringify({ error: "Missing environment variables" }), { status: 500 });
  }

  // Manual extraction of customerId from URL
  const url = new URL(context.request.url);
  const pathSegments = url.pathname.split('/').filter(Boolean); // remove empty segments
  const customerId = pathSegments[pathSegments.length - 1]; // last segment

  if (!customerId || isNaN(customerId)) {
    return new Response(JSON.stringify({ error: "Invalid customerId" }), { status: 400 });
  }

  const apiUrl = `https://api.bigcommerce.com/stores/${BC_STORE_HASH}/v3/customers/${customerId}`;
  const body = JSON.stringify({ customer_group_id: APPROVED_CUSTOMER_ID });

  try {
    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "X-Auth-Token": BC_API_TOKEN,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body,
    });

    const text = await response.text();
    return new Response(text, { headers: { "Content-Type": "application/json" }, status: response.status });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Exception", message: err.message }), { status: 500 });
  }
}
