import React from 'react'
import { Link } from 'react-router-dom'
import './Checkout.css'

const CheckoutSteps = ({ shipping, confirmOrder, payment }) => {
    const steps = [
        { label: 'Shipping', active: !!shipping, to: '/shipping' },
        { label: 'Confirm Order', active: !!confirmOrder, to: '/confirm' },
        { label: 'Payment', active: !!payment, to: '/payment' },
    ]

    return (
        <div className="checkout-steps">
            {steps.map((step, index) => {
                // Steps before the active one are "done"
                const firstActiveIndex = steps.findIndex(s => s.active)
                const isDone = !step.active && index < firstActiveIndex

                return (
                    <React.Fragment key={step.label}>
                        {index > 0 && <div className="step-line" />}
                        <div className={`step-item ${step.active ? 'active' : ''} ${isDone ? 'done' : ''}`}>
                            {step.active ? (
                                <span className="step-link">
                                    <span className="step-num">{isDone ? '✓' : index + 1}</span>
                                    <span className="step-label">{step.label}</span>
                                </span>
                            ) : (
                                <Link to={step.to} className="step-link">
                                    <span className="step-num">{index + 1}</span>
                                    <span className="step-label">{step.label}</span>
                                </Link>
                            )}
                        </div>
                    </React.Fragment>
                )
            })}
        </div>
    )
}

export default CheckoutSteps
