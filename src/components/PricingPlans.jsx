'use client'
import { useState } from 'react'
import { Heading } from "./sub/Heading"
import { pricingPlans, checkIcon } from '@/assets'
import { motion } from 'framer-motion'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FaCreditCard, FaCheckCircle } from 'react-icons/fa'


const stripePromise = loadStripe('pk_live_51QpJjW09D49QnrT5Mnijb3gqT88a7NHEv5kZQBlrxUFGlkeWQhpbqG3SxTbeOkThrU8qr8PYcPPNgwRIXsejAYBX00A8upCmOQ')

export const PricingPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  return (
    <div id="pricing" className="py-20">
      <Heading text={'Pricing Plans'} />
      <div className="h-full flex flex-wrap items-center justify-center gap-6">
        {pricingPlans.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ y: 200, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4, delay: i * 0.2, scale: { duration: 0.15 } }}
            className={`sm:w-[270px] flex flex-col p-6 border border-red-400 rounded-xl text-gray-600 dark:bg-zinc-700 transition-colors ${
              i === 1 ? 'w-[370px] xl:w-[320px] bg-white' : 'w-[350px] xl:w-[300px] bg-zinc-50'
            }`}
          >
            <h1 className="text-3xl lg:text-lg font-light tracking-wide text-center dark:text-white">
              {plan.title}
            </h1>
            <span className="text-2xl lg:text-xl text-center dark:text-white">
              {plan.pricing}
            </span>
            <ul className="flex flex-col gap-y-2">
              {plan.features.map((feature, j) => (
                <div key={j} className="flex items-center gap-x-3">
                  <span className={`text-2xl ${i === 1 ? 'text-red-300' : 'text-yellow-500'}`}>
                    {checkIcon}
                  </span>
                  <li className="text-[15px] font-light tracking-wide dark:text-white">
                    {feature}
                  </li>
                </div>
              ))}
            </ul>
            <button
              className="mt-4 w-full bg-yellow-500 text-white py-2 rounded-md flex items-center justify-center gap-2 hover:bg-yellow-600 transition"
              onClick={() => {
                setSelectedPlan(plan)
                setShowPaymentForm(true)
              }}
            >
              <FaCreditCard />
              Select Plan
            </button>
          </motion.div>
        ))}
      </div>

      {/* Show payment form if a plan is selected */}
      {showPaymentForm && selectedPlan && (
        <Elements stripe={stripePromise}>
          <PaymentForm selectedPlan={selectedPlan} setShowPaymentForm={setShowPaymentForm} />
        </Elements>
      )}

      <ToastContainer />
    </div>
  )
}

// **Payment Form Component**
const PaymentForm = ({ selectedPlan, setShowPaymentForm }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  const handlePayment = async (e) => {
    e.preventDefault()
  
    if (!stripe || !elements) return
  
    setLoading(true)
  
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    })
  
    if (error) {
      toast.error(error.message, {
        icon: <FaCreditCard />,
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      })
      setLoading(false)
      return
    }
  
    
    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseInt(selectedPlan.pricing.replace(/[^0-9]/g, ''), 10), // Extract numeric price
          paymentMethodId: paymentMethod.id,
          return_url:  "https://myportfolio-oh9jk9l09-jireh.vercel.app", // Dynamically set return URL
        }),
      })
  
      const data = await response.json()
  
      if (data.success) {
        window.location.href = data.paymentIntent.next_action.redirect_to_url
      } else {
        toast.error('Payment failed. Try again.', {
          icon: <FaCreditCard />,
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        })
      }
    } catch (error) {
      console.error("Payment Error:", error)
    }
  
    setLoading(false)
  }
  

  return (
    <div className="mt-10 bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Enter Card Details</h2>
      <form onSubmit={handlePayment}>
        <CardElement className="p-3 border border-gray-300 rounded-md" />
        <button
          type="submit"
          disabled={!stripe || loading}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          {loading ? 'Processing...' : `Pay ${selectedPlan.pricing}`}
        </button>
      </form>
    </div>
  )
}
