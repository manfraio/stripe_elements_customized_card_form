const stripe = Stripe('your_stripe_publishable_key')
const elements = stripe.elements({
    fonts: [
        {
            cssSrc: 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap'
        }
    ]
})

// const cardElement = elements.create('card', {
//     style: {
//         base: {
//             color: '#555',
//             fontFamily: 'Montserrat, sans-serif'
//         }
//     }
// })
// cardElement.mount('#card-element')

const cardNumberElement = elements.create('cardNumber', {
    style: {
        base: {
            color: '#555',
            fontFamily: 'Montserrat, sans-serif'
        }
    }
})
cardNumberElement.mount('#card-number-element')

const cardExpiryElement = elements.create('cardExpiry', {
    style: {
        base: {
            color: '#555',
            fontFamily: 'Montserrat, sans-serif'
        }
    }
})
cardExpiryElement.mount('#card-expiry-element')

const cardCVCElement = elements.create('cardCvc', {
    style: {
        base: {
            color: '#555',
            fontFamily: 'Montserrat, sans-serif'
        }
    }
})
cardCVCElement.mount('#card-cvc-element')

const cardholderName = document.getElementById('cardholder-name')
const cardholderEmail = document.getElementById('cardholder-email')
const cardholderZip = document.getElementById('cardholder-zip')
const cardButton = document.getElementById('card-button')
const cardResult = document.getElementById('card-result')

cardButton.addEventListener('click', async () => {
    cardResult.textContent = 'Loading...'

    const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumberElement,
        billing_details: {
            name: cardholderName.value,
            email: cardholderEmail.value,
            address: { postal_code: cardholderZip.value }
        }
    })

    if (error) {
        cardResult.textContent = error.message
    } else {
        const response = await fetch('/payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                paymentMethodId: paymentMethod.id
            })
        })

        const data = await response.json()

        cardResult.textContent = data.message
        cardNumberElement.clear()
        cardExpiryElement.clear()
        cardCVCElement.clear()
        cardholderName.value = ''
        cardholderEmail.value = ''
        cardholderZip.value = ''
    }
})

cardNumberElement.on('change', (event) => {
    document.getElementById('card-number-element').style.backgroundImage = `url(images/${event.brand}.png)`
})