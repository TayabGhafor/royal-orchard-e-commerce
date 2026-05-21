import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import { SiteShell } from "@/components/SiteShell";
import { Icon } from "@/components/Icon";
import { ScrollReveal } from "@/components/ScrollReveal";
import { blogThumbSrc, fetchBlogBySlug, type BlogPost as BlogPostType } from "@/lib/blogsApi";

function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-terracotta origin-left z-[60]"
      style={{ scaleX }}
    />
  );
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchBlogBySlug(slug)
      .then((res) => setPost(res.blog))
      .catch((e: Error) => setError(e.message || "Story not found"))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <SiteShell>
      <ReadingProgress />
      <div
        className="bg-warm-cream text-dark-soil font-body overflow-x-hidden min-h-screen"
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/p6.png")' }}
      >
        <div className="pt-24 px-6">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-terracotta hover:gap-3 transition-all max-w-3xl mx-auto mb-8"
          >
            <Icon name="arrow_back" /> All stories
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center py-32">
            <span className="inline-flex h-8 w-8 animate-spin rounded-full border-2 border-terracotta border-t-transparent" />
          </div>
        )}

        {error && (
          <div className="text-center py-32 px-6">
            <p className="text-rose-600 font-semibold mb-4">{error}</p>
            <Link to="/blog" className="text-terracotta font-bold hover:underline">
              Back to journal
            </Link>
          </div>
        )}

        {post && !loading && (
          <>
            <ScrollReveal as="header" className="relative max-w-4xl mx-auto px-6 pb-12">
              {post.thumbnail && (
                <div className="film-grain organic-border overflow-hidden aspect-[21/9] mb-10 border-[12px] border-white shadow-2xl">
                  <img
                    src={blogThumbSrc(post.thumbnail)}
                    alt=""
                    className="w-full h-full object-cover sepia-effect"
                  />
                </div>
              )}
              <div className="flex flex-wrap gap-2 mb-4">
                {(post.tags || []).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-bold uppercase tracking-widest text-olive bg-olive/10 px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl md:text-6xl font-headline font-black text-dark-soil leading-[0.95] tracking-tight">
                {post.title}
              </h1>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-dark-soil/60 text-sm font-medium">
                <span>{post.author}</span>
                <span className="w-1 h-1 rounded-full bg-ochre" />
                {post.publishedAt && (
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                )}
                <span className="w-1 h-1 rounded-full bg-ochre" />
                <span>{post.readTimeMinutes} min read</span>
              </div>
            </ScrollReveal>

            <ScrollReveal
              as="article"
              variant="fade-up"
              delay={0.08}
              className="max-w-3xl mx-auto px-6 pb-32"
            >
              <div
                className="prose prose-lg prose-stone max-w-none
                  prose-headings:font-headline prose-headings:text-dark-soil prose-headings:tracking-tight
                  prose-p:text-dark-soil/85 prose-p:leading-relaxed
                  prose-a:text-terracotta prose-strong:text-dark-soil
                  prose-blockquote:border-ochre prose-blockquote:text-terracotta prose-blockquote:font-medium prose-blockquote:not-italic
                  prose-li:text-dark-soil/85 prose-img:rounded-xl prose-img:shadow-lg"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </ScrollReveal>

            <ScrollReveal as="footer" className="max-w-3xl mx-auto px-6 pb-24 text-center">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-on-primary font-bold hover:opacity-90 transition-opacity"
              >
                <Icon name="arrow_back" /> More from the journal
              </Link>
            </ScrollReveal>
          </>
        )}
      </div>
    </SiteShell>
  );
};

export default BlogPost;
