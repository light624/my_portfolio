import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  try {
    const { amount, paymentMethodId } = await req.json()

    if (!amount || amount <= 0) {
      return new Response(JSON.stringify({ success: false, error: "Invalid amount" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert dollars to cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      return_url: "https://myportfolio-oh9jk9l09-jireh.vercel.app", 
    })

    return new Response(JSON.stringify({ success: true, paymentIntent }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Stripe Error:', error)
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
