import { BookOpen, Mail, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function LessonMockupFooter() {
  return <footer className="lesson-reference-footer">
    <div><strong><Sparkles size={16}/>Math Universe</strong><p>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</p></div>
    <div className="lesson-reference-footer-links"><Link to="/sitemap">Sitemap</Link><Link to="/docs"><BookOpen size={14}/>Docs</Link><Link to="/about"><Mail size={14}/>About</Link></div>
    <small>© 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small>
    <small>www.IndianServers.com · info@IndianServers.com</small>
  </footer>;
}
