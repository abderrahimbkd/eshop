import FormWrap from '../FormWarp';
import Container from '../components/nav/Container';
import CheckoutClient from './CheckoutClient';

const Checkout = async () => {
  return (
    <div className="p-8">
      <Container>
        <FormWrap>
          <CheckoutClient />
        </FormWrap>
      </Container>
    </div>
  );
};

export default Checkout;
