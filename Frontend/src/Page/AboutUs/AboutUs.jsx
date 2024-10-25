import logo from "../../assets/image/IEM Ecommerce-logo.png";

export const AboutUs = () => {
  return (
    <div className="py-16 bg-white">
      <div className="container m-auto px-6 text-gray-600 md:px-12 xl:px-6">
        <div className="space-y-6 md:space-y-0 md:flex md:gap-6 lg:items-center lg:gap-12">
          <div className="md:7/12 lg:w-6/12">
            <h2 className="text-2xl text-gray-900 font-bold md:text-4xl">
              Welcome to IEM ECOMMERCE - Your Unique Shopping Destination!
            </h2>
            <p className="mt-6 text-gray-600">
              Diverse Selection: We take pride in offering a unique and diverse
              range of products that set us apart. Unique designs and
              high-quality products make our shopping experience distinctive.
            </p>
            <p className="mt-4 text-gray-600">
              Personalized Shopping Experience: We provide customers with a
              personalized and unique shopping experience. Customize some
              products to fit your specific needs, adding a personal touch to
              your purchases.
            </p>
            <p className="mt-4 text-gray-600">
              Supporting Local Products We actively support local products,
              shining a spotlight on local craftsmen and businesses, making your
              shopping experience have a local touch.
            </p>
            <p className="mt-4 text-gray-600">
              Quality Over Quantity: Our focus is on providing high-quality
              products rather than quantity, ensuring you can confidently trust
              every purchase.
            </p>
            <p className="mt-4 text-gray-600">
              Exceptional Customer Service: Our customer service team is always
              ready to assist and support, placing customer needs at the heart
              of our operations.
            </p>
            <p className="mt-4 text-xl font-medium text-gray-800">
              Discover the Difference with IEM ECOMMERCE
            </p>
            <p className="mt-4 text-xl text-gray-800">
              At IEM ECOMMERCE, we strive to deliver a unique shopping
              experience that stands out. Choose excellence, choose quality,
              choose IEM ECOMMERCE. Shop securely with peace of mind, with the
              assurance that your needs will be met perfectly.
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
