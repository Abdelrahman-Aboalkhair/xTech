"use client";
import { useState } from "react";
import {
  useCreateReviewMutation,
  useDeleteReviewMutation,
} from "@/app/store/apis/ReviewApi";
import {
  Star,
  MessageSquare,
  User,
  Clock,
  ThumbsUp,
  Trash2,
  AlertCircle,
  Send,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useGetMeQuery } from "@/app/store/apis/UserApi";

interface ProductReviewsProps {
  reviews: {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    userId: string;
    user?: { name: string };
  }[];
  productId: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({
  reviews,
  productId,
}) => {
  const { data } = useGetMeQuery(undefined);
  const userId = data?.user.id;
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [expandedReviews, setExpandedReviews] = useState<
    Record<string, boolean>
  >({});

  const [createReview, { isLoading: isSubmitting, error }] =
    useCreateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createReview({
        productId,
        userId,
        rating,
        comment,
      }).unwrap();
      setRating(5);
      setComment("");
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteReview(reviewId).unwrap();
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };

  const toggleReviewExpansion = (reviewId: string) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={16}
        className={`${
          index < rating ? "text-amber-400 fill-amber-400" : "text-gray-200"
        }`}
      />
    ));
  };

  const ratingLabels = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };

  const getRatingDistribution = () => {
    if (!reviews || reviews.length === 0) return null;
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating - 1]++;
      }
    });
    const total = reviews.length;
    return distribution
      .map((count) => ({
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .reverse();
  };

  const ratingDistribution = getRatingDistribution();
  const averageRating = reviews?.length
    ? (
        reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      ).toFixed(1)
    : 0;

  if (isSubmitting) {
    return (
      <div className="my-12 text-center flex justify-center items-center space-x-3">
        <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent"></div>
        <span className="text-gray-600 text-sm">Submitting your review...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-12 bg-red-50 border border-red-200 rounded-lg p-4 text-center flex justify-center items-center text-red-600">
        <AlertCircle className="mr-2" size={20} />
        <span className="text-sm">
          Error loading reviews. Please try again later.
        </span>
      </div>
    );
  }

  return (
    <div className="mt-16 mb-12 bg-white p-8 rounded-lg shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
          <MessageSquare className="mr-2 text-primary" size={24} />
          Customer Reviews
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          {reviews.length} {reviews.length === 1 ? "review" : "reviews"} for
          this product
        </p>
      </div>

      {/* Rating Summary */}
      {reviews.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-6 mb-10 shadow-sm flex flex-col md:flex-row items-center gap-8">
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900">
              {averageRating}
            </div>
            <div className="flex justify-center mt-2">
              {renderStars(Math.round(Number(averageRating)))}
            </div>
            <p className="text-gray-600 text-sm mt-1">
              Based on {reviews.length} reviews
            </p>
          </div>
          <div className="flex-1 w-full">
            {ratingDistribution?.map((data, idx) => (
              <div key={idx} className="flex items-center mb-2 text-sm">
                <div className="w-16 text-right text-gray-700">
                  {5 - idx} stars
                </div>
                <div className="ml-3 flex-1">
                  <div className="bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-amber-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${data.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-3 w-12 text-gray-600">
                  {data.percentage}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Form */}
      {userId ? (
        <div className="bg-white rounded-lg p-6 mb-10 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ThumbsUp className="mr-2 text-primary" size={20} />
            Write a Review
          </h3>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating
              </label>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <button
                      type="button"
                      key={index}
                      onClick={() => setRating(index + 1)}
                      className={`focus:outline-none transition-transform duration-150 ${
                        index < rating ? "scale-110" : ""
                      }`}
                    >
                      <Star
                        size={28}
                        className={`${
                          index < rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  {rating} - {ratingLabels[rating]}
                </p>
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="comment"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Review
              </label>
              <textarea
                id="comment"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-all duration-200"
                placeholder="Share your experience with this product..."
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-white py-2.5 px-6 rounded-lg font-medium text-sm flex items-center shadow-sm hover:bg-primary-dark transition-colors duration-200"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={16} className="mr-2" />
                    Submit Review
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 mb-10 text-primary flex items-center">
          <AlertCircle size={20} className="mr-2" />
          <p className="text-sm">Please log in to write a review.</p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <User className="mr-2 text-primary" size={20} />
          Customer Feedback
        </h3>
        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg shadow-sm">
            <MessageSquare size={40} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600 text-sm">
              No reviews yet. Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="border border-gray-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium">
                    {review?.user?.name?.charAt(0)?.toUpperCase() || "A"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {review?.user?.name || "Anonymous"}
                      </span>
                      <div className="flex">{renderStars(review.rating)}</div>
                    </div>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Clock size={14} className="mr-1" />
                      {formatDistanceToNow(new Date(review.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
                {(data?.user.role === "ADMIN" || userId === review.userId) && (
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="text-red-500 hover:text-red-600 transition-colors p-1.5 rounded-full hover:bg-red-50"
                    title="Delete review"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 text-sm">
                  {expandedReviews[review.id] || review.comment.length <= 200
                    ? review.comment
                    : `${review.comment.slice(0, 200)}...`}
                  {review.comment.length > 200 && (
                    <button
                      onClick={() => toggleReviewExpansion(review.id)}
                      className="text-primary hover:text-primary-dark text-sm font-medium ml-2"
                    >
                      {expandedReviews[review.id] ? "Show less" : "Read more"}
                    </button>
                  )}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
