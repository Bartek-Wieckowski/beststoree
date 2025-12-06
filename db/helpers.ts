export function generateRandomUserName() {
  const firstNames = [
    "Alex",
    "Sarah",
    "Michael",
    "Emily",
    "David",
    "Jessica",
    "James",
    "Amanda",
    "Robert",
    "Lisa",
    "Christopher",
    "Michelle",
    "Daniel",
    "Ashley",
    "Matthew",
    "Nicole",
    "Andrew",
    "Stephanie",
    "Joshua",
    "Jennifer",
  ];

  const lastNames = [
    "Johnson",
    "Miller",
    "Brown",
    "Davis",
    "Wilson",
    "Martinez",
    "Taylor",
    "Anderson",
    "Thomas",
    "Jackson",
    "White",
    "Harris",
    "Martin",
    "Thompson",
    "Garcia",
    "Moore",
    "Clark",
    "Lewis",
    "Walker",
    "Hall",
  ];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  return `${firstName} ${lastName}`;
}

export function generateRandomReview() {
  // First, randomly select a rating
  const ratings = [1, 2, 3, 4, 5];
  const rating = ratings[Math.floor(Math.random() * ratings.length)];

  // Define reviews by rating category
  const reviewsByRating: Record<
    number,
    { titles: string[]; descriptions: string[] }
  > = {
    1: {
      titles: [
        "Very disappointed",
        "Poor quality",
        "Not worth it",
        "Terrible product",
        "Waste of money",
        "Completely unsatisfied",
      ],
      descriptions: [
        "This product is terrible. Poor quality and not as described. I would not recommend this to anyone.",
        "Very disappointed with this purchase. The quality is extremely poor and it broke after just a few uses.",
        "Waste of money. The product doesn't work as advertised and the quality is very low.",
        "Not satisfied at all. The product arrived damaged and the quality is far below expectations.",
        "This is the worst product I've ever bought. Poor construction and terrible value for money.",
        "Completely unsatisfied. The product is defective and customer service was unhelpful.",
      ],
    },
    2: {
      titles: [
        "Below expectations",
        "Not great",
        "Could be much better",
        "Disappointing",
        "Not recommended",
        "Poor value",
      ],
      descriptions: [
        "The product is below my expectations. Quality is mediocre and there are better options available.",
        "Not impressed with this purchase. The quality could be much better for the price.",
        "Disappointing product. It works but the quality is not what I expected.",
        "Could be better. The product has some issues and doesn't meet the advertised standards.",
        "Not worth the price. The quality is poor and there are better alternatives.",
        "Below average quality. The product functions but has several flaws.",
      ],
    },
    3: {
      titles: [
        "Average product",
        "Okay, nothing special",
        "Decent quality",
        "It's alright",
        "Average value",
        "Could be better",
      ],
      descriptions: [
        "The product is okay, nothing special. It does what it's supposed to do but quality is average.",
        "Decent product for the price. It works but there are some minor issues.",
        "Average quality product. It serves its purpose but could be improved.",
        "It's alright. The product works but I expected better quality for this price.",
        "Decent value for money. The product is functional but not exceptional.",
        "The product is fine but nothing outstanding. It does the job but could be better.",
      ],
    },
    4: {
      titles: [
        "Great product!",
        "Very satisfied",
        "Good quality",
        "Worth the price",
        "Nice product",
        "Good value",
      ],
      descriptions: [
        "Really good product! The quality is solid and it works well. I'm satisfied with my purchase.",
        "Great product for the price. Good quality and it does what it's supposed to do. Would recommend.",
        "Very satisfied with this purchase. The quality is good and it meets my expectations.",
        "Good product overall. Some minor flaws but nothing major. Worth the money.",
        "Nice product with decent quality. It works well and I'm happy with the purchase.",
        "Good value for money. The product is well-made and functions as expected.",
      ],
    },
    5: {
      titles: [
        "Excellent quality!",
        "Amazing product!",
        "Highly recommend",
        "Perfect!",
        "Love it!",
        "Outstanding quality",
      ],
      descriptions: [
        "Excellent product! The quality is outstanding and I'm very happy with my purchase. Highly recommend!",
        "Amazing product! Exceeded my expectations. Great quality and excellent value for money.",
        "Perfect product! Exactly as described. High quality and I'm very satisfied. Will definitely buy again.",
        "Outstanding quality! This product is fantastic and I'm extremely happy with my purchase.",
        "Love this product! The quality is excellent and it's perfect for my needs. Highly recommend to others.",
        "This product exceeded my expectations. Excellent quality and great value. Very satisfied!",
      ],
    },
  };

  const reviewData = reviewsByRating[rating];
  const randomTitle =
    reviewData.titles[Math.floor(Math.random() * reviewData.titles.length)];
  const randomDescription =
    reviewData.descriptions[
      Math.floor(Math.random() * reviewData.descriptions.length)
    ];

  return {
    title: randomTitle,
    description: randomDescription,
    rating: rating,
  };
}
