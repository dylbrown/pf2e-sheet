import fetch from 'node-fetch';

const API_ENDPOINT = 'https://legacy.wanderersguide.app/api/';

import type { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
  try {
    const { WANDERERS_GUIDE_KEY } = process.env;
    let url =
      API_ENDPOINT +
      (event.queryStringParameters?.type ?? 'spell') +
      '?id=' +
      (event.queryStringParameters?.id ?? '-1');
    if (event.queryStringParameters?.id == '-2') {
      url =
        API_ENDPOINT + (event.queryStringParameters?.type ?? 'spell') + '/all';
    }
    const response = await fetch(url, {
      headers: { Authorization: 'Apikey ' + WANDERERS_GUIDE_KEY },
    });
    if (!response.ok) {
      const text = await response.text();
      console.log(text);
      return { statusCode: response.status, body: text };
    }
    const data = await response.json();
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed fetching data' }),
    };
  }
};

export { handler };
