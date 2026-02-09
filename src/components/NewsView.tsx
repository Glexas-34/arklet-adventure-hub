import { motion } from "framer-motion";
import { newsArticles } from "@/data/newsData";

const categoryColors: Record<string, string> = {
  Celebrity: "bg-purple-600/80",
  Player: "bg-cyan-600/80",
  Tech: "bg-blue-600/80",
  Entertainment: "bg-pink-600/80",
  Trending: "bg-orange-600/80",
};

export function NewsView() {
  return (
    <div className="h-full overflow-y-auto p-4">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl md:text-2xl font-bold mb-4 text-foreground"
      >
        Arklet News
      </motion.h2>

      <div className="space-y-4 max-w-2xl">
        {newsArticles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="gradient-card rounded-xl p-4 border border-white/5"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0 mt-0.5">{article.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full text-white ${
                      categoryColors[article.category] || "bg-gray-600/80"
                    }`}
                  >
                    {article.category}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{article.date}</span>
                </div>
                <h3 className="font-bold text-foreground text-sm md:text-base leading-snug mb-1.5">
                  {article.title}
                </h3>
                <p className="text-xs text-foreground/70 leading-relaxed mb-2">{article.content}</p>
                <p className="text-[10px] text-muted-foreground italic">By {article.author}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
