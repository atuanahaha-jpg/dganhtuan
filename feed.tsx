"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { PostCard, type FeedPost } from "@/components/post-card";
import { LoaderCircle } from "lucide-react";

type Page = { data: FeedPost[]; nextCursor: string | null };
async function getPosts(cursor?: string): Promise<Page> {
  const params = new URLSearchParams({ limit: "18" });
  if (cursor) params.set("cursor", cursor);
  const response = await fetch(`/api/posts?${params}`);
  if (!response.ok) throw new Error("Could not load posts");
  return response.json() as Promise<Page>;
}
export function Feed() {
  const sentinel = useRef<HTMLDivElement>(null);
  const query = useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: ({ pageParam }) => getPosts(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined
  });
  useEffect(() => {
    const node = sentinel.current;
    if (!node || !query.hasNextPage) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting) && !query.isFetchingNextPage) void query.fetchNextPage();
    }, { rootMargin: "500px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);
  if (query.isPending) return <div className="masonry">{Array.from({length: 8}, (_,i) => <div key={i} className="masonry-item animate-pulse overflow-hidden rounded-2xl border border-border bg-surface"><div className={`bg-elevated ${i % 2 ? "h-72" : "h-96"}`}/><div className="space-y-2 p-4"><div className="h-3 w-2/3 rounded bg-elevated"/><div className="h-3 w-1/3 rounded bg-elevated"/></div></div>)}</div>;
  if (query.isError) return <div role="alert" className="rounded-2xl border border-border p-8 text-center"><p className="font-semibold">Couldn’t load the feed</p><button onClick={() => void query.refetch()} className="mt-3 text-sm text-primary">Try again</button></div>;
  const posts = query.data.pages.flatMap((page) => page.data);
  if (!posts.length) return <div className="rounded-2xl border border-dashed border-border p-12 text-center"><p className="text-lg font-semibold">A fresh canvas awaits.</p><p className="mt-2 text-sm text-muted">Be the first to share something beautiful.</p></div>;
  return <><div className="masonry">{posts.map((post) => <PostCard key={post.id} post={post}/>)}</div><div ref={sentinel} className="flex min-h-16 items-center justify-center text-muted">{query.isFetchingNextPage && <LoaderCircle className="animate-spin" size={20}/>}</div></>;
}
