// functions/register.js
export async function onRequestGet() {
  return new Response(
    JSON.stringify({ message: "test" }),
    { headers: { "Content-Type": "application/json" } }
  );
}
