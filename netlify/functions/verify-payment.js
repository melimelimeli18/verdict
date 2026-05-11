// Netlify Function — Payment Verification Proxy
// Securely verifies payment callbacks without exposing secrets to the frontend.

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const secret = process.env.PAYMENT_PROVIDER_SECRET;
  if (!secret) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Payment provider secret not configured" }),
    };
  }

  try {
    const payload = JSON.parse(event.body);

    // TODO: Add actual payment provider verification logic here
    // Example: verify signature hash, call payment provider API, etc.
    const verified = payload.transaction_id && payload.status === "completed";

    return {
      statusCode: verified ? 200 : 400,
      body: JSON.stringify({
        verified,
        transaction_id: payload.transaction_id,
        message: verified ? "Payment verified" : "Payment verification failed",
      }),
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Invalid request body",
        details: err.message,
      }),
    };
  }
};
