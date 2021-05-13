import React from "react";
import Image from "next/image";
import Link from "next/link";
import truncate from "truncate-html";

const FeaturedProduct = ({ module }) => {
  // get module fields
  const { fields } = module;

  // get featured product
  const { featuredProduct } = fields;

  // truncate product content
  const description = truncate(featuredProduct?.fields.description, {
    length: 160,
    decodeEntities: true,
    stripTags: true,
    reserveLastWord: true,
  });

  // set up href for internal links
  const href = "/pages/[...product_id]";

  // return null if no featured product is selected
  if (!featuredProduct) {
    return null;
  }

  return (
    <div className="relative px-8 mb-8">
      <div className="flex flex-col sm:flex-row max-w-screen-xl mx-auto pt-8 group">
        <div className="sm:w-1/2 lg:w-2/3 sm:rounded-t-none sm:rounded-l-lg relative">
          <Link href={href} as={`/blog/${featuredProduct.fields.product_id}`}>
            <a className="cursor-pointer">
              <div className="h-64 sm:h-96 relative">
                <Image
                  src={featuredProduct.fields.thumbnail.url}
                  className="object-cover object-center rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
                  layout="fill"
                />
              </div>
            </a>
          </Link>
        </div>
        <div className="sm:w-1/2 lg:w-1/3 bg-gray-100 p-8 border-2 border-t-0 rounded-b-lg sm:rounded-bl-none sm:rounded-r-lg sm:border-t-2 sm:border-l-0 relative">
          <Link href={href} as={`/blog/${featuredProduct.fields.product_id}`}>
            <a className="cursor-pointer">
              <div className="font-display uppercase text-primary-500 text-xs font-bold tracking-widest leading-loose after:content">
                {featuredProduct.fields.category}
              </div>
              <div className="border-b-2 border-primary-500 w-8"></div>
              <h2 className="font-display text-secondary-500 mt-1 font-black text-2xl group-hover:text-primary-500 transition duration-300">
                {featuredProduct.fields.name}
              </h2>
              <p className="text-sm mt-3 leading-loose text-gray-600 font-medium">
                {description}
              </p>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProduct;
