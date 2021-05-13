import React from "react";
import Link from "next/link";
import Image from "next/image";

const ProductsListing = ({ module, customData }) => {
  // get products
  const { products } = customData;

  // set up href for internal links
  let href = "/pages/[...slug]";

  // if there are no products, display message on frontend
  if (products.length <= 0) {
    return (
      <div className="mt-44 px-6 flex flex-col items-center justify-center">
        <h1 className="text-3xl text-center font-bold">
          No products available.
        </h1>
        <div className="my-10">
          <Link href={href} as="/home">
            <a className="px-4 py-3 my-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:border-primary-700 focus:shadow-outline-primary transition duration-300">
              Return Home
            </a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative px-8 mb-12">
      <h1>Products</h1>
      <div className="max-w-screen-xl mx-auto">
        <div className="sm:grid sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <Link href={href} as={product.url} key={index}>
              <a>
                <div className="flex-col group mb-8 md:mb-0">
                  <div className="relative h-64">
                    <Image
                      src={product.imageSrc}
                      alt={product.imageAlt}
                      className="object-cover object-center rounded-t-lg"
                      layout="fill"
                    />
                  </div>
                  <div className="bg-gray-100 p-8 border-2 border-t-0 rounded-b-lg">
                    <div className="uppercase text-primary-500 text-xs font-bold tracking-widest leading-loose">
                      {product.category}
                    </div>
                    <div className="border-b-2 border-primary-500 w-8"></div>
                    <h2 className="text-secondary-500 mt-1 font-black text-2xl group-hover:text-primary-500 transition duration-300">
                      {product.name}
                    </h2>
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

// function to resole product urls
const resolvePostUrls = function (sitemap, products) {
  let dynamicUrls = {};
  products.forEach((product) => {
    Object.keys(sitemap).forEach((path) => {
      if (sitemap[path].contentID === product.contentID) {
        dynamicUrls[product.contentID] = path;
      }
    });
  });
  return dynamicUrls;
};

ProductsListing.getCustomInitialProps = async ({
  agility,
  channelName,
  languageCode,
}) => {
  // set up api
  const api = agility;

  try {
    // get sitemap...
    let sitemap = await api.getSitemap({
      channelName: channelName,
      languageCode,
    });

    // get products...
    let rawProducts = await api.getContentList({
      referenceName: "products",
      languageCode,
    });

    // resolve dynamic urls
    const dynamicUrls = resolvePostUrls(sitemap, rawProducts);

    const products = rawProducts.map((product) => {
      const category = product.fields.category;

      // url
      const url = dynamicUrls[product.contentID] || "#";

      // product image src
      let imageSrc = product.fields.image.url;

      // product image alt
      let imageAlt = product.fields.image?.label || null;

      return {
        contentID: product.contentID,
        name: product.fields.name,
        url,
        category: product.fields.category || "Uncategorized",
        imageSrc,
        imageAlt,
      };
    });

    return {
      products,
    };
  } catch (error) {
    if (console) console.error(error);
  }
};

export default ProductsListing;
