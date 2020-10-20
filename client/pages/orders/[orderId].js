import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';
const OrderShow = ({ order = { ticket: {} }, currentuser = {} }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const { doRequest, errors } = useRequest({
    url: `/api/payments`,
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => {
      console.log({ payment });
      Router.push('/orders');
    },
  });
  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(msLeft / 1000);
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, [order]);
  if (timeLeft <= 0) {
    return <div>Order expired</div>;
  }
  return (
    <div>
      {timeLeft} seconds Left to pay
      <StripeCheckout
        token={({ id }) => {
          console.log({ id });
          doRequest({ token: id });
        }}
        stripeKey="pk_test_51HdRITDEVeq3Bz4SbImDdNqAUkObM7KTTi1NeXnbeuzk0z0rWKzgc7zo8EdEIF6PCyNF2HRVNgmL1DXckv81hzjL00EfiblhEE"
        amount={order.ticket.price * 100}
        email={currentuser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return {
    order: data,
  };
};

export default OrderShow;
