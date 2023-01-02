import {
  TransactionActionEnum,
  TransactionEventTypeEnum,
} from "@saleor/graphql";
import OrderTransaction, {
  OrderTransactionProps,
} from "@saleor/orders/components/OrderTransaction";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

const props: OrderTransactionProps = {
  onTransactionAction: () => undefined,
  transaction: {
    __typename: "TransactionItem",
    id: "VHJhbnNhY3Rpb25JdGVtOjI=",
    type: "Adyen: refund",
    pspReference: "12345",
    actions: [
      TransactionActionEnum.CHARGE,
      TransactionActionEnum.REFUND,
      TransactionActionEnum.VOID,
    ],
    status: "Partial capture",
    externalUrl: "https://google.com",
    events: [
      {
        id: "VHJhbnNhY3Rpb25FdmVudDoy",
        pspReference: "",
        createdAt: "2022-08-12T17:14:27.119138+00:00",
        type: TransactionEventTypeEnum.REFUND_SUCCESS,
        message: null,
        externalUrl: null,
        createdBy: null,
        amount: {
          amount: 34.21,
          currency: "USD",
          __typename: "Money",
        },
        __typename: "TransactionEvent",
      },
      {
        id: "VHJhbnNhY3Rpb25FdmVudDoy",
        pspReference: "",
        createdAt: "2022-08-12T17:14:27.119138+00:00",
        type: TransactionEventTypeEnum.REFUND_REQUEST,
        message: null,
        externalUrl: null,
        createdBy: null,
        amount: {
          amount: 34.21,
          currency: "USD",
          __typename: "Money",
        },
        __typename: "TransactionEvent",
      },
      {
        id: "VHJhbnNhY3Rpb25FdmVudDoy",
        pspReference: "SDFDS34543SDDFS",
        createdAt: "2022-08-12T15:14:27.119138+00:00",
        type: TransactionEventTypeEnum.CHARGE_SUCCESS,
        message: null,
        externalUrl: null,
        createdBy: null,
        amount: {
          amount: 35.42,
          currency: "USD",
          __typename: "Money",
        },
        __typename: "TransactionEvent",
      },
      {
        id: "VHJhbnNhY3Rpb25FdmVudDoy",
        pspReference: "SDFDS34543SDDFS",
        createdAt: "2022-08-12T15:14:27.119138+00:00",
        type: TransactionEventTypeEnum.CHARGE_REQUEST,
        message: null,
        externalUrl: null,
        createdBy: null,
        amount: {
          amount: 35.42,
          currency: "USD",
          __typename: "Money",
        },
        __typename: "TransactionEvent",
      },
      {
        id: "VHJhbnNhY3Rpb25FdmVudDoy",
        pspReference: "SDFDS34543SDD12",
        createdAt: "2022-08-12T13:14:27.119138+00:00",
        type: TransactionEventTypeEnum.CHARGE_FAILURE,
        message: null,
        externalUrl: null,
        createdBy: null,
        amount: {
          amount: 35.42,
          currency: "USD",
          __typename: "Money",
        },
        __typename: "TransactionEvent",
      },
      {
        id: "VHJhbnNhY3Rpb25FdmVudDoy",
        pspReference: "SDFDS34543SDD12",
        createdAt: "2022-08-12T13:14:20.119138+00:00",
        type: TransactionEventTypeEnum.AUTHORIZATION_SUCCESS,
        message: null,
        externalUrl: null,
        createdBy: null,
        amount: {
          amount: 35.42,
          currency: "USD",
          __typename: "Money",
        },
        __typename: "TransactionEvent",
      },
    ],
    authorizedAmount: {
      amount: 1.21,
      currency: "USD",
      __typename: "Money",
    },
    refundedAmount: {
      amount: 34.21,
      currency: "USD",
      __typename: "Money",
    },
    chargedAmount: {
      amount: 0,
      currency: "USD",
      __typename: "Money",
    },
  },
};

const longAmountProps: OrderTransactionProps = {
  onTransactionAction: () => undefined,
  transaction: {
    ...props.transaction,
    authorizedAmount: {
      amount: 10000000000,
      currency: "VES",
      __typename: "Money",
    },
    refundedAmount: {
      amount: 10000000000,
      currency: "VES",
      __typename: "Money",
    },
    chargedAmount: {
      amount: 10000000000,
      currency: "VES",
      __typename: "Money",
    },
  },
};

storiesOf("Orders / OrderTransaction", module)
  .addDecorator(Decorator)
  .add("default", () => <OrderTransaction {...props} />)
  .add("long amounts", () => <OrderTransaction {...longAmountProps} />);
