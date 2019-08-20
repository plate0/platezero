import React from 'react'
import { Button } from 'reactstrap'
import { CardElement, injectStripe } from 'react-stripe-elements'

const createOptions = (fontSize, padding) => {
  return {
    style: {
      base: {
        fontSize,
        color: '#424770',
        letterSpacing: '0.025em',
        fontFamily: 'Source Code Pro, monospace',
        '::placeholder': {
          color: '#aab7c4'
        },
        padding
      },
      invalid: {
        color: '#9e2146'
      }
    }
  }
}

class Payment extends React.Component {
  handleSubmit = async e => {
    e.preventDefault()
    const { onError, onSuccess } = this.props
    if (!this.props.stripe) {
      return onError(new Error('stripe has not loaded'))
    }
    try {
      const res = await this.props.stripe.createToken()
      if (res.error) {
        return onError(new Error(res.error.message))
      }
      return onSuccess(res)
    } catch (err) {
      return onError(err)
    }
  }

  public render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <CardElement {...createOptions('18px')} />
        <Button value="submit" color="primary" className="mt-4">
          {this.props.buttonText || 'Update Payment Method'}
        </Button>
      </form>
    )
  }
}

export const PaymentForm = injectStripe(Payment)
