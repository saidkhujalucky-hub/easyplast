import {onRequestPost} from '../functions/api/assistant.js';
import { guestOrders } from './guest-orders.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/guest-orders') return guestOrders(request, env);
    if (url.pathname === '/api/assistant') {
      if (request.method !== 'POST') return new Response('Method not allowed', {status: 405, headers: {Allow: 'POST'}});
      return onRequestPost({request, env});
    }
    return env.ASSETS.fetch(request);
  }
};
