addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  let response = await fetch(request);

  // If the response is a 404 error, overwrite the status with 200
  if (response.status === 404)
    response = new Response(response.body, { ...response, status: 200 });

  return response;
}