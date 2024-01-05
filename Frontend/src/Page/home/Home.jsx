
import image from "../../assets/image/IEM Ecommerce-logo.png";


export default function Home() {
  return (
    <>


      <section className="bg-white dark:bg-gray-900">
        <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
            Payment tool for software companies
            </h1>
            <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
            From checkout to global sales tax compliance, companies are all over the place
                The world uses IEN to simplify their payment stack.
            </p>
            <a
              href="/login"
              className="inline-flex items-center justify-center py-2 px-4 rounded-full  text-base font-medium text-center text-white  bg-primary-700 hover:bg-primary-800 "
              >
         
               sign in
          
            </a>
            <a
              href="/register"
              className="inline-flex items-center justify-center ml-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4   rounded-full"
              >
                  register
            </a>
          </div>
          <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
          <img src={image} alt={image}/>
          </div>
        </div>
      </section>
   
           
    </>
  );
}
