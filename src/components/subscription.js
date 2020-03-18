import React, { memo } from 'react';
import { Subscription } from 'react-apollo'
import { PIN_ADDED_SUBSCRIPTION, PIN_UPDATED_SUBSCRIPTION } from '../graphql/subscriptions'

const PinSubscription = memo(({ dispatch }) => (
    <>
        <Subscription
            subscription={PIN_ADDED_SUBSCRIPTION}
            onSubscriptionData={({ subscriptionData }) => {
                const { pinAdded } = subscriptionData.data;
                console.log({ pinAdded });
                dispatch({ type: 'CREATE_PIN', payload: pinAdded });
            }}
        />
        <Subscription
            subscription={PIN_UPDATED_SUBSCRIPTION}
            onSubscriptionData={({ subscriptionData }) => {
                const { pinUpdated } = subscriptionData.data;
                console.log({ pinUpdated });
                dispatch({ type: 'CREATE_COMMENT', payload: pinUpdated });
            }}
        />
    </>
))

export default PinSubscription