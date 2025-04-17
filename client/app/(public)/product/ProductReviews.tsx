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

const ProductReviews = ({ reviews, productId, userId, isAdmin = false }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);

  const [createReview, { isLoading: isSubmitting, error }] =
    useCreateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("Please log in to submit a review");
      return;
    }

    try {
      await createReview({
        productId,
        userId,
        rating,
        comment,
      }).unwrap();

      // Reset form
      setRating(5);
      setComment("");
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId).unwrap();
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={16}
        className={`${
          index < rating ? "text-amber-400 fill-amber-400" : "text-gray-200"
        } transition-colors`}
      />
    ));
  };

  // Get rating distribution if data is available
  const getRatingDistribution = () => {
    if (reviews || reviews.length === 0) return null;

    const distribution = [0, 0, 0, 0, 0]; // For 5 star ratings
    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating - 1]++;
      }
    });

    const total = reviews.length;
    return distribution
      .map((count) => ({
        count,
        percentage: Math.round((count / total) * 100),
      }))
      .reverse(); // Reverse to show 5 stars first
  };

  const ratingDistribution = getRatingDistribution();
  const averageRating = reviews?.length
    ? (
        reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      ).toFixed(1)
    : 0;

  if (isSubmitting)
    return (
      <div className="my-12 text-center flex justify-center items-center space-x-2">
        <div className="animate-spin h-5 w-5 border-2 border-blue-600 rounded-full border-t-transparent"></div>
        <span className="text-gray-600">Loading reviews...</span>
      </div>
    );

  if (error)
    return (
      <div className="my-12 text-center flex justify-center items-center text-red-500">
        <AlertCircle className="mr-2" size={20} />
        <span>Error loading reviews. Please try again later.</span>
      </div>
    );

  return (
    <div className="mt-16 mb-12">
      <div className="border-b border-gray-200 pb-4 mb-8">
        <h2 className="text-2xl font-bold mb-2 flex items-center">
          <MessageSquare className="mr-2" size={24} />
          Customer Reviews
        </h2>
        <p className="text-gray-500">
          {reviews.length} {reviews.length === 1 ? "review" : "reviews"} for
          this product
        </p>
      </div>

      {/* Rating Summary */}
      {reviews.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-6 mb-10 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800">
                {averageRating}
              </div>
              <div className="flex justify-center mt-2">
                {renderStars(Math.round(Number(averageRating)))}
              </div>
              <div className="text-sm text-gray-500 mt-1">out of 5</div>
            </div>

            <div className="flex-1 w-full">
              {ratingDistribution &&
                ratingDistribution.map((data, idx) => (
                  <div key={idx} className="flex items-center mb-1 text-sm">
                    <div className="w-12 text-right">{5 - idx} stars</div>
                    <div className="ml-2 flex-1">
                      <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-amber-400 h-2 rounded-full"
                          style={{ width: `${data.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="ml-2 w-10 text-gray-500">{data.count}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Review Form */}
      {userId ? (
        <div className="bg-white p-6 rounded-xl mb-10 shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <ThumbsUp className="mr-2" size={18} />
            Write Your Review
          </h3>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating
              </label>
              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => setRating(index + 1)}
                    onMouseEnter={() => setHoveredStar(index + 1)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      size={28}
                      className={`
                        transition-colors duration-150
                        ${
                          (hoveredStar ? index < hoveredStar : index < rating)
                            ? "text-amber-400 fill-amber-400"
                            : "text-gray-300"
                        }
                      `}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-500 self-center">
                  {rating} out of 5
                </span>
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
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                placeholder="Share your experience with this product..."
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white py-2 px-5 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} className="mr-2" />
                    <span>Submit Review</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8 text-blue-700 flex items-center">
          <AlertCircle size={20} className="mr-2" />
          <p>Please log in to write a review.</p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-8">
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <User className="mr-2" size={20} />
          Customer Feedback
        </h3>

        {reviews.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <MessageSquare size={40} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">
              No reviews yet. Be the first to review this product!
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="border border-gray-100 rounded-lg p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-blue-100 text-blue-700 rounded-full p-1">
                      <User size={16} />
                    </div>
                    <span className="font-medium">{review.user.name}</span>
                    <div className="flex ml-2">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Clock size={14} className="mr-1" />
                    {formatDistanceToNow(new Date(review.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>

                {(isAdmin || userId === review.userId) && (
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
                    title="Delete review"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mt-2">
                <p className="text-gray-700">{review.comment}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
