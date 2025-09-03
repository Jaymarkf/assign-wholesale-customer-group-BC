export async function onRequestGet(context) {
  return new Response(JSON.stringify({ message: "test ok" }), {
    headers: { "Content-Type": "application/json" }
  });
}
