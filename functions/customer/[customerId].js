export async function onRequestPut(context) {
  const { customerId } = context.params;
  const BC_STORE_HASH = context.env["store-hash"];
  const BC_API_TOKEN = context.env["X-Auth-Token"];
  const APPROVED_CUSTOMER_ID = context.env["approved-customer-group-id"];

  if (!BC_STORE_HASH || !BC_API_TOKEN || !APPROVED_CUSTOMER_ID) {
    return new Response(
      JSON.stringify({ error: "Missing environment variables" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!customerId || isNaN(customerId)) {
    return new Response(
      JSON.stringify({ error: "Invalid customerId" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const apiUrl = `https://api.bigcommerce.com/stores/${BC_STORE_HASH}/v3/customers`;

  // BigCommerce expects an array of objects
  const body = JSON.stringify([
    {
      id: parseInt(customerId, 10),
      customer_group_id: parseInt(APPROVED_CUSTOMER_ID, 10)
    }
  ]);

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
    return new Response(text, { status: response.status, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Exception", message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
