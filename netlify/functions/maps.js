exports.handler = async (event, context) => {
  // Get the API key from environment variables (server-side only)
  const apiKey = process.env.GOOGLE_API_KEY; // Note: no REACT_APP_ prefix
  
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Google API key not configured' })
    };
  }

  // Get parameters from the request
  const { center, zoom, size, maptype, markers, format } = event.queryStringParameters || {};
  
  if (!center) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required parameter: center' })
    };
  }

  // Build the Google Maps URL
  const params = new URLSearchParams({
    center: center,
    zoom: zoom || '13',
    size: size || '400x400',
    maptype: maptype || 'roadmap',
    key: apiKey
  });

  // Add marker manually to avoid double-encoding the | character
  let mapUrl = `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;
  if (markers) {
    mapUrl += `&markers=${markers}`;
  }

  try {
    // Fetch the image from Google Maps
    const response = await fetch(mapUrl);
    
    if (!response.ok) {
      throw new Error(`Google Maps API error: ${response.status}`);
    }

    const imageBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');

    if (format === 'json') {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          dataUrl: `data:image/png;base64,${base64Image}`
        })
      };
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-store, max-age=0',
        'Access-Control-Allow-Origin': '*'
      },
      body: base64Image,
      isBase64Encoded: true
    };
  } catch (error) {
    console.error('Maps function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch map image' })
    };
  }
};
