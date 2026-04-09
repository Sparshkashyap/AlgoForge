import { Link } from "react-router-dom";
import { Code2 } from "lucide-react";

const footerLinks = {
  Product: ["Problems", "Contests", "Leaderboard", "AI Assistant", "Roadmap"],
  Company: ["About", "Careers", "Blog", "Press"],
  Resources: ["Documentation", "Community", "Support", "Status"],
  Legal: ["Privacy", "Terms", "Security"],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                <Code2 className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-heading text-lg font-bold">AlgoForge</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Practice Smarter. Build Faster. Crack Better.
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-heading font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© 2026 AlgoForge. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Twitter</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">GitHub</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Discord</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
