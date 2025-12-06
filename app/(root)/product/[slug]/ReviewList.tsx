"use client";

import { useEffect } from "react";
import { Review } from "@/types";
import Link from "next/link";
import { useState } from "react";
import ReviewForm from "./ReviewForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, User } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import ProductRating from "@/components/shared/product/ProductRating";
import CONTENT_PAGE from "@/lib/content-page";
import { getReviews } from "@/lib/actions/review.actions";

export default function ReviewList({
  userId,
  productId,
  productSlug,
}: {
  userId: string;
  productId: string;
  productSlug: string;
}) {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const loadReviews = async () => {
      const res = await getReviews({ productId });
      setReviews(res.data);
    };

    loadReviews();
  }, [productId]);

  // Reload reviews after created or updated
  const reload = async () => {
    const res = await getReviews({ productId });
    setReviews([...res.data]);
  };

  return (
    <div className="space-y-4">
      {reviews.length === 0 && (
        <div>{CONTENT_PAGE.COMPONENT.REVIEW_LIST.noReviewsYet}</div>
      )}
      {userId ? (
        <ReviewForm
          userId={userId}
          productId={productId}
          onReviewSubmitted={reload}
        />
      ) : (
        <div>
          {CONTENT_PAGE.COMPONENT.REVIEW_LIST.please}
          <Link
            className="text-blue-700 px-2"
            href={`/sign-in?callbackUrl=/product/${productSlug}`}
          >
            {CONTENT_PAGE.COMPONENT.REVIEW_LIST.signIn}
          </Link>
          {CONTENT_PAGE.COMPONENT.REVIEW_LIST.toWriteReview}
        </div>
      )}
      <div className="flex flex-col gap-3">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex-between">
                <CardTitle>{review.title}</CardTitle>
              </div>
              <CardDescription>{review.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex md:space-x-4 text-sm text-muted-foreground flex-col md:flex-row gap-y-1 md:gap-y-0">
                <ProductRating value={review.rating} />
                <div className="flex md:items-center">
                  <User className="mr-1 h-3 w-3" />
                  {review.user ? review.user.name : "User"}
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  {formatDateTime(review.createdAt).dateTime}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
