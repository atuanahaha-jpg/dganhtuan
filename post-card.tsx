"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { useState } from "react";
import { formatCount } from "@/lib/utils";

export type FeedPost = {
  id: string; slug: string; title: string; description: string | null;
  user: { username: string; name: string | null; image: string | null };
  images: { url: string; thumbnailUrl: string | null; altText: string }[];
  tags: { tag: { name: string } }[];
  _count: { likes: number; comments: number };
};

export function PostCard({ post }: { post: FeedPost }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const image = post.images[0];
  return <article className="masonry-item group overflow-hidden rounded-2xl border border-border bg-surface transition duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-glow">
    <Link href={`/p/${post.slug}`} className="image-card relative block overflow-hidden bg-elevated">
      {image ? <Image src={image.thumbnailUrl || image.url} alt={image.altText} width={900} height={1100} unoptimized className="h-auto max-h-[620px] w-full object-cover" /> : <div className="aspect-[4/3]"/>}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"/>
      <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 text-white opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
        <p className="font-semibold">{post.title}</p><p className="mt-1 line-clamp-2 text-xs text-white/75">{post.description}</p>
      </div>
    </Link>
    <div className="p-3.5">
      <div className="flex items-center gap-2">
        <div className="grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-500/30 to-violet-500/30 text-xs font-bold">{(post.user.name || post.user.username).slice(0,1).toUpperCase()}</div>
        <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{post.user.name || post.user.username}</p><p className="text-xs text-muted">@{post.user.username}</p></div>
        <button aria-label="Like post" onClick={() => setLiked(!liked)} className={`rounded-lg p-2 transition ${liked ? "text-pink-400" : "text-muted hover:text-pink-400"}`}><Heart size={17} fill={liked ? "currentColor" : "none"}/></button>
        <button aria-label="Save post" onClick={() => setSaved(!saved)} className={`rounded-lg p-2 transition ${saved ? "text-primary" : "text-muted hover:text-foreground"}`}><Bookmark size={16} fill={saved ? "currentColor" : "none"}/></button>
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-muted"><span className="inline-flex items-center gap-1"><Heart size={13}/>{formatCount(post._count.likes + (liked ? 1 : 0))}</span><span className="inline-flex items-center gap-1"><MessageCircle size={13}/>{formatCount(post._count.comments)}</span></div>
      {post.tags.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{post.tags.slice(0,3).map(({tag}) => <Link key={tag.name} href={`/search?q=${encodeURIComponent(tag.name)}`} className="rounded-full bg-elevated px-2 py-1 text-[10px] text-muted hover:text-primary">#{tag.name}</Link>)}</div>}
    </div>
  </article>;
}
