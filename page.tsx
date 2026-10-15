"use client";
import Link from "next/link";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Navbar } from "@/components/navbar";
import { UploadCloud, Image as ImageIcon, X, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

type FilePreview = { file: File; preview: string; altText: string };
export default function UploadPage() {
  const [items, setItems] = useState<FilePreview[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [busy, setBusy] = useState(false);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"], "image/webp": [".webp"], "image/avif": [".avif"] },
    maxSize: 15 * 1024 * 1024, maxFiles: 10,
    onDrop: (accepted) => setItems((old) => [...old, ...accepted].slice(0, 10).map((file) => ({ file, preview: URL.createObjectURL(file), altText: "" })))
  });
  async function publish() {
    if (!items.length) { toast.error("Choose at least one image."); return; }
    if (!title.trim()) { toast.error("Add a title."); return; }
    if (items.some((item) => !item.altText.trim())) { toast.error("Add alt text for every image."); return; }
    setBusy(true);
    try {
      const uploaded: { url: string; altText: string }[] = [];
      for (const item of items) {
        const presign = await fetch("/api/upload/presign", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ filename: item.file.name, contentType: item.file.type, size: item.file.size }) });
        const result = await presign.json() as { data?: { uploadUrl: string; publicUrl: string }; error?: { message: string } };
        if (!presign.ok || !result.data) throw new Error(result.error?.message || "Could not prepare upload.");
        const put = await fetch(result.data.uploadUrl, { method: "PUT", headers: { "Content-Type": item.file.type }, body: item.file });
        if (!put.ok) throw new Error("Upload failed. Check your R2 CORS settings.");
        uploaded.push({ url: result.data.publicUrl, altText: item.altText });
      }
      const response = await fetch("/api/posts", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ title, description, altText: uploaded[0].altText, imageUrl: uploaded[0].url, tags: tags.split(",").map((x)=>x.trim()).filter(Boolean) }) });
      const postResult = await response.json() as { data?: { slug: string }; error?: { message: string } };
      if (!response.ok || !postResult.data) throw new Error(postResult.error?.message || "Could not publish post.");
      toast.success("Your post is live!");
      window.location.href = `/p/${postResult.data.slug}`;
    } catch (error) { toast.error(error instanceof Error ? error.message : "Something went wrong."); }
    finally { setBusy(false); }
  }
  return <><Navbar/><main className="container max-w-4xl py-10"><div className="mb-8"><p className="text-xs font-semibold uppercase tracking-[.2em] text-primary">Make something memorable</p><h1 className="mt-2 font-display text-3xl font-bold">Share your work</h1><p className="mt-2 text-muted">Upload an image and tell the story behind it.</p></div><div {...getRootProps()} className={`cursor-pointer rounded-2xl border border-dashed p-10 text-center transition sm:p-14 ${isDragActive?"border-primary bg-primary/10":"border-border bg-surface hover:border-primary/50"}`}><input {...getInputProps()}/><div className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary"><UploadCloud size={27}/></div><p className="mt-4 font-semibold">{isDragActive?"Drop your images here":"Drag & drop your images here"}</p><p className="mt-2 text-sm text-muted">or click to browse · JPG, PNG, WebP, AVIF · up to 15 MB each</p><p className="mt-3 text-xs text-muted">Up to 10 images can be selected. This post form publishes the first image.</p></div>{items.length>0 && <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">{items.map((item,i)=><div key={`${item.file.name}-${i}`} className="overflow-hidden rounded-xl border border-border bg-surface"><div className="relative"><img src={item.preview} alt={`Preview ${i+1}`} className="aspect-[4/3] w-full object-cover"/><button aria-label="Remove image" onClick={()=>setItems((old)=>old.filter((_,index)=>index!==i))} className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5"><X size={15}/></button></div><div className="p-3"><p className="truncate text-xs text-muted">{item.file.name}</p><input value={item.altText} onChange={(e)=>setItems((old)=>old.map((x,index)=>index===i?{...x,altText:e.target.value}:x))} required placeholder="Describe this image (alt text)" className="mt-2 w-full rounded-lg border border-border bg-elevated px-2 py-2 text-xs outline-none focus:border-primary"/></div></div>)}</div>}<section className="mt-8 grid gap-5 rounded-2xl border border-border bg-surface p-5 sm:p-7"><label className="text-sm font-medium">Title<input value={title} onChange={(e)=>setTitle(e.target.value)} maxLength={120} placeholder="Give your post a title" className="mt-2 w-full rounded-xl border border-border bg-elevated px-4 py-3 outline-none focus:border-primary"/></label><label className="text-sm font-medium">Description <span className="text-muted">(optional)</span><textarea value={description} onChange={(e)=>setDescription(e.target.value)} maxLength={3000} rows={4} placeholder="What should people know about this moment?" className="mt-2 w-full resize-y rounded-xl border border-border bg-elevated px-4 py-3 outline-none focus:border-primary"/></label><label className="text-sm font-medium">Tags <span className="text-muted">(comma separated)</span><input value={tags} onChange={(e)=>setTags(e.target.value)} placeholder="nature, travel, photography" className="mt-2 w-full rounded-xl border border-border bg-elevated px-4 py-3 outline-none focus:border-primary"/></label><div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Link href="/" className="rounded-xl border border-border px-5 py-3 text-center text-sm font-medium">Cancel</Link><button onClick={()=>void publish()} disabled={busy||!items.length} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white disabled:opacity-50">{busy?<><LoaderCircle className="animate-spin" size={17}/> Publishing…</>:<><ImageIcon size={17}/> Publish post</>}</button></div></section></main></>;
}
