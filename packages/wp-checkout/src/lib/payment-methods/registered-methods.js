/* @format */

/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import { registerPaymentMethod } from '../../lib/payment-methods';
import { useLocalize } from '../../lib/localize';
import { useCheckoutLineItems, renderDisplayValueMarkdown } from '../../index';

export default function loadPaymentMethods() {
	registerPaymentMethod( {
		id: 'apple-pay',
		initialData: {},
		LabelComponent: () => <span>Apple Pay</span>,
		PaymentMethodComponent: ApplePayComponent,
		BillingContactComponent: ApplePayBillingForm,
		SubmitButtonComponent: ApplePaySubmitButton,
	} );

	registerPaymentMethod( {
		id: 'card',
		initialData: {},
		LabelComponent: () => <span>Credit Card</span>,
		PaymentMethodComponent: () => <div>Enter card info here</div>,
		BillingContactComponent: () => <div>Put payment info here</div>,
		SubmitButtonComponent: () => <button>Pay</button>,
	} );

	registerPaymentMethod( {
		id: 'paypal',
		initialData: {},
		LabelComponent: () => <span>PayPal</span>,
		PaymentMethodComponent: () => null,
		BillingContactComponent: () => <div>Put payment info here</div>,
		SubmitButtonComponent: () => <button>Pay</button>,
	} );
}

function ApplePayComponent( { isActive } ) {
	return isActive ? 'Apple Pay' : null;
}

function ApplePayBillingForm( { setPaymentData, paymentData } ) {
	// TODO: import these and make them work
	return (
		<BillingFormFields>
			<FormField
				id="billingName"
				type="Text"
				label="Name"
				error={ this.state.billingNameError }
				errorMessage="This is a required field"
				value={ this.state.billingName }
				onChange={ this.checkForFieldErrors }
			/>
		</BillingFormFields>
	);
}

function ApplePaySubmitButton() {
	const localize = useLocalize();
	const [ , total ] = useCheckoutLineItems();
	return (
		<button>{ localize( `Pay ${ renderDisplayValueMarkdown( total.displayValue ) }` ) }</button>
	);
}