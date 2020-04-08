import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe('pk_test_EQ8AveK15O4niVdpKoCEC5W100BWeuBMN5');

export const bookTour = async tourId => {
  try {
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`
    );

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  }catch(err) {
    console.log(err);
    showAlert('error', err);
  }
}