"use client";
import MainLayout from "@/app/components/templates/MainLayout";
import BreadCrumb from "@/app/components/feedback/BreadCrumb";
import { useParams } from "next/navigation";
import ProductImageGallery from "../ProductImageGallery";
import ProductInfo from "../ProductInfo";
import ProductReviews from "../ProductReviews";
import { useQuery } from "@apollo/client";
import { GET_SINGLE_PRODUCT } from "@/app/gql/Product";
// import { useInitiateCheckoutMutation } from "@/app/store/apis/CheckoutApi";
import { loadStripe } from "@stripe/stripe-js";
// import useToast from "@/app/hooks/ui/useToast";

const ProductDetailsPage = () => {
  // const { showToast } = useToast();
  const { slug } = useParams();
  // const [initiateCheckout] = useInitiateCheckoutMutation();
  const { data, loading } = useQuery(GET_SINGLE_PRODUCT, {
    variables: { slug },
  });
  const product = data?.product;
  const stripePromise = loadStripe(
    "pk_test_51R9gs72KGvEXtMtXXTm7UscmmHYsvk9j3ktaM8vxRb3evNJgG1dpD05YWACweIfcPtpCgOIs4HkpGrTCKE1dZD0p00sLC6iIBg"
  );

  // const handleInitiateCheckout = async () => {
  //   try {
  //     const res = await initiateCheckout(undefined).unwrap();
  //     const stripe = await stripePromise;
  //     const result = await stripe?.redirectToCheckout({
  //       sessionId: res.sessionId,
  //     });

  //     if (result?.error) {
  //       showToast(result.error.message, "error");
  //       console.error(result.error.message);
  //     }
  //   } catch (error) {
  //     console.error("Error checking out:", error);
  //     showToast("Failed to initiate checkout", "error");
  //   }
  // };

  if (loading)
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      </MainLayout>
    );

  return (
    <MainLayout>
      <div className="flex items-start justify-start mt-8 px-[10%]">
        <BreadCrumb />
      </div>

      <div className="w-[84%] mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10 pt-[3rem] bg-white rounded">
        <ProductImageGallery images={product.images} name={product.name} />
        <ProductInfo
          id={product.id}
          name={product.name}
          averageRating={product.averageRating}
          reviewCount={product.reviewCount}
          stock={product.stock}
          price={product.price}
          discount={product.discount}
          description={product.description}
          attributes={product.attributes}
        />
      </div>

      <div className="w-[84%] mx-auto p-6">
        <ProductReviews reviews={product.reviews} productId={product.id} />
      </div>
    </MainLayout>
  );
};

export default ProductDetailsPage;
