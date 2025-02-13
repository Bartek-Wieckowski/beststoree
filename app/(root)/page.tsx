import Link from 'next/link'
// import { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: 'Home',
// }
 
export default async function HomePage() {
  return (
    <div>
      <h1>Home</h1>
      <Link href="/about">About</Link>
    </div>
  )
}