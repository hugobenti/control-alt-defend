import Link from "next/link";

import { notFoundMetadata } from "@/content/metadata";
import { statusPages } from "@/content/statusPages";

import { notFound } from "./not-found.style";

export const metadata = notFoundMetadata;

export default function NotFound() {
  return (
    <main className={notFound.base}>
      <h1 className={notFound.title}>{statusPages.notFound.h1}</h1>
      <p className={notFound.text}>{statusPages.notFound.text}</p>
      <Link href="/" className={notFound.link}>
        {statusPages.notFound.home}
      </Link>
    </main>
  );
}
