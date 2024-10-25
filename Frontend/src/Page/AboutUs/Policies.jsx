import logo from "../../assets/image/IEM Ecommerce-logo.png";

export const Policies = () => {
  return (
    <div className="py-16 bg-white">
      <div className=" m-auto px-6 text-gray-600 md:px-12 xl:px-6">
        <div className="space-y-6 js md:space-y-0 md:flex md:gap-6 lg:items-center lg:gap-12">
          <div className="md:7/12 lg:w-6/12">
            <h2 className="text-2xl text-gray-900 font-bold md:text-4xl">
              IEM ECOMMERCE Policies
            </h2>
            <p className="mt-6 text-xl font-medium text-gray-800">
              Welcome to IEM ECOMMERCE! To ensure a seamless and transparent
              shopping experience, we have outlined our policies below. Please
              take a moment to review them.
            </p>

            <p className="mt-6 text-gray-600">
              1. Ordering and Payment: Order Process: Navigate through our
              user-friendly platform to select products and complete your order
              hassle-free. Payment Options: We accept various secure payment
              methods for your convenience.
            </p>
            <p className="mt-6 text-gray-600">
              2. Shipping and Delivery: Shipping Policies: Explore our shipping
              options and delivery times provided during the checkout process.
              Tracking: Once your order is shipped, you will receive tracking
              information to monitor your delivery.
            </p>
            <p className="mt-6 text-gray-600">
              3. Returns and Exchanges: Return Policy: If you are not satisfied
              with your purchase, refer to our return policy for information on
              returns and exchanges. Refund Process: Learn about our
              straightforward refund process in case a return is necessary.
            </p>
            <p className="mt-6 text-gray-600">
              4. Product Quality and Authenticity: Quality Assurance: We
              guarantee the quality of our products, sourced from reputable
              suppliers. Authenticity: All products listed on IEM ECOMMERCE are
              authentic and genuine.
            </p>
            <p className="mt-6 text-gray-600">
              5. Privacy and Security: Data Protection: Your privacy is our
              priority. Review our privacy policy to understand how your data is
              handled. Secure Transactions: We employ secure payment gateways to
              ensure the confidentiality of your financial information.
            </p>
            <p className="mt-6 text-gray-600">
              6. Customer Support: Contact Us: If you have any queries or
              require assistance, our customer support team is ready to help.
              Feedback: We value your feedback. Share your thoughts to help us
              continually improve our services.
            </p>
            <p className="mt-6 text-gray-600">
              7. Promotions and Discounts: Special Offers: Stay informed about
              our promotions and exclusive discounts to make the most of your
              shopping experience.
            </p>
            <p className="mt-6 text-gray-800">
              Terms and Conditions: Refer to specific terms and conditions for
              each promotional offer. By shopping with IEM ECOMMERCE, you agree
              to abide by these policies. If you have any questions or concerns,
              feel free to reach out to our customer support team. Thank you for
              choosing IEM ECOMMERCE - where your satisfaction is our priority
            </p>
          </div>
          <div className="md:5/12 lg:w-5/12">
            <img src={logo} alt={logo} loading="lazy" width="" height="" />
          </div>
        </div>
      </div>
    </div>
  );
};
