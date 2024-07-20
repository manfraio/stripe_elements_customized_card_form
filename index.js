require('dotenv').config()
const express = require('express')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const app = express()
app.use(express.json())

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname })
})

app.post('/save-card', async (req, res) => {
    try {
        // Create customer
        // const customer = await stripe.customers.create({
        //     name: 'Jane Smith',
        //     email: 'js@domain.com',
        //     payment_method: req.body.paymentMethodId,
        //     invoice_settings: { default_payment_method: req.body.paymentMethodId }
        // })

        // If customer already exists
        await stripe.paymentMethods.attach(req.body.paymentMethodId, { customer: 'cus_QTt7Bw4mKuZSme' })

        // Set card as default
        await stripe.customers.update('cus_QTt7Bw4mKuZSme', { 
            invoice_settings: { default_payment_method: req.body.paymentMethodId } 
        })

        res.status(201).json({ message: 'Card saved successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

app.post('/payment', async (req, res) => {
    try {
        // Create payment
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 20 * 100,
            currency: 'usd',
            payment_method_types: ['card'],
            payment_method: req.body.paymentMethodId,
            confirm: true,
            error_on_requires_action: true            
        })

        console.log(paymentIntent)

        res.status(201).json({ message: 'Payment successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

app.listen(3000, () => console.log('Server started on port 3000'))