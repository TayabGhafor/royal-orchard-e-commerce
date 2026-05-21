import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SiteShell } from "@/components/SiteShell";
import { Icon } from "@/components/Icon";
import { ScrollReveal, revealContainerVariants, revealItemVariants } from "@/components/ScrollReveal";
import { blogThumbSrc, fetchPublishedBlogs, type BlogSummary } from "@/lib/blogsApi";

const Blog = () => {
  const [posts, setPosts] = useState<BlogSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPublishedBlogs()
      .then((res) => setPosts(res.items || []))
      .catch((e: Error) => setError(e.message || "Failed to load blogs"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SiteShell>
      <div
        className="bg-warm-cream text-dark-soil font-body overflow-x-hidden min-h-screen"
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/p6.png")' }}
      >
        <ScrollReveal as="section" className="relative pt-28 pb-20 px-6 overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-30">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-retro-gold/30 blob-shape blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-ochre/20 blob-shape-alt blur-3xl" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <span className="text-olive uppercase tracking-[0.4em] font-bold text-xs mb-6 inline-block bg-retro-gold/20 px-4 py-1 rounded-full">
              Editorial
            </span>
            <h1 className="text-5xl md:text-7xl font-headline font-black text-dark-soil leading-[0.9] tracking-tight">
              The Royal <span className="text-terracotta italic">Journal</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-dark-soil/70 max-w-2xl mx-auto leading-relaxed">
              Stories from the grove — ripening rituals, harvest mornings, and recipes passed through three
              generations.
            </p>
          </div>
        </ScrollReveal>

        <section className="px-6 pb-32 max-w-6xl mx-auto">
          {loading && (
            <div className="flex justify-center py-24">
              <span className="inline-flex h-8 w-8 animate-spin rounded-full border-2 border-terracotta border-t-transparent" />
            </div>
          )}
          {error && (
            <p className="text-center text-rose-600 py-12 font-semibold">{error}</p>
          )}
          {!loading && !error && posts.length === 0 && (
            <p className="text-center text-dark-soil/50 py-16">No stories published yet.</p>
          )}
          <motion.div
            variants={revealContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.08 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10"
          >
            {posts.map((post) => (
              <motion.article
                key={post._id}
                variants={revealItemVariants}
                className="group"
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="block bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden editorial-shadow border border-white/60 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="aspect-[16/10] overflow-hidden relative">
                    {post.thumbnail ? (
                      <img
                        src={blogThumbSrc(post.thumbnail)}
                        alt=""
                        className="w-full h-full object-cover sepia-effect group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-ochre/30 to-retro-gold/40 flex items-center justify-center">
                        <Icon name="article" className="text-6xl text-terracotta/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-soil/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="p-8">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(post.tags || []).slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-bold uppercase tracking-widest text-olive bg-olive/10 px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-2xl font-headline font-black text-dark-soil group-hover:text-terracotta transition-colors leading-tight">
                      {post.title}
                    </h2>
                    <p className="mt-3 text-dark-soil/65 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                    <div className="mt-6 flex items-center justify-between text-sm text-dark-soil/50">
                      <span>{post.author}</span>
                      <span className="flex items-center gap-3">
                        {post.publishedAt && (
                          <time dateTime={post.publishedAt}>
                            {new Date(post.publishedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </time>
                        )}
                        <span>{post.readTimeMinutes} min read</span>
                      </span>
                    </div>
                    <span className="mt-4 inline-flex items-center gap-1 text-terracotta font-bold text-sm group-hover:gap-2 transition-all">
                      Read story <Icon name="arrow_forward" className="text-base" />
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        </section>
      </div>
    </SiteShell>
  );
};

export default Blog;
