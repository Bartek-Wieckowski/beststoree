'use client';
import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function ProductImages({ images }: { images: string[] }){
  const [current, setCurrent] = useState(0);
  const validImages = images.filter(img => img && img.trim() !== '');
  const currentImage = validImages[current] || validImages[0];

  if (!currentImage) return null;

  return (
    <div className='space-y-4'>
      <Image
        data-testid='product-image-main'
        src={currentImage}
        alt='product image'
        width={1000}
        height={1000}
        className='min-h-[18.75rem] object-cover object-center'
      />
      <div className='flex'>
        {validImages.map((image, index) => (
          <div
            key={image}
            onClick={() => setCurrent(index)}
            className={cn(
              'border mr-2 cursor-pointer hover:border-orange-600',
              current === index && 'border-orange-500'
            )}
          >
            <Image
              src={image}
              alt='image'
              width={100}
              height={100}
              data-testid='product-image-thumbnail'
            />
          </div>
        ))}
      </div>
    </div>
  );
};

