"use client";
import Link from "next/link";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Search, Upload, Sun, Moon, Compass, Flame, Menu, X, Image as ImageIcon } from "lucide-react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  return <header className="glass sticky top-0 z-40 border-x-0 border-t-0">
    <div className="container flex h-[72px] items-center gap-4">
      <Link href="/" className="flex shrink-0 items-center gap-2 font-display text-xl font-bold tracking-tight">
        <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 shadow-glow"><ImageIcon size={19} /></span>
        Photoshop
      </Link>
      <form action="/search" className="ml-4 hidden max-w-md flex-1 md:flex">
        <label className="flex w-full items-center gap-2 rounded-full border border-border bg-elevated px-4 py-2.5 text-muted focus-within:border-primary">
          <Search size={17}/><input name="q" placeholder="Search images, users, tags..." className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted" />
          <kbd className="rounded border border-border px-1.5 text-[10px]">⌘K</kbd>
        </label>
      </form>
      <nav className="ml-auto hidden items-center gap-6 text-sm text-muted lg:flex">
        <Link className="hover:text-foreground" href="/">Home</Link>
        <Link className="hover:text-foreground" href="/trending"><span className="inline-flex items-center gap-1"><Flame size={15}/> Trending</span></Link>
        <Link className="hover:text-foreground" href="/explore"><span className="inline-flex items-center gap-1"><Compass size={15}/> Explore</span></Link>
      </nav>
      <div className="ml-auto flex items-center gap-2 lg:ml-4">
        <button aria-label="Toggle theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="hidden rounded-xl p-2 text-muted hover:bg-elevated hover:text-foreground sm:inline-flex">{theme === "dark" ? <Sun size={18}/> : <Moon size={18}/>}</button>
        <Link href="/upload" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"><Upload size={16}/><span className="hidden sm:inline">Upload</span></Link>
        <button aria-label="Open menu" onClick={() => setOpen(!open)} className="rounded-xl p-2 lg:hidden">{open ? <X size={19}/> : <Menu size={19}/>}</button>
      </div>
    </div>
    {open && <nav className="container grid gap-1 pb-4 lg:hidden"><Link onClick={() => setOpen(false)} className="rounded-lg p-3 hover:bg-elevated" href="/">Home</Link><Link onClick={() => setOpen(false)} className="rounded-lg p-3 hover:bg-elevated" href="/trending">Trending</Link><Link onClick={() => setOpen(false)} className="rounded-lg p-3 hover:bg-elevated" href="/explore">Explore</Link><Link onClick={() => setOpen(false)} className="rounded-lg p-3 hover:bg-elevated" href="/login">Sign in</Link></nav>}
  </header>;
}
