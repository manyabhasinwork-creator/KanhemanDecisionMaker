import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "./dashboard/sign-out-button";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="wrap">
      <div className="nav-row">
        {user ? (
          <>
            <Link href="/dashboard" className="btn">
              Dashboard
            </Link>
            <SignOutButton />
          </>
        ) : (
          <Link href="/login" className="btn primary">
            Sign in
          </Link>
        )}
      </div>

      <header className="hero">
        <span className="tag">Prototype &middot; v1</span>
        <h1>Decision Coach</h1>
        <p className="subhead">
          A conversational decision reflection tool, grounded in
          decision-science concepts from the ASDM course.
        </p>
        <p className="subhead">
          You describe a real decision you&apos;re facing. It asks questions
          before it offers answers.
        </p>
      </header>

      <section>
        <h2>The problem</h2>
        <p>
          Most decisions never get a structured review of the reasoning
          behind them. A manager explains a choice, and the explanation is
          taken at face value, even though the explanation is often shaped by
          the same blind spots it&apos;s supposed to reveal.
        </p>
        <div className="example">
          <div className="label">A typical decision</div>
          <p>
            &quot;I think we should go with the incumbent vendor. We&apos;ve
            worked with them for years.&quot;
          </p>
        </div>
        <p>
          That could be a justified call based on reliability and switching
          costs. Or it could be a reference point doing more work than the
          evidence supports. From the sentence alone, it&apos;s impossible to
          tell &mdash; and that&apos;s the gap this tool is built to sit in.
        </p>
      </section>

      <section>
        <h2>How it works</h2>
        <div className="steps">
          <div className="step">
            <div className="n">1</div>
            <div className="t">
              <strong>Describe the decision</strong>
              <span>By voice or chat &mdash; whichever is faster in the moment.</span>
            </div>
          </div>
          <div className="step">
            <div className="n">2</div>
            <div className="t">
              <strong>Get asked, not told</strong>
              <span>
                Adaptive follow-up questions surface the assumptions,
                reference points, and evidence gaps behind the reasoning
                &mdash; tailored to what you actually say, not a fixed
                script.
              </span>
            </div>
          </div>
          <div className="step">
            <div className="n">3</div>
            <div className="t">
              <strong>A tentative read, not a verdict</strong>
              <span>
                For v1, scoped to two lenses: anchoring and overconfidence.
                Every interpretation comes with a confidence level.
              </span>
            </div>
          </div>
          <div className="step">
            <div className="n">4</div>
            <div className="t">
              <strong>A way to stress-test it</strong>
              <span>
                Instead of telling you what to decide, it suggests a concrete
                way to examine your own thinking &mdash; comparing
                alternatives independently, naming what evidence would change
                your mind.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>How confident it is, always stated</h2>
        <p>
          The coach never forces a diagnosis when the conversation
          doesn&apos;t support one. Every read falls into one of three tiers:
        </p>
        <div className="tiers">
          <div className="tier">
            <div className="name">Supported</div>
            <div className="desc">
              The conversation surfaced concrete evidence for a specific
              reasoning gap.
            </div>
          </div>
          <div className="tier">
            <div className="name">Plausible</div>
            <div className="desc">
              Some signals are present, but other explanations remain just as
              likely.
            </div>
          </div>
          <div className="tier">
            <div className="name">Insufficient evidence</div>
            <div className="desc">
              No reasonable basis to call out a bias &mdash; you get a
              structured way to examine the decision anyway.
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>What v1 is, and isn&apos;t</h2>
        <div className="scope-grid">
          <div className="scope-col in">
            <div className="heading">In scope</div>
            <ul className="scope-list">
              <li>Voice and chat</li>
              <li>Two lenses: anchoring, overconfidence</li>
              <li>Simple email sign-in, for me and a small circle of friends</li>
              <li>Free</li>
            </ul>
          </div>
          <div className="scope-col out">
            <div className="heading">Deliberately left out</div>
            <ul className="scope-list">
              <li>Saved conversation history</li>
              <li>Every bias, every decision type</li>
              <li>Monetization</li>
              <li>Team or dashboard features</li>
            </ul>
          </div>
        </div>
      </section>

      <footer>
        <div className="status">
          <span className="dot"></span> Early prototype &mdash; validating
          whether the questions surface something real, against a manual
          ASDM benchmark first.
        </div>
        <div>Decision Coach &middot; built as a personal product experiment.</div>
      </footer>
    </div>
  );
}
