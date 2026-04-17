// Worker script for static site hosting
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  try {
    // Get the path from the request URL
    const url = new URL(request.url);
    let path = url.pathname;
    
    // Serve index.html for root or directory paths
    if (path === '/' || path.endsWith('/')) {
      path += 'index.html';
    }
    
    // Try to fetch the file from the bucket
    const response = await fetch(`file://${path}`);
    
    if (!response.ok) {
      // If the file doesn't exist, try to serve 404.html
      const notFoundResponse = await fetch('file://404.html');
      if (notFoundResponse.ok) {
        return new Response(notFoundResponse.body, {
          status: 404,
          headers: notFoundResponse.headers
        });
      }
      // If 404.html doesn't exist, return a generic 404
      return new Response('Not Found', {
        status: 404,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }
    
    return response;
  } catch (error) {
    return new Response('Internal Server Error', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }
}
