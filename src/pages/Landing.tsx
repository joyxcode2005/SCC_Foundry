import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, Target, FolderGit2, Sparkles, ChevronRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[var(--cream)] flex flex-col font-['DM_Sans',_sans-serif]">
      
      {/* Navbar (Transparent over Hero) */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-8 py-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2.5 animate-fade-up">
          <div className="w-8 h-8 bg-[var(--amber)] rounded-md flex items-center justify-center shadow-lg shadow-[var(--amber)]/20">
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
              <path d="M2 2h4v4H2V2zM8 2h4v4H8V2zM2 8h4v4H2V8zM8 8h4v4H8V8z" fill="white" fillOpacity="0.95"/>
            </svg>
          </div>
          <span className="font-display text-[22px] font-bold text-[var(--cream)] tracking-[-0.02em]">
            Foundry
          </span>
        </div>
        
        <div className="flex items-center gap-6 animate-fade-up">
          <Link to="/login" className="text-[var(--cream-dark)] text-sm font-medium hover:text-[var(--amber)] transition-colors">
            Sign In
          </Link>
          <Link to="/register" className="text-sm font-medium bg-white/10 hover:bg-white/20 text-[var(--cream)] backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-lg transition-all duration-300">
            Create Account
          </Link>
        </div>
      </nav>

      {/* Hero Section (Dark Theme with Glassmorphism) */}
      <header className="relative bg-[var(--obsidian)] min-h-[90vh] flex items-center justify-center overflow-hidden px-8 pt-20">
        {/* Architectural Grid Background */}
        <div 
          className="absolute inset-0 bg-[length:40px_40px] opacity-60"
          style={{
            backgroundImage: `
              linear-gradient(rgba(250,248,243,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(250,248,243,0.04) 1px, transparent 1px)
            `,
          }} 
        />
        
        {/* Decorative Amber Flares */}
        <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full border border-[var(--amber)]/20 blur-[2px]" />
        <div className="absolute top-1/4 -left-32 w-[400px] h-[400px] rounded-full bg-[var(--amber)]/5 blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center mt-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-fade-up">
            <Sparkles size={14} className="text-[var(--amber)]" />
            <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--cream-dark)]">
              Tech Society Portal
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold text-[var(--cream)] leading-[1.1] tracking-[-0.02em] mb-6 animate-fade-up-delay-1">
            Forge your ideas into <br className="hidden md:block" />
            <span className="italic text-[var(--amber-light)] pr-2">excellence.</span>
          </h1>
          
          <p className="text-[var(--cream-dark)]/70 text-lg md:text-xl max-w-2xl leading-relaxed mb-10 animate-fade-up-delay-2 font-light">
            The ultimate ecosystem to track your academic progress, collaborate on innovative projects, and rise to the top of the leaderboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-up-delay-3">
            <Link to="/register" className="group flex items-center gap-2 bg-[var(--amber)] text-[var(--obsidian)] px-8 py-3.5 rounded-lg font-medium text-[15px] hover:bg-[var(--amber-light)] transition-all duration-300 shadow-[0_0_20px_rgba(200,134,42,0.3)] hover:shadow-[0_0_30px_rgba(200,134,42,0.5)] hover:-translate-y-0.5">
              Enter the Foundry
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/projects" className="flex items-center gap-2 text-[var(--cream)] px-8 py-3.5 rounded-lg font-medium text-[15px] hover:bg-white/5 transition-colors duration-300">
              Explore Projects
            </Link>
          </div>
        </div>

        {/* Bottom Fade out */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--cream)] to-transparent" />
      </header>

      {/* Core Features Section */}
      <section className="py-24 px-8 relative z-10 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16 animate-fade-up">
          <div className="accent-line mx-auto" />
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--obsidian)] mb-4">
            Everything you need to build and scale.
          </h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
            A purpose-built workspace designed to keep you focused, competitive, and constantly shipping.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="foundry-card p-8 group hover:-translate-y-1 transition-transform duration-300 animate-fade-up-delay-1">
            <div className="w-12 h-12 rounded-xl bg-[var(--amber-pale)] text-[var(--amber)] flex items-center justify-center mb-6">
              <Target size={24} />
            </div>
            <h3 className="font-display text-xl font-bold text-[var(--obsidian)] mb-3">
              Task Assignments
            </h3>
            <p className="text-[var(--text-secondary)] text-[14px] leading-relaxed mb-6">
              Pick up tailored tasks, submit your pull requests, and receive actionable peer reviews to level up your development skills.
            </p>
            <Link to="/tasks" className="inline-flex items-center text-[13px] font-bold text-[var(--amber)] hover:text-[var(--obsidian)] transition-colors uppercase tracking-wide">
              View Tasks <ChevronRight size={14} className="ml-1" />
            </Link>
          </div>

          {/* Feature 2 */}
          <div className="foundry-card p-8 group hover:-translate-y-1 transition-transform duration-300 animate-fade-up-delay-2">
            <div className="w-12 h-12 rounded-xl bg-[#EEF7F0] text-[#2D7A4A] flex items-center justify-center mb-6">
              <FolderGit2 size={24} />
            </div>
            <h3 className="font-display text-xl font-bold text-[var(--obsidian)] mb-3">
              Collaborative Projects
            </h3>
            <p className="text-[var(--text-secondary)] text-[14px] leading-relaxed mb-6">
              Form teams and manage large-scale tech initiatives. Track contributions and build a portfolio of shipped products.
            </p>
            <Link to="/projects" className="inline-flex items-center text-[13px] font-bold text-[var(--amber)] hover:text-[var(--obsidian)] transition-colors uppercase tracking-wide">
              Browse Projects <ChevronRight size={14} className="ml-1" />
            </Link>
          </div>

          {/* Feature 3 */}
          <div className="foundry-card p-8 group hover:-translate-y-1 transition-transform duration-300 animate-fade-up-delay-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--obsidian)] text-[var(--cream)] flex items-center justify-center mb-6">
              <Trophy size={24} />
            </div>
            <h3 className="font-display text-xl font-bold text-[var(--obsidian)] mb-3">
              Global Leaderboard
            </h3>
            <p className="text-[var(--text-secondary)] text-[14px] leading-relaxed mb-6">
              Earn points for merged PRs, active participation, and completed tasks. Climb the ranks and establish your reputation.
            </p>
            <Link to="/leaderboard" className="inline-flex items-center text-[13px] font-bold text-[var(--amber)] hover:text-[var(--obsidian)] transition-colors uppercase tracking-wide">
              Check Rankings <ChevronRight size={14} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="mt-auto border-t border-[var(--cream-border)] py-8 px-8 text-center bg-white/50">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-4 h-4 bg-[var(--amber)] rounded-sm flex items-center justify-center">
             <svg width="8" height="8" viewBox="0 0 14 14" fill="none"><path d="M2 2h4v4H2V2zM8 2h4v4H8V2zM2 8h4v4H2V8zM8 8h4v4H8V8z" fill="white" /></svg>
          </div>
          <span className="font-display font-bold text-[var(--obsidian)]">Foundry</span>
        </div>
        <p className="text-[13px] text-[var(--text-muted)]">
          Built for continuous growth. &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}