// functions/register.js
export async function onRequestPost({ request, env }) {
  return new Response(JSON.stringify({ message: "Register working!" }), {
    headers: { "Content-Type": "application/json" },
  });
}
